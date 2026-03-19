package handlers

import (
	"encoding/json"
	"net/http"

	"backend/database"
	"backend/middleware"
	"backend/models"

	"gorm.io/gorm"
)

func CreatePrompt(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userId, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok || userId == 0 {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req models.Prompt
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Set the UserID from the authenticated token
	req.UserID = userId

	// Wrap in a transaction to ensure both prompt and default thread are created
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&req).Error; err != nil {
			return err
		}

		// Create default thread
		defaultThread := models.Thread{
			UserID:      req.UserID,
			PromptID:    req.ID,
			Description: req.Description,
			IsDefault:   true,
		}
		if err := tx.Create(&defaultThread).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(req)
}

func GetPrompts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var prompts []models.Prompt
	if result := database.DB.Preload("User").Order("created_at desc").Find(&prompts); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(prompts)
}

func DeletePrompt(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	idStr := r.PathValue("id")
	if idStr == "" {
		// Fallback for older Go or manual parsing if using manual routing
		pathLen := len(r.URL.Path)
		if pathLen > len("/prompts/") {
			idStr = r.URL.Path[len("/prompts/"):]
		}
	}

	if idStr == "" {
		http.Error(w, "Missing prompt ID", http.StatusBadRequest)
		return
	}

	var prompt models.Prompt
	if err := database.DB.First(&prompt, idStr).Error; err != nil {
		http.Error(w, "Prompt not found", http.StatusNotFound)
		return
	}

	if prompt.UserID != userID {
		http.Error(w, "Unauthorized to delete this prompt", http.StatusForbidden)
		return
	}

	// Cascade soft-delete: threads → prompt, in a transaction
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// 1. Soft-delete all threads linked to this prompt
		if err := tx.Where("prompt_id = ?", prompt.ID).Delete(&models.Thread{}).Error; err != nil {
			return err
		}
		// 2. Soft-delete the prompt itself
		return tx.Delete(&prompt).Error
	})

	if err != nil {
		http.Error(w, "Failed to delete prompt", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Prompt deleted successfully"})
}
