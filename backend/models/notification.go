package models

import (
	"time"
)

type Notification struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"index" json:"user_id"` // Owner of the notification
	Type      string    `json:"type"`                 // e.g. "reply", "follow"
	EventData string    `json:"event_data"`           // The human readable string/JSON representation
	Read      bool      `gorm:"default:false;index" json:"read"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"-"`
}
