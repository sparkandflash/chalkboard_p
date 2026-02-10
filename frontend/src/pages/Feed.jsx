import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import api from '../api';

const Feed = () => {
    const [prompts, setPrompts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const res = await api.get('/prompts');
                setPrompts(res.data);
            } catch (error) {
                console.error("Failed to fetch prompts", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrompts();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Global Prompts</h2>
            {prompts.length === 0 ? (
                <p className="text-muted-foreground text-lg">No prompts found. Be the first to create one!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {prompts.map((prompt) => (
                        <Card key={prompt.id} className="border bg-card text-card-foreground shadow-sm">
                            <CardHeader className="flex flex-row items-center gap-4 p-6 border-b bg-muted/20">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                    <AvatarImage src={prompt.user?.avatarUrl} />
                                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                                        {prompt.user?.name?.[0] || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <h4 className="font-bold text-base text-foreground">{prompt.title}</h4>
                                    <span className="text-sm text-muted-foreground">
                                        by {prompt.user?.name || 'Anonymous'}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">Description</h5>
                                    <p className="text-base text-foreground/90 line-clamp-3 leading-relaxed">
                                        {prompt.description}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {prompt.tags && prompt.tags.split(',').map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="px-3 py-1 text-sm font-medium rounded-pill bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {tag.trim()}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Feed;
