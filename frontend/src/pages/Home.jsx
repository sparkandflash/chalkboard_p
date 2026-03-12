import { useState, useEffect } from 'react';

import api from '../api';


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
            <div className="max-w-4xl mx-auto space-y-6">
                <h2 className="text-xl font-medium tracking-tight text-foreground pb-2 border-b text-center">Your prompt threads</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="border bg-card rounded-lg p-5 flex flex-col gap-4 animate-pulse">
                            <div className="h-5 bg-muted rounded w-2/3"></div>
                            <div className="h-4 bg-muted rounded w-1/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Dummy data for the new wireframe
    const dummyThreads = [
        { id: 1, promptName: "Creative Writing Starter", registryName: "Writing Prompts", createdBy: "Alice", replies: 12, followed: 45 },
        { id: 2, promptName: "Code Review Assistant", registryName: "Dev Tools", createdBy: "BobDev", replies: 34, followed: 120 },
        { id: 3, promptName: "Weekly Meal Planner", registryName: "Lifestyle", createdBy: "ChefJane", replies: 5, followed: 22 },
        { id: 4, promptName: "SEO Blog Post Generator", registryName: "Marketing", createdBy: "SamDigital", replies: 89, followed: 340 }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-medium tracking-tight text-foreground pb-2 border-b text-center">Your prompt threads</h2>
            
            <div className="space-y-4">
                {dummyThreads.map(thread => (
                    <div key={thread.id} className="border bg-card rounded-lg p-2 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex items-center gap-1">
                                <h3 className="font-semibold text-lg">{thread.promptName}</h3>
                                <span className="text-muted-foreground text-sm">•</span>
                                <span className="text-muted-foreground text-sm">{thread.registryName}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1"><span className="text-neutral-500">by:</span> <span className="text-foreground font-medium">{thread.createdBy}</span></p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-neutral-500 text-sm text-muted-foreground pt-2">
                            <span>Total Replies <span className="text-foreground font-medium">{thread.replies}</span></span>
                            <span>•</span>
                            <span>Followed by <span className="text-foreground font-medium">{thread.followed}</span></span>
                        </div>
                    </div>
                ))}
            </div>
              <div className="text-center pt-0 text-sm">
                <span className="text-neutral-500">viewing 4 threads</span>
                <span className="mx-2 text-neutral-500">•</span>
                <span className="text-muted-foreground hover:underline cursor-pointer">show more</span>
                <span className="mx-2 text-neutral-500">•</span>
                <span className="text-neutral-500">Total 89 threads</span>
            </div>
        </div>
    );
};

export default Home;
