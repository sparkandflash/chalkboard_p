import { useState, useEffect } from 'react'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'
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
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={RouterLink} to="/">GlobalPrompts</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          {userEmail ? (
            <Nav className="align-items-center gap-3">
              <Button as={RouterLink} to="/create" variant="outline-success">
                Create Prompt
              </Button>
              <Button onClick={handleLogout} variant="danger" size="sm">
                Logout
              </Button>
            </Nav>
          ) : (
            <div className="bg-white rounded p-1">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log('Login Failed')}
                shape="pill"
                size="medium"
              />
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

function App() {
  const [userEmail, setUserEmail] = useState(null);

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('google_id_token');
    if (token) {
      // Optimistically set user as logged in
      // For this v1, checking token existence is enough for UI toggle
    }
  }, []);


  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <Header userEmail={userEmail} setUserEmail={setUserEmail} />
        <Container>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/create" element={<CreatePrompt />} />
          </Routes>
        </Container>
      </div>
    </Router>
  )
}

export default App
