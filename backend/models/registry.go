package models

import (
	"time"

	"gorm.io/gorm"
)

type Registry struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	UserID      uint           `json:"userId" gorm:"index"`
	User        User           `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Name        string         `json:"name" gorm:"not null"`
	Description string         `json:"description"`
	Prompts     []Prompt       `json:"prompts" gorm:"foreignKey:RegistryID"`
	Followers   []User         `json:"followers" gorm:"many2many:registry_followers;"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `json:"deletedAt" gorm:"index"`
}
