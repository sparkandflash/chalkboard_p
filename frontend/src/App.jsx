import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { GoogleLogin } from '@react-oauth/google'
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom'
import axios from 'axios'

import Feed from './pages/Feed'
import CreatePrompt from './pages/CreatePrompt'

// Header Component
const Header = ({ userEmail, setUserEmail }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      // Send the token to the backend to verify and get email
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const res = await axios.post(`${apiUrl}/login`, { token: credential });

      const email = res.data.email;
      setUserEmail(email);
      // Store token for API requests
      localStorage.setItem('google_id_token', credential);

      console.log(`Welcome, ${email}!`);
    } catch (error) {
      console.error("Login failed", error);
      alert("Login Failed");
    }
  };

  const handleLogout = () => {
    setUserEmail(null);
    localStorage.removeItem('google_id_token');
    navigate('/');
    console.log("Logged out");
  };

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <RouterLink to="/" className="text-xl font-bold tracking-tight text-primary">
            GlobalPrompts
          </RouterLink>
        </div>

        <div className="flex items-center gap-4">
          {userEmail ? (
            <>
              <Button asChild variant="default" className="font-medium">
                <RouterLink to="/create">
                  Create Prompt
                </RouterLink>
              </Button>
              <Button onClick={handleLogout} variant="destructive" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log('Login Failed')}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  const [userEmail, setUserEmail] = useState(null);

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('google_id_token');
    if (token) {
      // Optimistically set user as logged in
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-secondary/30 pb-20"> {/* Light grey background wrapper */}
        <Header userEmail={userEmail} setUserEmail={setUserEmail} />
        <div className="container py-10"> {/* More top padding */}
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/create" element={<CreatePrompt />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
