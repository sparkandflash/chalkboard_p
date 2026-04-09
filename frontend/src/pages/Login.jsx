import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

import { toast } from "sonner"

const Login = ({ onSuccess }) => {
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await api.post('/login', { username, otp });
            const { token, user } = res.data;

            localStorage.setItem('auth_token', token);
            localStorage.setItem('user_username', user.username);
            // Replace legacy references just in case there are a few left!
            localStorage.setItem('user_email', user.username);

            window.dispatchEvent(new Event('authChange'));

            toast.success("Login successful!");
            if (onSuccess) onSuccess(user.username);
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid username or code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center flex-col items-center h-[calc(100vh-100px)] space-y-6">
            <div className="w-full max-w-md">
                <Alert className="mb-4 bg-primary/10 border-primary/20 text-primary">
                    <AlertTitle className="font-semibold">Existing Users</AlertTitle>
                    <AlertDescription>
                        existing users can get their 32-char totp key from our <a href="https://discord.gg/7ZFqE8Ne" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-primary/80">Discord server</a>.
                    </AlertDescription>
                </Alert>
            </div>
            <Card className="w-full max-w-md bg-card border shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Secure Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Your username"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="otp">Authenticator Code (6 Digits)</Label>
                            <Input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                pattern="\d{6}"
                                maxLength="6"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="font-mono text-center tracking-widest text-lg"
                            />
                        </div>
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading || otp.length !== 6}>
                            {isLoading ? 'Verifying...' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center flex-col space-y-2">
                    <p className="text-sm text-center text-muted-foreground">
                        We use passwordless TOTP authentication for maximum security.
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                        Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
