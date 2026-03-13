# Build stage
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Install git for private repos if needed
RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

# Final stage
FROM alpine:latest

WORKDIR /app

RUN apk add --no-cache ca-certificates

COPY --from=builder /app/main .

# Standard port for Railway, but the app uses $PORT env var
EXPOSE 8080

CMD ["./main"]
