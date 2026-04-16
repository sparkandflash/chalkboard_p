package utils

import (
	"backend/database"
	"backend/models"
)

// CreateNotification is a reusable helper to insert a notification into the DB
func CreateNotification(userID uint, eventType string, eventData string) error {
	notification := models.Notification{
		UserID:    userID,
		Type:      eventType,
		EventData: eventData,
	}

	result := database.DB.Create(&notification)
	if result.Error != nil {
		LogError("Failed to create notification", result.Error)
		return result.Error
	}
	
	LogInfo("Notification created successfully for user ID: " + string(rune(userID)))
	return nil
}
