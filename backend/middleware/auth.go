package middleware

import (
	"backend/database"
	"backend/models"
	"context"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"google.golang.org/api/idtoken"
	"gorm.io/gorm"
)

type contextKey string

const UserIDKey contextKey = "userId"

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == authHeader {
			http.Error(w, "Invalid token format", http.StatusUnauthorized)
			return
		}

		clientID := os.Getenv("GOOGLE_CLIENT_ID")
		// idtoken.Validate requires a context, we can use background or request context
		// It creates a client, so ideally we shouldn't do this every request in prod for perf,
		// but standard library verified client caches internally.
		// For stricter environments we might create a validator instance.
		payload, err := idtoken.Validate(context.Background(), token, clientID)
		if err != nil {
			http.Error(w, "Invalid token: "+err.Error(), http.StatusUnauthorized)
			return
		}

		// Check expiry just in case
		if payload.Expires < time.Now().Unix() {
			http.Error(w, "Token expired", http.StatusUnauthorized)
			return
		}

		googleID := payload.Subject
		email, _ := payload.Claims["email"].(string)
		name, _ := payload.Claims["name"].(string)
		picture, _ := payload.Claims["picture"].(string)

		var user models.User
		// Find user by Google ID
		result := database.DB.Where("google_id = ?", googleID).First(&user)
		if result.Error != nil {
			if result.Error == gorm.ErrRecordNotFound {
				// Create new user
				user = models.User{
					GoogleID:  googleID,
					Email:     email,
					Name:      name,
					AvatarURL: picture,
				}
				if createErr := database.DB.Create(&user).Error; createErr != nil {
					log.Printf("Error creating user: %v", createErr)
					http.Error(w, "Error creating user", http.StatusInternalServerError)
					return
				}
			} else {
				log.Printf("Error finding user: %v", result.Error)
				http.Error(w, "Database error", http.StatusInternalServerError)
				return
			}
		}

		// Store User ID (uint) in context
		ctx := context.WithValue(r.Context(), UserIDKey, user.ID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
