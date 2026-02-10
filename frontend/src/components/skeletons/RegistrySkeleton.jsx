import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function RegistrySkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border bg-card text-card-foreground shadow-sm">
                    <CardHeader className="p-6 border-b bg-muted/20">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3 mt-1" />
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-5 w-20 rounded-full" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
