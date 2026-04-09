import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card"
import { useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../api';

import { toast } from "sonner"

const Signup = ({ onSuccess }) => {
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [totpData, setTotpData] = useState(null); // { totpSecret, otpAuthUrl }
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await api.post('/signup', { username });
            
            // The backend now returns { totpSecret, otpAuthUrl } upon successful signup
            setTotpData(res.data);

            toast.success("Account created! Please save your authenticator code.");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error creating account');
        } finally {
            setIsLoading(false);
        }
    };

    if (totpData) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <Card className="w-full max-w-md bg-card border shadow-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Secure Your Account</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-6">
                        <p className="text-center text-sm text-muted-foreground">
                            Scan the QR code below using Google Authenticator, Authy, or any standard TOTP app.
                        </p>
                        <div className="bg-white p-4 rounded-xl shadow-sm border">
                            <QRCodeSVG value={totpData.otpAuthUrl} size={200} />
                        </div>
                        <div className="w-full space-y-2">
                            <p className="text-center text-sm font-medium">Or enter this code manually:</p>
                            <code className="block w-full p-3 text-center bg-muted rounded-md text-sm break-all font-mono">
                                {totpData.totpSecret}
                            </code>
                        </div>
                        <Button 
                            className="w-full" 
                            size="lg" 
                            onClick={() => navigate('/login')}
                        >
                            I have saved my code. Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? 'Creating secure account...' : 'Create Account'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center flex-col space-y-2">
                    <p className="text-sm text-center text-muted-foreground">
                        We use passwordless authentication. 
                        You will be provided a secure code to add to your Authenticator app.
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                        Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;
