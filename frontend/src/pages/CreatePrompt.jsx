import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreatePrompt = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await api.post('/prompts', {
                title,
                content,
                description,
                tags
            });

            // Ideally use a toast here
            alert('Prompt Created Successfully!');
            navigate('/'); // Go back to feed
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-foreground">Create New Prompt</h2>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 border rounded-lg shadow-sm">
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

                <Button type="submit" size="lg" disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-base font-semibold">
                    {isLoading ? 'Creating...' : 'Create Prompt'}
                </Button>
            </form>
        </div>
    );
};

export default CreatePrompt;
