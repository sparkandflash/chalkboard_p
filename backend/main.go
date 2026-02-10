package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"google.golang.org/api/idtoken"

	"backend/database"
	"backend/handlers"
	"backend/middleware"
	"backend/models"
)

type LoginRequest struct {
	Token string `json:"token"`
}

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	clientID := os.Getenv("GOOGLE_CLIENT_ID")
	if clientID == "" {
		log.Fatal("GOOGLE_CLIENT_ID is not set in .env")
	}

	// Connect to Database
	database.Connect()
	// Auto Migrate
	database.DB.AutoMigrate(&models.User{}, &models.Prompt{})

	mux := http.NewServeMux()

	// Login Handler
	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		payload, err := idtoken.Validate(context.Background(), req.Token, clientID)
		if err != nil {
			log.Printf("Error validating token: %v", err)
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		email, ok := payload.Claims["email"].(string)
		if !ok {
			http.Error(w, "Email not found in token", http.StatusInternalServerError)
			return
		}

		fmt.Printf("User Logged In: %s\n", email)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"email": email})
	})

	// Prompt Handlers
	// GET /prompts - Public
	mux.HandleFunc("/prompts", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			handlers.GetPrompts(w, r)
			return
		}
		// POST /prompts - Protected
		if r.Method == http.MethodPost {
			middleware.AuthMiddleware(http.HandlerFunc(handlers.CreatePrompt)).ServeHTTP(w, r)
			return
		}
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})

	// Add CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"}, // Vue/React app
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(mux)

	fmt.Println("Server starting on :8080...")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
