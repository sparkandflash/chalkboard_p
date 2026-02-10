import { useState } from 'react'
import { Box, Container, Heading, Text, VStack, useToast } from '@chakra-ui/react'
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'

function App() {
  const [userEmail, setUserEmail] = useState(null)
  const toast = useToast()

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      // Send the token to the backend
      const res = await axios.post('http://localhost:8080/login', { token: credential });

      setUserEmail(res.data.email);
      toast({
        title: "Login Successful",
        description: `Welcome, ${res.data.email}!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

    } catch (error) {
      console.error("Login failed", error);
      toast({
        title: "Login Failed",
        description: "Could not verify token with backend.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLoginError = () => {
    console.log('Login Failed');
    toast({
      title: "Login Error",
      description: "Google sign-in was unsuccessful.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" centerContent>
      <Box padding="4" bg="gray.100" maxW="3xl" mt="20" borderRadius="lg" w="100%" textAlign="center">
        <VStack spacing={8}>
          <Heading as="h1" size="xl">Welcome to the App</Heading>

          {userEmail ? (
            <Box>
              <Text fontSize="xl" mb={4}>You are logged in as:</Text>
              <Heading as="h3" size="lg" color="green.500">{userEmail}</Heading>
            </Box>
          ) : (
            <Box>
              <Text mb={6}>Please sign in to continue</Text>
              <Box display="flex" justifyContent="center">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                />
              </Box>
            </Box>
          )}
        </VStack>
      </Box>
    </Container>
  )
}

export default App
