package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"backend/database"
	"backend/middleware"
	"backend/models"
)

func GetThreads(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userId, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok || userId == 0 {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Parse query params
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	if page <= 0 {
		page = 1
	}
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if limit <= 0 {
		limit = 5
	}
	filter := r.URL.Query().Get("filter") // "created" or "followed"

	var threads []models.Thread
	query := database.DB.Model(&models.Thread{}).
		Preload("Prompt").
		Preload("Prompt.User").
		Preload("Prompt.Registry").
		Preload("User").
		Preload("Comments").
		Preload("Followers")

	if filter == "created" {
		query = query.Where("threads.user_id = ?", userId)
	} else if filter == "followed" {
		query = query.Joins("JOIN thread_followers ON thread_followers.thread_id = threads.id").
			Where("thread_followers.user_id = ?", userId)
	} else {
		// Default: show both or fallback to something sensible
		// User specifically asked for created/followed logic, so we might need a default behavior
		// Let's assume if no filter, we show both for this specific user
		query = query.Where("threads.user_id = ? OR threads.id IN (SELECT thread_id FROM thread_followers WHERE user_id = ?)", userId, userId)
	}

	// Apply pagination
	offset := (page - 1) * limit
	if err := query.Order("created_at desc").Offset(offset).Limit(limit).Find(&threads).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Populate virtual field UserName
	for i := range threads {
		threads[i].UserName = threads[i].User.Username
		if threads[i].UserName == "" {
			threads[i].UserName = "Anonymous"
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(threads)
}

func GetRecentThreads(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userId, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok || userId == 0 {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	now := time.Now()
	// Start of day in local time
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	var threads []models.Thread
	// Find threads where user has commented today
	// We join with comments and select distinct threads
	err := database.DB.Model(&models.Thread{}).
		Distinct("threads.*").
		Joins("JOIN comments ON comments.thread_id = threads.id").
		Where("comments.user_id = ? AND comments.created_at >= ?", userId, startOfDay).
		Preload("Prompt").
		Order("threads.updated_at desc").
		Find(&threads).Error

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(threads)
}

