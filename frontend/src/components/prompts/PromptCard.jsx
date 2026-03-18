import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export const PromptCard = ({ prompt }) => {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Prompt copied to clipboard!");
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{prompt.title}</CardTitle>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">v{prompt.version}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center">
                                Updated {new Date(prompt.UpdatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <button 
                        className="text-sm font-medium text-primary hover:underline mt-2" 
                        onClick={() => copyToClipboard(prompt.content)}
                    >
                        Copy
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="bg-muted/30 p-4 rounded-md font-mono text-sm whitespace-pre-wrap max-h-48 overflow-y-auto border">
                    {prompt.content}
                </div>
                {prompt.description && (
                    <p className="text-sm text-muted-foreground mt-4">
                        {prompt.description}
                    </p>
                )}
            </CardContent>
            <CardFooter className="border-t pt-4">
                <div className="flex flex-wrap gap-2">
                    {prompt.tags && prompt.tags.split(',').map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                            {tag.trim()}
                        </Badge>
                    ))}
                </div>
            </CardFooter>
        </Card>
    );
};
