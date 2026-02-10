package utils

import (
	"io"
	"log"
	"os"
)

var (
	InfoLogger  *log.Logger
	ErrorLogger *log.Logger
)

func InitLogging() {
	file, err := os.OpenFile("app.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatal(err)
	}

	// Log to both file and stdout
	InfoLogger = log.New(io.MultiWriter(file, os.Stdout), "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	ErrorLogger = log.New(io.MultiWriter(file, os.Stderr), "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
}

func LogInfo(message string) {
	if InfoLogger == nil {
		InitLogging()
	}
	InfoLogger.Println(message)
}

func LogError(message string, err error) {
	if ErrorLogger == nil {
		InitLogging()
	}
	ErrorLogger.Printf("%s: %v", message, err)
}
