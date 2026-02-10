package handlers

import (
	"encoding/json"
	"net/http"

	"backend/database"
	"backend/middleware"
	"backend/models"
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
	if result := database.DB.Where("user_id = ?", userID).Preload("Prompts").Find(&registries); result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(registries)
}
