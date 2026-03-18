import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Check } from "lucide-react"

export const PromptForm = ({ registries = [], initialValues = {}, onSubmit, isLoading }) => {
    const [title, setTitle] = useState(initialValues.title || '');
    const [content, setContent] = useState(initialValues.content || '');
    const [description, setDescription] = useState(initialValues.description || '');
    const [tags, setTags] = useState(initialValues.tags || '');
    const [version, setVersion] = useState(initialValues.version || '1.0.0');
    const [selectedRegistry, setSelectedRegistry] = useState(initialValues.registryId ? initialValues.registryId.toString() : '');

    const CHAR_LIMIT = 4000;
    const estimatedTokens = Math.ceil(content.length / 4);

    // Update selectedRegistry when initialValues change
    useEffect(() => {
        if (initialValues.registryId) {
            setSelectedRegistry(initialValues.registryId.toString());
        } else if (registries.length > 0 && !selectedRegistry) {
            setSelectedRegistry(registries[0].id.toString());
        }
    }, [initialValues.registryId, registries, selectedRegistry]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedRegistry) {
            // Let parent handle or show toast here? 
            // Parent handleSubmit in CreatePrompt already checks this.
            // But to be consistent with "make it required", we can't easily rely on HTML5 validation for custom Select.
        }
        onSubmit({
            title,
            content,
            description,
            tags,
            version,
            registryId: parseInt(selectedRegistry)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 border rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <Label htmlFor="title" className="text-base font-semibold">Prompt Title</Label>
                    <Input
                        id="title"
                        placeholder="e.g., SEO Blog Post Generator"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="registry" className="text-base font-semibold">Registry <span className="text-destructive">*</span></Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between font-normal">
                                {selectedRegistry
                                    ? registries.find((r) => r.id.toString() === selectedRegistry)?.name
                                    : "Select a registry"}
                                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuRadioGroup value={selectedRegistry} onValueChange={setSelectedRegistry}>
                                {registries.map((r) => (
                                    <DropdownMenuRadioItem key={r.id} value={r.id.toString()}>
                                        {r.name}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="space-y-3">
                <Label htmlFor="content" className="text-base font-semibold">Prompt Content</Label>
                <div className="relative">
                    <Textarea
                        id="content"
                        placeholder="Enter your prompt template here..."
                        value={content}
                        onChange={(e) => {
                            if (e.target.value.length <= CHAR_LIMIT) {
                                setContent(e.target.value);
                            }
                        }}
                        rows={8}
                        className="font-mono text-sm resize-y"
                        required
                    />
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                    <span>~{estimatedTokens} estimated tokens</span>
                    <span className={content.length >= CHAR_LIMIT - 200 ? 'text-destructive font-medium' : ''}>
                        {content.length} / {CHAR_LIMIT} chars
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Briefly describe what this prompt does..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <Label htmlFor="tags" className="text-base font-semibold">Tags</Label>
                    <Input
                        id="tags"
                        placeholder="e.g., marketing, seo, writing (comma separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>
                <div className="space-y-3">
                    <Label htmlFor="version" className="text-base font-semibold">Version</Label>
                    <Input
                        id="version"
                        placeholder="1.0.0"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
                <Button variant="secondary" type="button" size="lg" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" size="lg" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Prompt'}
                </Button>
            </div>
        </form>
    );
};
