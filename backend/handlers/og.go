package handlers

import (
	"fmt"
	"html"
	"net/http"
	"os"
	"strconv"
	"strings"

	"backend/database"
	"backend/models"
)

// botUserAgents contains substrings that identify social media crawlers
var botUserAgents = []string{
	"discordbot", "twitterbot", "facebookexternalhit", "slackbot",
	"linkedinbot", "whatsapp", "telegrambot", "iframely", "embedly",
	"pinterest", "vkshare", "w3c_validator",
}

func isBot(r *http.Request) bool {
	ua := strings.ToLower(r.Header.Get("User-Agent"))
	for _, bot := range botUserAgents {
		if strings.Contains(ua, bot) {
			return true
		}
	}
	return false
}

func OGEmbed(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idStr := r.URL.Path[len("/og/"):]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid thread ID", http.StatusBadRequest)
		return
	}

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}
	spaURL := fmt.Sprintf("%s/p/%d", frontendURL, id)

	// Real browsers: just redirect to the SPA
	if !isBot(r) {
		http.Redirect(w, r, spaURL, http.StatusFound)
		return
	}

	// Bots: fetch thread data and serve static HTML with OG tags
	var thread models.Thread
	err = database.DB.Preload("Prompt").Preload("Prompt.Registry").Preload("User").First(&thread, id).Error
	if err != nil {
		http.Error(w, "Thread not found", http.StatusNotFound)
		return
	}

	title := thread.Prompt.Title
	if title == "" {
		title = "Prompt on globalPrompt"
	}
	ogTitle := html.EscapeString(title + " — globalPrompt")

	description := thread.Prompt.Content
	if len(description) > 200 {
		description = description[:200] + "..."
	}
	ogDescription := html.EscapeString(strings.ReplaceAll(description, "\n", " "))

	author := thread.User.Username
	if author == "" {
		author = "Anonymous"
	}

	// Serve minimal HTML page with full OG + Twitter card meta tags
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprintf(w, `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>%s</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content="%s" />
  <meta property="og:description" content="%s" />
  <meta property="og:url" content="%s" />
  <meta property="og:site_name" content="globalPrompt" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="%s" />
  <meta name="twitter:description" content="%s" />
  <meta name="author" content="%s" />
  <meta http-equiv="refresh" content="0; url=%s" />
</head>
<body>
  <p>Redirecting to <a href="%s">%s</a>...</p>
</body>
</html>`,
		ogTitle,
		ogTitle, ogDescription, spaURL,
		ogTitle, ogDescription,
		html.EscapeString(author),
		spaURL, spaURL, ogTitle,
	)
}
