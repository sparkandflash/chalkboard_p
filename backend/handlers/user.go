package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"backend/database"
	"backend/middleware"
	"backend/models"
)

type UserMetricsResponse struct {
	Username           string `json:"username"`
	AccountAge         string `json:"accountAge"`
	Followers          int64  `json:"followers"`
	Following          int64  `json:"following"`
	PromptsCreated     int64  `json:"promptsCreated"`
	RegistriesCreated  int64  `json:"registriesCreated"`
	RegistriesFollowed int64  `json:"registriesFollowed"`
}

// GetUserMetrics computes standard engagement analytics for the profile page
func GetUserMetrics(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok || userID == 0 {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	var metrics UserMetricsResponse
	metrics.Username = user.Username

	// Calculate approximate dynamic account age
	duration := time.Since(user.CreatedAt)
	days := int(duration.Hours() / 24)
	if days == 0 {
		metrics.AccountAge = "0 Days"
	} else if days < 30 {
		if days == 1 {
			metrics.AccountAge = "1 Day"
		} else {
			metrics.AccountAge = fmt.Sprintf("%d Days", days)
		}
	} else if days < 365 {
		months := days / 30
		if months == 1 {
			metrics.AccountAge = "1 Month"
		} else {
			metrics.AccountAge = fmt.Sprintf("%d Months", months)
		}
	} else {
		years := days / 365
		if years == 1 {
			metrics.AccountAge = "1 Year"
		} else {
			metrics.AccountAge = fmt.Sprintf("%d Years", years)
		}
	}

	// Always emit 0 for the unsupported User Followers mechanism unless expanded later
	metrics.Followers = 0
	metrics.Following = 0

	// Count prompts created
	database.DB.Model(&models.Prompt{}).Where("user_id = ?", userID).Count(&metrics.PromptsCreated)

	// Count registries created
	database.DB.Model(&models.Registry{}).Where("user_id = ?", userID).Count(&metrics.RegistriesCreated)

	// Count registries followed (via generated pivot table)
	database.DB.Table("registry_followers").Where("user_id = ?", userID).Count(&metrics.RegistriesFollowed)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(metrics)
}
