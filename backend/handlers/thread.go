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
		Joins("JOIN prompts ON prompts.id = threads.prompt_id AND prompts.deleted_at IS NULL").
		Joins("JOIN registries ON registries.id = prompts.registry_id AND registries.deleted_at IS NULL").
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

func GetThreadDetail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idStr := r.URL.Path[len("/threads/"):]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid thread ID", http.StatusBadRequest)
		return
	}

	var thread models.Thread
	err = database.DB.Preload("Prompt").
		Preload("Prompt.User").
		Preload("Prompt.Registry").
		Preload("User").
		Preload("Comments").
		Preload("Comments.User").
		Preload("Followers").
		First(&thread, id).Error

	if err != nil {
		http.Error(w, "Thread not found", http.StatusNotFound)
		return
	}

	thread.UserName = thread.User.Username
	if thread.UserName == "" {
		thread.UserName = "Anonymous"
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(thread)
}

func GetPublicThread(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idStr := r.URL.Path[len("/p/"):]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid thread ID", http.StatusBadRequest)
		return
	}

	var thread models.Thread
	err = database.DB.Preload("Prompt").
		Preload("Prompt.User").
		Preload("Prompt.Registry").
		Preload("User").
		Preload("Comments").
		Preload("Comments.User").
		First(&thread, id).Error

	if err != nil {
		http.Error(w, "Thread not found", http.StatusNotFound)
		return
	}

	thread.UserName = thread.User.Username
	if thread.UserName == "" {
		thread.UserName = "Anonymous"
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(thread)
}

func SearchThreads(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	queryParam := r.URL.Query().Get("q")
	if queryParam == "" {
		http.Error(w, "Query parameter 'q' is required", http.StatusBadRequest)
		return
	}

	var threads []models.Thread
	err := database.DB.Model(&models.Thread{}).
		Joins("JOIN prompts ON prompts.id = threads.prompt_id AND prompts.deleted_at IS NULL").
		Joins("JOIN registries ON registries.id = prompts.registry_id AND registries.deleted_at IS NULL").
		Where("prompts.title ILIKE ?", "%"+queryParam+"%").
		Preload("Prompt").
		Preload("Prompt.User").
		Preload("Prompt.Registry").
		Preload("User").
		Preload("Comments").
		Preload("Followers").
		Find(&threads).Error

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for i := range threads {
		threads[i].UserName = threads[i].User.Username
		if threads[i].UserName == "" {
			threads[i].UserName = "Anonymous"
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(threads)
}

func ToggleFollowThread(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userId, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok || userId == 0 {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	idStr := r.URL.Path[len("/threads/") : len(r.URL.Path)-len("/follow")]
	threadId, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid thread ID", http.StatusBadRequest)
		return
	}

	var thread models.Thread
	if err := database.DB.Preload("Followers").First(&thread, threadId).Error; err != nil {
		http.Error(w, "Thread not found", http.StatusNotFound)
		return
	}

	var user models.User
	if err := database.DB.First(&user, userId).Error; err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Check if already following
	var isFollowing bool
	for _, f := range thread.Followers {
		if f.ID == userId {
			isFollowing = true
			break
		}
	}

	if isFollowing {
		// Unfollow
		err = database.DB.Model(&thread).Association("Followers").Delete(&user)
	} else {
		// Follow
		err = database.DB.Model(&thread).Association("Followers").Append(&user)
	}

	if err != nil {
		http.Error(w, "Failed to toggle follow status", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]bool{"isFollowing": !isFollowing})
}

func CreateComment(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userId, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok || userId == 0 {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Route could be /threads/:id/comments
	idStr := r.URL.Path[len("/threads/") : len(r.URL.Path)-len("/comments")]
	threadId, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid thread ID", http.StatusBadRequest)
		return
	}

	var reqBody struct {
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var thread models.Thread
	if err := database.DB.First(&thread, threadId).Error; err != nil {
		http.Error(w, "Thread not found", http.StatusNotFound)
		return
	}

	comment := models.Comment{
		Content:  reqBody.Content,
		UserID:   userId,
		ThreadID: uint(threadId),
	}

	if err := database.DB.Create(&comment).Error; err != nil {
		http.Error(w, "Failed to create comment", http.StatusInternalServerError)
		return
	}

	// Fetch with User preloaded to return full info
	database.DB.Preload("User").First(&comment, comment.ID)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(comment)
}

func UpdateThreadPrompt(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userId, ok := r.Context().Value(middleware.UserIDKey).(uint)
	if !ok || userId == 0 {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	idStr := r.URL.Path[len("/threads/") : len(r.URL.Path)-len("/prompt")]
	threadId, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid thread ID", http.StatusBadRequest)
		return
	}

	var reqBody struct {
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var thread models.Thread
	if err := database.DB.Preload("Prompt").First(&thread, threadId).Error; err != nil {
		http.Error(w, "Thread not found", http.StatusNotFound)
		return
	}

	if thread.UserID != userId {
		http.Error(w, "Forbidden: Only thread author can edit the prompt", http.StatusForbidden)
		return
	}

	thread.Prompt.Content = reqBody.Content
	if err := database.DB.Save(&thread.Prompt).Error; err != nil {
		http.Error(w, "Failed to update prompt content", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Prompt updated successfully"})
}
