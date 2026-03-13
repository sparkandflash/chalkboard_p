import { Button } from "@/components/ui/button" // Button might still be needed if used elsewhere, but checking App.jsx content... actually it was only used in Header. 
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useNavigate, Navigate } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
// ModeToggle is used in Header, so not needed here


import Home from './pages/Home'
import CreateRegistry from './pages/CreateRegistry'
import RegistryDetail from './pages/RegistryDetail'
import CreatePrompt from './pages/CreatePrompt'
import Login from './pages/Login'
import Signup from './pages/Signup'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
          <Header />
          <div className="w-full max-w-[1600px] mx-auto px-3 md:px-3 py-3 flex-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/create-registry" element={
                <ProtectedRoute>
                  <CreateRegistry />
                </ProtectedRoute>
              } />
              <Route path="/registry/:id" element={
                <ProtectedRoute>
                  <RegistryDetail />
                </ProtectedRoute>
              } />
              <Route path="/create-prompt" element={
                <ProtectedRoute>
                  <CreatePrompt />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
