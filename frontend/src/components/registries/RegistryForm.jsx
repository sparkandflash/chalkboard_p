import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export const RegistryForm = ({ initialValues = {}, onSubmit, isLoading }) => {
    const [name, setName] = useState(initialValues.name || '');
    const [description, setDescription] = useState(initialValues.description || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, description });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 border rounded-lg shadow-sm">
            <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-semibold">Registry Name</Label>
                <Input
                    id="name"
                    placeholder="e.g., Marketing Emails, Coding Assistants"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 text-lg"
                />
            </div>
            <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                <Textarea
                    id="description"
                    placeholder="What is this collection of prompts for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                />
            </div>
            <div className="flex justify-end gap-4">
                <Button variant="secondary" type="button" size="lg" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" size="lg" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Registry'}
                </Button>
            </div>
        </form>
    );
};
