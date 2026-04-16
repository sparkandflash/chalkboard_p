import { UserRegistries } from '../dashboard/UserRegistries';
import { RecentThreads } from '../dashboard/RecentThreads';

export const DashboardLayout = ({ children, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Left Sidebar Skeleton */}
                <div className="hidden md:block md:col-span-3">
                    <div className="border rounded-lg p-4 h-[300px] bg-card animate-pulse"></div>
                </div>

                {/* Main Content Skeleton */}
                <div className="md:col-span-6 space-y-6">
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="border bg-card rounded-lg p-5 flex flex-col gap-4 animate-pulse">
                                <div className="h-5 bg-muted rounded w-2/3"></div>
                                <div className="h-4 bg-muted rounded w-1/4"></div>
                                <div className="h-4 bg-muted rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar Skeleton */}
                <div className="hidden md:block md:col-span-3">
                    <div className="border rounded-lg p-4 h-[200px] bg-card animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar */}
            <aside className="hidden md:block md:col-span-3 sticky top-6">
                <UserRegistries />
            </aside>

            {/* Center Content */}
            <main className="md:col-span-6 space-y-6">
                {children}
            </main>

            {/* Right Sidebar */}
            <aside className="hidden md:block md:col-span-3 sticky top-6">
                <RecentThreads />
            </aside>
        </div>
    );
};
