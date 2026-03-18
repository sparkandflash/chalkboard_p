import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PromptSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border/50 rounded-lg p-5 bg-card shadow-sm">
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            ))}
        </div>
    )
}
