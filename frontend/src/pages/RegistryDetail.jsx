import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from 'lucide-react';
import api from '../api';

import { toast } from "sonner"
import { PromptSkeleton } from "@/components/skeletons/PromptSkeleton"
import { PromptCard } from "@/components/prompts/PromptCard";

const RegistryDetail = () => {
    const { id } = useParams();
    const [registry, setRegistry] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRegistry = async () => {
            try {
                // Initial delay to show off skeleton
                await new Promise(resolve => setTimeout(resolve, 500));

                // Since we don't have a direct /registries/:id endpoint, 
                // we fetch all and find the one (temporary solution for V1).
                // Ideally backend should support GET /registries/:id
                const res = await api.get('/registries');
                const found = res.data.find(r => r.id === parseInt(id));

                if (!found) {
                    toast.error("Registry not found");
                }
                setRegistry(found);
            } catch (error) {
                console.error("Failed to fetch registry", error);
                toast.error("Failed to load registry details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRegistry();
    }, [id]);

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="h-4 w-24 bg-muted animate-pulse mb-2 rounded"></div>
                        <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>
                        <div className="h-4 w-96 bg-muted animate-pulse mt-2 rounded"></div>
                    </div>
                    <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
                </div>
                <PromptSkeleton />
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
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center mb-2 text-sm">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Registries
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">{registry.name}</h2>
                    <p className="text-muted-foreground mt-2">{registry.description}</p>
                </div>
                <Link to={`/create-prompt?registryId=${registry.id}`}>
                    <Button size="lg">
                        <Plus className="mr-2 h-5 w-5" /> Add Prompt
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {registry.prompts && registry.prompts.length > 0 ? (
                    registry.prompts.map((prompt) => (
                        <PromptCard key={prompt.id} prompt={prompt} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-muted/10 rounded-lg border-2 border-dashed">
                        <p className="text-muted-foreground">No prompts in this registry yet.</p>
                        <Link to={`/create-prompt?registryId=${registry.id}`} className="mt-4 inline-block">
                            <Button size="lg">Create your first prompt</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistryDetail;
