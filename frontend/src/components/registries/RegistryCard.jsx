import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Folder } from 'lucide-react';

export const RegistryCard = ({ registry }) => {
    return (
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary h-full flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Folder className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl line-clamp-1">{registry.name}</CardTitle>
                    </div>
                </div>
                <CardDescription className="line-clamp-2 mt-2 h-10">
                    {registry.description || "No description provided."}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex gap-2">
                    <Badge variant="secondary">{registry.prompts?.length || 0} Prompts</Badge>
                    <Badge variant="outline">Updated recently</Badge>
                </div>
            </CardContent>
            <CardFooter className="pt-4 border-t bg-muted/20">
                <Button asChild className="w-full">
                    <Link to={`/registry/${registry.id}`}>View Registry</Link>
                </Button>
            </CardFooter>
        </Card>
    );
};
