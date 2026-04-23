package utils

import (
	"net/http"
	"strings"
)

// botUserAgents contains substrings that identify social media crawlers and AI agents
var botUserAgents = []string{
	// Social Media & Messaging
	"discordbot", "twitterbot", "facebookexternalhit", "slackbot",
	"linkedinbot", "whatsapp", "telegrambot", "iframely", "embedly",
	"pinterest", "vkshare", "w3c_validator",

	// Search Engines
	"googlebot", "bingbot", "yandexbot", "duckduckbot", "baiduspider", "applebot",

	// AI Agents & Crawlers
	"gptbot", "oai-searchbot", "chatgpt-user",           // OpenAI
	"claudebot", "claude-searchbot", "claude-user",       // Anthropic
	"perplexitybot", "perplexity-user",                   // Perplexity
	"google-extended", "gemini-deep-research",            // Google/Gemini
	"meta-externalagent",                                 // Meta
	"ccbot", "commoncrawl",                               // Common Crawl
	"bytespider",                                         // ByteDance/TikTok
	"youbot",                                             // You.com
	"duckassistbot",                                      // DuckAssist
}

// IsBot checks if the request's User-Agent matches any known crawlers or AI agents
func IsBot(r *http.Request) bool {
	ua := strings.ToLower(r.Header.Get("User-Agent"))
	for _, bot := range botUserAgents {
		if strings.Contains(ua, bot) {
			return true
		}
	}
	return false
}
