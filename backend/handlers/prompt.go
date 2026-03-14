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
