package models

import (
	"time"

	"gorm.io/gorm"
)

type Prompt struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	UserID      uint           `json:"userId" gorm:"index"` // Foreign Key
	User        User           `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	RegistryID  uint           `json:"registryId" gorm:"index"` // Foreign Key
	Registry    Registry       `json:"registry" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Title       string         `json:"title" gorm:"not null"`
	Content     string         `json:"content" gorm:"not null"`
	Description string         `json:"description"`
	Version     string         `json:"version"`
	Tags        string         `json:"tags"` // JSON string or comma-separated
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `json:"deletedAt" gorm:"index"`
}
