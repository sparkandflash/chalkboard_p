import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card"
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

import { toast } from "sonner"

const Signup = ({ onSuccess }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await api.post('/signup', { username, email, password });
            const { token, user } = res.data;

            localStorage.setItem('auth_token', token);
            localStorage.setItem('user_email', user.email);
            window.dispatchEvent(new Event('authChange'));

            toast.success("Account created successfully!");
            if (onSuccess) onSuccess(user.email);
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error creating account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
            <Card className="w-full max-w-md bg-card border shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
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
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? 'Signing up...' : 'Sign Up'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;
