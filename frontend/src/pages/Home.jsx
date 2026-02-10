import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom';
import api from '../api';

import { RegistrySkeleton } from "@/components/skeletons/RegistrySkeleton"

const Home = () => {
    const [registries, setRegistries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRegistries = async () => {
            try {
                // Initial delay to show off skeleton (simulating network, remove in prod if desired)
                await new Promise(resolve => setTimeout(resolve, 500));
                const res = await api.get('/registries');
                setRegistries(res.data || []);
            } catch (error) {
                console.error("Failed to fetch registries", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRegistries();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">My Prompt Registries</h2>
                    <div className="flex gap-4">
                        <div className="w-32 h-10 bg-muted rounded-md animate-pulse"></div>
                        <div className="w-32 h-10 bg-muted rounded-md animate-pulse"></div>
                    </div>
                </div>
                <RegistrySkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">My Prompt Registries</h2>
                <div className="flex gap-4">
                    <Button asChild variant="outline" className="border-2 font-semibold">
                        <Link to="/create-registry">
                            + New Registry
                        </Link>
                    </Button>
                    <Button asChild className="font-semibold">
                        <Link to="/create-prompt">
                            + Add Prompt
                        </Link>
                    </Button>
                </div>
            </div>

            {registries.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-lg border border-dashed">
                    <p className="text-muted-foreground text-lg mb-4">You don't have any registries yet.</p>
                    <Button asChild>
                        <Link to="/create-registry">Create Your First Registry</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {registries.map((registry) => (
                        <Card key={registry.id} className="border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="p-6 border-b bg-muted/20">
                                <Link to={`/registry/${registry.id}`} className="hover:underline">
                                    <h4 className="font-bold text-xl text-primary">{registry.name}</h4>
                                </Link>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                    {registry.description || "No description provided."}
                                </p>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center">
                                    <Badge variant="secondary" className="px-3 py-1 rounded-pill">
                                        {registry.prompts?.length || 0} Prompts
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        Updated {new Date(registry.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
