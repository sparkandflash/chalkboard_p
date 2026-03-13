package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/rs/cors"

	"backend/database"
	"backend/handlers"
	"backend/middleware"
	"backend/models"
	"backend/utils"
)

type LoginRequest struct {
	Token string `json:"token"`
}

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize Logging
	utils.InitLogging()

	// Connect to Database
	database.Connect()
	// Auto Migrate
	database.DB.AutoMigrate(&models.User{}, &models.Registry{}, &models.Prompt{}, &models.Thread{}, &models.Comment{})

	mux := http.NewServeMux()

	// Auth Handlers
	mux.HandleFunc("/signup", func(w http.ResponseWriter, r *http.Request) {
		middleware.LoggingMiddleware(http.HandlerFunc(handlers.Signup)).ServeHTTP(w, r)
	})
	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		middleware.LoggingMiddleware(http.HandlerFunc(handlers.Login)).ServeHTTP(w, r)
	})

	// Registry Handlers
	mux.HandleFunc("/registries", func(w http.ResponseWriter, r *http.Request) {
		handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodGet {
				handlers.GetUserRegistries(w, r)
				return
			}
			if r.Method == http.MethodPost {
				handlers.CreateRegistry(w, r)
				return
			}
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		})
		middleware.LoggingMiddleware(middleware.AuthMiddleware(handler)).ServeHTTP(w, r)
	})

	// Prompt Handlers
	mux.HandleFunc("/prompts", func(w http.ResponseWriter, r *http.Request) {
		handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodGet {
				handlers.GetPrompts(w, r) // Public?
				return
			}
			if r.Method == http.MethodPost {
				middleware.AuthMiddleware(http.HandlerFunc(handlers.CreatePrompt)).ServeHTTP(w, r)
				return
			}
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		})
		middleware.LoggingMiddleware(handler).ServeHTTP(w, r)
	})

	// Thread Handlers
	mux.HandleFunc("/threads", func(w http.ResponseWriter, r *http.Request) {
		handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodGet {
				handlers.GetThreads(w, r)
				return
			}
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		})
		middleware.LoggingMiddleware(middleware.AuthMiddleware(handler)).ServeHTTP(w, r)
	})

	mux.HandleFunc("/recent-threads", func(w http.ResponseWriter, r *http.Request) {
		handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodGet {
				handlers.GetRecentThreads(w, r)
				return
			}
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		})
		middleware.LoggingMiddleware(middleware.AuthMiddleware(handler)).ServeHTTP(w, r)
	})

	// Add CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Vue/React app
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(mux)

	utils.LogInfo("Server starting on :8080...")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		utils.LogError("Error starting server", err)
	}
}
