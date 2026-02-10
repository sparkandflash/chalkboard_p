import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreateRegistry = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await api.post('/registries', {
                name,
                description
            });

            alert('Registry Created Successfully!');
            navigate('/');
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-foreground">Create New Registry</h2>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 border rounded-lg shadow-sm">
                <div className="space-y-3">
                    <Label htmlFor="name" className="text-base font-semibold">Registry Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., My AI Agents"
                        required
                        className="h-12 text-base px-4"
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What is this registry for?"
                        rows={4}
                        className="text-base p-4"
                    />
                </div>

                <Button type="submit" size="lg" disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-base font-semibold">
                    {isLoading ? 'Creating...' : 'Create Registry'}
                </Button>
            </form>
        </div>
    );
};

export default CreateRegistry;
