package utils

import (
	"time"

	"backend/database"
	"backend/models"
)

// StartNotificationPurgeJob runs in the background and periodically cleans up old notifications.
// Read notifications older than 24 hours are removed.
// Unread notifications older than 7 days are removed.
func StartNotificationPurgeJob() {
	ticker := time.NewTicker(1 * time.Hour)
	go func() {
		for {
			<-ticker.C
			PurgeOldNotifications()
		}
	}()
}

// PurgeOldNotifications contains the actual logic to delete expired notifications from the DB.
func PurgeOldNotifications() {
	now := time.Now()

	// 1. Purge read notifications older than 24 hours
	oneDayAgo := now.Add(-24 * time.Hour)
	resultRead := database.DB.Where("read = ? AND created_at < ?", true, oneDayAgo).Delete(&models.Notification{})
	if resultRead.Error != nil {
		LogError("Failed to purge read notifications", resultRead.Error)
	} else if resultRead.RowsAffected > 0 {
		LogInfo("Purged old read notifications.")
	}

	// 2. Purge unread notifications older than 7 days
	sevenDaysAgo := now.Add(-7 * 24 * time.Hour)
	resultUnread := database.DB.Where("read = ? AND created_at < ?", false, sevenDaysAgo).Delete(&models.Notification{})
	if resultUnread.Error != nil {
		LogError("Failed to purge unread notifications", resultUnread.Error)
	} else if resultUnread.RowsAffected > 0 {
		LogInfo("Purged old unread notifications.")
	}
}
