import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';

const Profile = () => {
    // Mock user statistics
    const stats = {
        username: localStorage.getItem('user_email') || 'User', // Falling back to email/username stored locally
        accountAge: '6 Months',
        followers: 124,
        following: 89,
        promptsCreated: 15,
        registriesCreated: 3,
        registriesFollowed: 12
    };

    return (
        <DashboardLayout>
            <div className="bg-card border rounded-lg p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{stats.username}</h1>
                        <p className="text-sm text-muted-foreground">Member for {stats.accountAge}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1 p-4 bg-muted/30 rounded-lg border border-transparent hover:border-border transition-colors">
                        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Followers</span>
                        <span className="text-3xl font-extrabold">{stats.followers}</span>
                    </div>
                    
                    <div className="flex flex-col gap-1 p-4 bg-muted/30 rounded-lg border border-transparent hover:border-border transition-colors">
                        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Following</span>
                        <span className="text-3xl font-extrabold">{stats.following}</span>
                    </div>

                    <div className="flex flex-col gap-1 p-4 bg-muted/30 rounded-lg border border-transparent hover:border-border transition-colors">
                        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Prompts</span>
                        <span className="text-3xl font-extrabold">{stats.promptsCreated}</span>
                    </div>

                    <div className="flex flex-col gap-1 p-4 bg-muted/30 rounded-lg border border-transparent hover:border-border transition-colors">
                        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Registries Created</span>
                        <span className="text-3xl font-extrabold">{stats.registriesCreated}</span>
                    </div>

                    <div className="flex flex-col gap-1 p-4 bg-muted/30 rounded-lg border border-transparent hover:border-border transition-colors">
                        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Registries Followed</span>
                        <span className="text-3xl font-extrabold">{stats.registriesFollowed}</span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
