package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	GoogleID  string         `json:"googleId" gorm:"uniqueIndex"`
	Email     string         `json:"email" gorm:"uniqueIndex"`
	Name      string         `json:"name"`
	AvatarURL string         `json:"avatarUrl"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
}
