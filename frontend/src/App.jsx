import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useNavigate, Navigate } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

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

// Header Component
const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth_token'));
  const userEmail = localStorage.getItem('user_email');

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Sync state with local storage (simple way)
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('auth_token'));
    };
    window.addEventListener('storage', checkAuth); // Listen for changes
    // Check on mount
    checkAuth();
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <nav className="border-b bg-background shadow-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <RouterLink to="/" className="text-xl font-bold tracking-tight text-primary">
            GlobalPrompts
          </RouterLink>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {isLoggedIn ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline-block">
                {userEmail}
              </span>
              <Button asChild variant="ghost" className="font-medium">
                <RouterLink to="/">
                  My Registries
                </RouterLink>
              </Button>
              <Button onClick={handleLogout} variant="destructive" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <RouterLink to="/login">Login</RouterLink>
              </Button>
              <Button asChild>
                <RouterLink to="/signup">Sign Up</RouterLink>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background pb-20 transition-colors duration-300">
          <Header />
          <div className="container py-10">
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
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
