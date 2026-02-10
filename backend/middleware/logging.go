package middleware

import (
	"backend/utils"
	"net/http"
	"time"
)

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		utils.LogInfo("Started " + r.Method + " " + r.URL.Path)

		// Create a wrapper to capture status code
		wrappedWriter := &responseWriter{ResponseWriter: w, status: http.StatusOK}

		next.ServeHTTP(wrappedWriter, r)

		duration := time.Since(start)
		utils.LogInfo("Completed " + r.Method + " " + r.URL.Path + " Status: " + http.StatusText(wrappedWriter.status) + " Duration: " + duration.String())
	})
}

type responseWriter struct {
	http.ResponseWriter
	status int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.status = code
	rw.ResponseWriter.WriteHeader(code)
}
