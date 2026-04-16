package handlers

import (
	"encoding/json"
	"net/http"

	"backend/database"
	"backend/middleware"
	"backend/models"
	"backend/utils"
)

// GetNotifications returns the notifications for the authenticated user
func GetNotifications(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var notifications []models.Notification
	result := database.DB.Where("user_id = ?", userID).Order("created_at desc").Limit(50).Find(&notifications)
	if result.Error != nil {
		utils.LogError("Failed to fetch notifications", result.Error)
		http.Error(w, "Error fetching notifications", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifications)
}

// MarkNotificationRead updates the 'read' status of a specific notification
func MarkNotificationRead(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// For simplicity, we can extract the ID from the URL path: /notifications/{id}/read
	// Or we can expect it in the body. Let's do URL path manually since we use basic mux
	pathLen := len(r.URL.Path)
	// Example path: /notifications/123/read
	// "123" is between "/notifications/" (len 15) and "/read" (len 5)
	if pathLen <= 20 {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}
	
	idStr := r.URL.Path[15 : pathLen-5]

	result := database.DB.Model(&models.Notification{}).
		Where("id = ? AND user_id = ?", idStr, userID).
		Update("read", true)

	if result.Error != nil {
		utils.LogError("Failed to update notification", result.Error)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	if result.RowsAffected == 0 {
		http.Error(w, "Notification not found or unauthorized", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success":true}`))
}
