import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { RegistrySkeleton } from "@/components/skeletons/RegistrySkeleton"
import { RegistryCard } from "@/components/registries/RegistryCard";
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react';

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">My Prompt Registries</h2>
                    <p className="text-muted-foreground mt-2">Manage your collections of prompts.</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/create-registry">
                        <Button size="lg" className="shadow-lg">
                            <Plus className="mr-2 h-5 w-5" /> New Registry
                        </Button>
                    </Link>
                    <Link to="/create-prompt">
                        <Button size="lg" className="shadow-lg">
                            <Plus className="mr-2 h-5 w-5" /> New Prompt
                        </Button>
                    </Link>
                </div>
            </div>

            {registries.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/10">
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No registries yet</h3>
                    <p className="text-muted-foreground mb-6 text-center max-w-sm">Create your first registry to start organizing your prompts.</p>
                    <Link to="/create-registry">
                        <Button>Create Registry</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {registries.map((registry) => (
                        <RegistryCard key={registry.id} registry={registry} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
