import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // You might need to install Select component first!
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreatePrompt = () => {
    const [registries, setRegistries] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [version, setVersion] = useState('1.0.0');
    const [selectedRegistry, setSelectedRegistry] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preSelectedRegistryId = searchParams.get('registryId');

    useEffect(() => {
        const fetchRegistries = async () => {
            try {
                const res = await api.get('/registries');
                setRegistries(res.data || []);
                if (preSelectedRegistryId) {
                    // Convert to string for Select component value matching
                    setSelectedRegistry(preSelectedRegistryId.toString());
                } else if (res.data && res.data.length > 0) {
                    // Default to first one if available
                    setSelectedRegistry(res.data[0].id.toString());
                }
            } catch (error) {
                console.error("Failed to fetch registries", error);
            }
        };
        fetchRegistries();
    }, [preSelectedRegistryId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!selectedRegistry) {
            setError("Please create a registry first!");
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/prompts', {
                title,
                content,
                description,
                tags,
                version,
                registryId: parseInt(selectedRegistry)
            });

            alert('Prompt Added Successfully!');
            navigate(`/registry/${selectedRegistry}`);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-foreground">Add New Prompt</h2>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 border rounded-lg shadow-sm">

                <div className="space-y-3">
                    <Label htmlFor="registry" className="text-base font-semibold">Registry</Label>
                    <select
                        id="registry"
                        value={selectedRegistry}
                        onChange={(e) => setSelectedRegistry(e.target.value)}
                        className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {registries.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                    {registries.length === 0 && <p className="text-sm text-destructive">You need to create a registry first.</p>}
                </div>

                <div className="space-y-3">
                    <Label htmlFor="title" className="text-base font-semibold">Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Code Reviewer Agent"
                        required
                        className="h-12 text-base px-4"
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="version" className="text-base font-semibold">Version</Label>
                    <Input
                        id="version"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        placeholder="1.0.0"
                        className="h-12 text-base px-4"
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="content" className="text-base font-semibold">Prompt Content</Label>
                    <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="The actual prompt text..."
                        rows={8}
                        required
                        className="font-mono text-sm leading-relaxed p-4"
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What is this prompt for?"
                        rows={4}
                        className="text-base p-4"
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="tags" className="text-base font-semibold">Tags</Label>
                    <Input
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="comma, separated, tags"
                        className="h-12 text-base px-4"
                    />
                    <p className="text-sm text-muted-foreground">Separate tags with commas.</p>
                </div>

                <Button type="submit" size="lg" disabled={isLoading || registries.length === 0} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-base font-semibold">
                    {isLoading ? 'Adding...' : 'Add Prompt'}
                </Button>
            </form>
        </div>
    );
};

export default CreatePrompt;
