import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import api from '../api';

import { toast } from "sonner"
import { PromptSkeleton } from "@/components/skeletons/PromptSkeleton"

const RegistryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [registry, setRegistry] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isManaging, setIsManaging] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const currentUsername = localStorage.getItem('username');

    useEffect(() => {
        const fetchRegistry = async () => {
            try {
                // Initial delay to show off skeleton
                await new Promise(resolve => setTimeout(resolve, 500));

                // Since we don't have a direct /registries/:id endpoint, 
                // we fetch all and find the one (temporary solution for V1).
                const res = await api.get('/registries');
                const found = res.data.find(r => r.id === parseInt(id));

                if (!found) {
                    toast.error("Registry not found");
                }
                setRegistry(found);

                // Check if the current user is already following
                if (found?.followers) {
                    setIsFollowing(found.followers.some(f => f.username === currentUsername));
                }
            } catch (error) {
                console.error("Failed to fetch registry", error);
                toast.error("Failed to load registry details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRegistry();
    }, [id, currentUsername]);

    const isOwner = registry?.userId === undefined
        ? false
        : registry?.user?.username === currentUsername;

    const handleFollowToggle = async () => {
        try {
            setIsFollowing(prev => !prev); // optimistic
            const res = await api.post(`/registries/${id}/follow`);
            if (res.data && typeof res.data.isFollowing === 'boolean') {
                setIsFollowing(res.data.isFollowing);
            }
            toast.success(isFollowing ? 'Unfollowed registry' : 'Following registry!');
        } catch (error) {
            console.error("Failed to toggle follow", error);
            setIsFollowing(prev => !prev); // revert
            toast.error("Failed to update follow status");
        }
    };

    const handleDeleteRegistry = async () => {
        if (!window.confirm("Are you sure you want to delete this registry? This action cannot be undone.")) return;
        
        try {
            await api.delete(`/registries/${id}`);
            toast.success("Registry deleted successfully");
            navigate('/');
        } catch (error) {
            console.error("Failed to delete registry", error);
            toast.error("Failed to delete registry");
        }
    };

    const handleDeletePrompt = async (e, promptId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this prompt?")) return;

        try {
            await api.delete(`/prompts/${promptId}`);
            setRegistry(prev => ({
                ...prev,
                prompts: prev.prompts.filter(p => p.id !== promptId)
            }));
            toast.success("Prompt deleted successfully");
        } catch (error) {
            console.error("Failed to delete prompt", error);
            toast.error("Failed to delete prompt");
        }
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-9 space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="w-full">
                            <div className="h-4 w-24 bg-muted animate-pulse mb-6 rounded"></div>
                            
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>
                                    <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
                                </div>
                                <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
                            </div>
                            <div className="h-4 w-96 bg-muted animate-pulse mt-2 rounded"></div>
                        </div>
                    </div>
                    <PromptSkeleton />
                </div>
                
                {/* Right Side Skeleton Space */}
                <div className="hidden md:block md:col-span-3 sticky top-6">
                </div>
            </div>
        );
    }

    if (!registry) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Registry not found</h2>
                <Link to="/" className="text-primary hover:underline mt-4 inline-block">Go back home</Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* 80% Left Side (Span 9 columns out of 12) */}
            <div className="md:col-span-9 space-y-8">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                    <div className="w-full">
                        <Link to="/" className="text-muted-foreground hover:text-foreground hover:underline flex items-center mb-2 text-sm w-fit">
                            Back to Home
                        </Link>
                        
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl font-bold tracking-tight text-foreground">{registry.name}</h2>
                                {isManaging && (
                                    <button 
                                        className="text-sm font-medium text-destructive hover:underline" 
                                        onClick={handleDeleteRegistry}
                                    >
                                        Delete Registry
                                    </button>
                                )}
                                {isOwner && (
                                    <button 
                                        className="text-sm font-medium text-foreground hover:underline"
                                        onClick={() => setIsManaging(!isManaging)}
                                    >
                                        {isManaging ? "Done" : "Manage"}
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Follow button — only shown to non-owners */}
                                {!isOwner && (
                                    <Button
                                        variant={isFollowing ? "secondary" : "outline"}
                                        onClick={handleFollowToggle}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </Button>
                                )}
                                {isOwner && (
                                    <Link 
                                        to={`/create-prompt?registryId=${registry.id}`} 
                                        className={`text-sm font-medium text-primary hover:underline ${isManaging ? 'opacity-50 pointer-events-none' : ''}`}
                                    >
                                        Add Prompt
                                    </Link>
                                )}
                            </div>
                        </div>
                        <p className="text-muted-foreground mt-2">{registry.description}</p>
                    </div>
                </div>

                {/* Prompts List */}
                <div className="grid grid-cols-1 gap-4">
                    {registry.prompts && registry.prompts.length > 0 ? (
                        registry.prompts.map((prompt) => (
                            <Link 
                                key={prompt.id} 
                                to={`/thread/${prompt.threads?.[0]?.id || ''}`}
                                className="block group transition-transform"
                            >
                                <div className="border border-border/50 rounded-lg p-5 bg-card hover:bg-muted/10 transition-colors shadow-sm cursor-pointer relative group/card">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2 pr-6">{prompt.title}</h3>
                                        {isManaging && (
                                            <button 
                                                onClick={(e) => handleDeletePrompt(e, prompt.id)}
                                                className="text-xs font-medium text-muted-foreground hover:text-destructive hover:underline absolute top-5 right-5 z-10"
                                                aria-label="Delete prompt"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center text-xs text-neutral-500">
                                        {prompt.version && <span className="mr-3">v{prompt.version}</span>}
                                        {prompt.UpdatedAt && <span>Updated {new Date(prompt.UpdatedAt).toLocaleDateString()}</span>}
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-muted/5 rounded-lg border border-dashed">
                            <p className="text-muted-foreground mb-4">No prompts in this registry yet.</p>
                            {isOwner && (
                                <Link to={`/create-prompt?registryId=${registry.id}`} className="text-sm font-medium text-primary hover:underline">
                                    Create your first prompt
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 20% Right Side (Negative Space / Span 3 columns) */}
            <div className="hidden md:block md:col-span-3 sticky top-6">
                {/* Intentionally left blank for negative space as requested */}
            </div>
        </div>
    );
};

export default RegistryDetail;
