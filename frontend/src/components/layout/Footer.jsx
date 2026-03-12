import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="border-t bg-background h-[5vh] flex justify-center items-center shrink-0">
            <div className="container flex items-center justify-center gap-6 px-4 md:px-8">
                <Link to="/" className="text-sm font-medium hover:underline underline-offset-4">Home</Link>
                <button onClick={() => {/* logout handled in header or context usually, will wire up later */}} className="text-sm font-medium hover:underline underline-offset-4">logout</button>
                <Link to="/settings" className="text-sm font-medium hover:underline underline-offset-4">settings</Link>
                <Link to="/" className="text-sm font-medium hover:underline underline-offset-4">my registries</Link>
            </div>
        </footer>
    );
};
