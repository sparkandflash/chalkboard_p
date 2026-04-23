package models

import (
	"time"

	"gorm.io/gorm"
)

type Thread struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	UserID      uint           `json:"userId" gorm:"index"` // Creator
	UserName    string         `json:"userName" gorm:"-"`   // Virtual field for frontend
	Description string         `json:"description"`
	User        User           `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	PromptID    uint           `json:"promptId" gorm:"index"` // Foreign Key
	Prompt      Prompt         `json:"prompt" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Comments    []Comment      `json:"comments" gorm:"foreignKey:ThreadID"`
	IsDefault   bool           `json:"isDefault" gorm:"default:false"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `json:"deletedAt" gorm:"index"`
}
