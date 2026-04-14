# ChalkBoard

ChalkBoard is a modern, collaborative prompt registry and thread platform. It allows users to create prompt registries, share detailed prompt threads, and interact with a community of prompt engineers.

## 🚀 Features

- **Prompt Registries**: Organize your AI prompts into logical collections.
- **Threaded Discussions**: Engage in deep dives into specific prompt versions and results.
- **SEO Optimized**: Custom server-side rendering for public prompts via a dedicated subdomain.
- **Bot-Friendly**: Built-in Open Graph and Twitter Card support for rich social sharing.
- **Guest Access**: Public threads are viewable without an account, encouraging organic search traffic.

## 🏗️ Architecture

ChalkBoard is split into two main components:

### 1. Frontend (`/frontend`)
- **Framework**: React with Vite.
- **Styling**: Tailwind CSS with custom UI components.
- **State Management**: React Hooks.
- **Deployment**: Hosted on **Vercel** (`chalkboard.cc`).

### 2. Backend (`/backend`)
- **Language**: Go (Golang).
- **ORM**: GORM with PostgreSQL support.
- **Authentication**: JWT-based auth with middleware.
- **SEO Layer**: Custom subdomain routing for `prompts.chalkboard.cc` that serves fast, pre-rendered HTML to crawlers.
- **Deployment**: Hosted on **Railway**.

## 🛠️ Local Development

### Prerequisites
- Go 1.21+
- Node.js 18+
- PostgreSQL

### Running the Backend
1. Navigate to `backend/`.
2. Create a `.env` file (see `.env.example`).
3. Run `go run main.go`.

### Running the Frontend
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Create a `.env` file with `VITE_API_URL`.
4. Run `npm run dev`.

## 🔍 SEO & Subdomains

ChalkBoard uses a unique dual-routing strategy to maximize search engine visibility:

- **Main App**: `chalkboard.cc` serves the interactive React SPA.
- **SEO Subdomain**: `prompts.chalkboard.cc` serves lightweight HTML versions of public threads directly from the Go backend.
- **Sitemap**: A dynamic `sitemap.xml` is served from the subdomain to ensure Google indexes every public prompt instantly.

## 📄 License

MIT
