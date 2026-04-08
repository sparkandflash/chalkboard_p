import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Footer = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth_token'));

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        window.dispatchEvent(new Event('authChange'));
        setIsLoggedIn(false);
        navigate('/login');
    };

    useEffect(() => {
        const checkAuth = () => {
            setIsLoggedIn(!!localStorage.getItem('auth_token'));
        };
        window.addEventListener('storage', checkAuth);
        window.addEventListener('authChange', checkAuth);
        checkAuth();
        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChange', checkAuth);
        };
    }, []);

    return (
        <footer className="border-t bg-background h-[5vh] max-[900px]:h-[7vh] flex justify-center items-center shrink-0 max-[900px]:fixed max-[900px]:bottom-0 max-[900px]:w-full max-[900px]:z-50">
            {/* Desktop and Tablet Footer (>= 900px) */}
            <div className="container items-center justify-center gap-2 px-4 md:px-8 hidden min-[900px]:flex w-full h-full">
                <Link to="/" className="text-sm font-medium hover:underline underline-offset-4">Home</Link>
                 <span className="text-muted-foreground">•</span>
                {isLoggedIn && (
                    <>
                        <button onClick={handleLogout} className="text-sm font-medium hover:underline underline-offset-4">logout</button>
                        <span className="text-muted-foreground">•</span>
                    </>
                )}
                <Link to="/settings" className="text-sm font-medium hover:underline underline-offset-4">settings</Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/docs" className="text-sm font-medium hover:underline underline-offset-4">docs</Link>
            </div>

            {/* Mobile Footer (< 900px) */}
            <div className="container items-center justify-center gap-4 px-4 flex min-[900px]:hidden w-full h-full">
                <Link to="/" className="text-sm font-medium hover:underline underline-offset-4">Home</Link>
                <span className="text-muted-foreground">•</span>
                <button className="text-sm font-medium hover:underline underline-offset-4">Menu</button>
            </div>
        </footer>
    );
};
