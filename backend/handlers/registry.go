package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"backend/database"
	"backend/middleware"
	"backend/models"

	"gorm.io/gorm"
)

type CreateRegistryRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

func CreateRegistry(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req CreateRegistryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	registry := models.Registry{
		UserID:      userID,
		Name:        req.Name,
		Description: req.Description,
	}

	if result := database.DB.Create(&registry); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(registry)
}

func GetUserRegistries(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var registries []models.Registry
	if result := database.DB.Where("user_id = ?", userID).Preload("Prompts").Preload("Prompts.Threads").Find(&registries); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(registries)
}

func DeleteRegistry(w http.ResponseWriter, r *http.Request) {
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
		if pathLen > len("/registries/") {
			idStr = r.URL.Path[len("/registries/"):]
		}
	}

	if idStr == "" {
		http.Error(w, "Missing registry ID", http.StatusBadRequest)
		return
	}

	var registry models.Registry
	if err := database.DB.First(&registry, idStr).Error; err != nil {
		http.Error(w, "Registry not found", http.StatusNotFound)
		return
	}

	if registry.UserID != userID {
		http.Error(w, "Unauthorized to delete this registry", http.StatusForbidden)
		return
	}

	// Cascade soft-delete: threads → prompts → registry, all in one transaction
	err := database.DB.Transaction(func(tx *gorm.DB) error {
		// 1. Soft-delete all threads whose prompt belongs to this registry
		if err := tx.Where(
			"prompt_id IN (SELECT id FROM prompts WHERE registry_id = ? AND deleted_at IS NULL)",
			registry.ID,
		).Delete(&models.Thread{}).Error; err != nil {
			return err
		}

		// 2. Soft-delete all prompts in this registry
		if err := tx.Where("registry_id = ?", registry.ID).Delete(&models.Prompt{}).Error; err != nil {
			return err
		}

		// 3. Soft-delete the registry itself
		return tx.Delete(&registry).Error
	})

	if err != nil {
		http.Error(w, "Failed to delete registry", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Registry deleted successfully"})
}

func ToggleFollowRegistry(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userId, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok || userId == 0 {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	idStr := r.URL.Path[len("/registries/") : len(r.URL.Path)-len("/follow")]
	registryId, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid registry ID", http.StatusBadRequest)
		return
	}

	var registry models.Registry
	if err := database.DB.Preload("Followers").First(&registry, registryId).Error; err != nil {
		http.Error(w, "Registry not found", http.StatusNotFound)
		return
	}

	var user models.User
	if err := database.DB.First(&user, userId).Error; err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Check if already following
	var isFollowing bool
	for _, f := range registry.Followers {
		if f.ID == userId {
			isFollowing = true
			break
		}
	}

	if isFollowing {
		// Unfollow
		err = database.DB.Model(&registry).Association("Followers").Delete(&user)
	} else {
		// Follow
		err = database.DB.Model(&registry).Association("Followers").Append(&user)
		// We could send a notification to the registry owner if we wanted!
	}

	if err != nil {
		http.Error(w, "Failed to toggle follow status", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]bool{"isFollowing": !isFollowing})
}
