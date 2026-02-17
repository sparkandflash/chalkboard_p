import { useState, useEffect } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

export const Header = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth_token'));
    const userEmail = localStorage.getItem('user_email');

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        setIsLoggedIn(false);
        navigate('/login');
    };

    useEffect(() => {
        const checkAuth = () => {
            setIsLoggedIn(!!localStorage.getItem('auth_token'));
        };
        window.addEventListener('storage', checkAuth);
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">User</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {userEmail}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-border" />
                                    <DropdownMenuItem asChild>
                                        <RouterLink to="/">My Registries</RouterLink>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-border" />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
