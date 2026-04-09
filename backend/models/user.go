package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Username   string         `json:"username" gorm:"uniqueIndex;not null"`
	TOTPSecret string         `json:"-" gorm:"not null"` // stored as plain base32 hook
	Role      string         `json:"role" gorm:"default:'default'"` // default, mod, admin
	AvatarURL string         `json:"avatarUrl"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
}
