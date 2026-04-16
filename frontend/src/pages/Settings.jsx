import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';

const Settings = () => {
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [copied, setCopied] = useState(false);

    // Mock TOTP Token
    const mockTotpToken = "JBSWY3DPEHPK3PXP";

    const handleCopyTotp = () => {
        navigator.clipboard.writeText(mockTotpToken);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveUsername = (e) => {
        e.preventDefault();
        // In a real app we'd dispatch to API here
        alert('Username updated to: ' + username);
    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (confirmed) {
            alert('Account deleted.');
            // logout logic here
        }
    };

    return (
        <DashboardLayout>
            <div className="bg-card border rounded-lg p-8 shadow-sm max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-foreground mb-8">Account Settings</h1>

                <form onSubmit={handleSaveUsername} className="mb-10 p-5 bg-background border rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Change Username</h2>
                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-sm text-muted-foreground font-medium">New Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter new username"
                        />
                    </div>
                    <Button type="submit" variant="default">Save Username</Button>
                </form>

                <div className="mb-10 p-5 bg-background border rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Two-Factor Authentication</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        If you need to reconfigure your authenticator app, you can copy your secret TOTP token below.
                    </p>
                    <div className="flex items-center gap-4">
                        <code className="px-3 py-2 bg-muted rounded-md text-sm font-mono tracking-wider">{mockTotpToken}</code>
                        <Button variant="outline" onClick={handleCopyTotp}>
                            {copied ? 'Copied!' : 'Copy Token'}
                        </Button>
                    </div>
                </div>

                <div className="p-5 border border-destructive/20 bg-destructive/5 rounded-lg">
                    <h2 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
