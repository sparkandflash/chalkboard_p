import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import api from '../api';

const RegistryDetail = () => {
    const { id } = useParams();
    const [registry, setRegistry] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRegistry = async () => {
            try {
                // Since we don't have a direct /registries/:id endpoint, 
                // we fetch all and find the one (temporary solution for V1).
                // Ideally backend should support GET /registries/:id
                const res = await api.get('/registries');
                const found = res.data.find(r => r.id === parseInt(id));
                setRegistry(found);
            } catch (error) {
                console.error("Failed to fetch registry", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRegistry();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!registry) {
        return (
            <div className="text-center py-10">
                <h3 className="text-xl font-bold">Registry not found</h3>
                <Button asChild className="mt-4">
                    <Link to="/">Back to Home</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link to="/" className="text-muted-foreground hover:underline text-sm">← Back to Registries</Link>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">{registry.name}</h2>
                    <p className="text-muted-foreground text-lg mt-1">{registry.description}</p>
                </div>
                <Button asChild className="font-semibold">
                    <Link to={`/create-prompt?registryId=${registry.id}`}>
                        + Add Prompt
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {registry.prompts?.length === 0 ? (
                    <div className="text-center py-10 bg-muted/20 rounded-lg">
                        <p className="text-muted-foreground">No prompts in this registry yet.</p>
                    </div>
                ) : (
                    registry.prompts.map((prompt) => (
                        <Card key={prompt.id} className="border bg-card text-card-foreground shadow-sm">
                            <CardHeader className="flex flex-row items-center gap-4 p-6 border-b bg-muted/10">
                                <Avatar className="h-10 w-10 border border-white shadow-sm">
                                    <AvatarImage src={prompt.user?.avatarUrl} />
                                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                        {prompt.user?.name?.[0] || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-lg text-foreground">{prompt.title}</h4>
                                        <Badge variant="outline" className="text-xs font-mono">{prompt.version || 'v1.0'}</Badge>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        Updated {new Date(prompt.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap font-mono text-sm bg-muted/30 p-4 rounded-md border">
                                        {prompt.content}
                                    </p>

                                    {prompt.description && (
                                        <p className="text-sm text-muted-foreground italic border-l-2 border-primary/20 pl-3">
                                            {prompt.description}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {prompt.tags && prompt.tags.split(',').map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="px-2 py-0.5 text-xs font-medium rounded-pill bg-secondary text-secondary-foreground">
                                                {tag.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default RegistryDetail;
