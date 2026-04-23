import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import api from '../api';

const Profile = () => {
    const [stats, setStats] = useState({
        username: localStorage.getItem('username') || 'User',
        accountAge: '...',
        followers: 0,
        following: 0,
        promptsCreated: 0,
        registriesCreated: 0,
        registriesFollowed: 0
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await api.get('/profile/metrics');
                if (res.data) {
                    setStats(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch profile metrics:", err);
            }
        };
        fetchMetrics();
    }, []);

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
