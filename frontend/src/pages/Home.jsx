import { UserRegistries } from '../components/dashboard/UserRegistries';
import { RecentThreads } from '../components/dashboard/RecentThreads';
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../api';

const Home = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q');

    const [registries, setRegistries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Threads feed state
    const [threads, setThreads] = useState([]);
    const [isLoadingThreads, setIsLoadingThreads] = useState(false);
    const [filter, setFilter] = useState('followed'); // 'followed' or 'created'
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchRegistries = async () => {
            try {
                const res = await api.get('/registries');
                setRegistries(res.data || []);
            } catch (error) {
                console.error("Failed to fetch registries", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRegistries();
    }, []);

    useEffect(() => {
        const fetchThreads = async () => {
            setIsLoadingThreads(true);
            try {
                let url = `/threads?filter=${filter}&page=${page}&limit=5`;
                
                if (searchQuery) {
                    // Reset page to 1 for new search if it was handled differently, 
                    // but here we just use the query for listing. 
                    // Search doesn't have pagination implemented on backend yet as requested "simple search"
                    url = `/threads/search?q=${encodeURIComponent(searchQuery)}`;
                }

                const res = await api.get(url);
                const newThreads = res.data || [];
                
                if (page === 1 || searchQuery) {
                    setThreads(newThreads);
                } else {
                    setThreads(prev => [...prev, ...newThreads]);
                }
                
                // Pagination logic for normal feed, disable for search for now
                if (searchQuery) {
                    setHasMore(false);
                } else if (newThreads.length < 5) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            } catch (error) {
                console.error("Failed to fetch threads", error);
            } finally {
                setIsLoadingThreads(false);
            }
        };
        fetchThreads();
    }, [filter, page, searchQuery]);

    const handleFilterChange = (newFilter) => {
        if (newFilter !== filter) {
            setFilter(newFilter);
            setPage(1);
            setThreads([]);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sidebar Skeleton */}
                <div className="hidden lg:block lg:col-span-3">
                    <div className="border rounded-lg p-4 h-[300px] bg-card animate-pulse"></div>
                </div>

                {/* Main Content Skeleton */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center justify-center gap-4 text-md font-medium text-neutral-500 pb-2 border-b">
                        <span className="cursor-pointer">Latest threads</span>
                        <span>|</span>
                        <span className="cursor-pointer">Your threads</span>
                    </div>
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
                <div className="hidden lg:block lg:col-span-3">
                    <div className="border rounded-lg p-4 h-[200px] bg-card animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: My Registries */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-6">
                <UserRegistries />
            </aside>

            {/* Center Content: Feed */}
            <main className="lg:col-span-6 space-y-6">
                {searchQuery ? (
                    <div className="flex items-center justify-between pb-2 border-b">
                        <div className="flex items-center gap-2">
                            <span className="text-neutral-500 font-medium">Search results for:</span>
                            <span className="text-foreground font-bold italic">"{searchQuery}"</span>
                        </div>
                        <Link 
                            to="/" 
                            className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                        >
                            Clear search
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-4 text-md font-medium pb-2 border-b">
                        <button 
                            onClick={() => handleFilterChange('followed')}
                            className={`transition-colors ${filter === 'followed' ? 'text-foreground font-bold' : 'text-neutral-500 hover:text-foreground'}`}
                        >
                            Latest threads
                        </button>
                        <span className="text-neutral-300">|</span>
                        <button 
                            onClick={() => handleFilterChange('created')}
                            className={`transition-colors ${filter === 'created' ? 'text-foreground font-bold' : 'text-neutral-500 hover:text-foreground'}`}
                        >
                            Your threads
                        </button>
                    </div>
                )}
                
                <div className="space-y-4">
                    {threads.map(thread => (
                        <div key={thread.id} className="border bg-card rounded-lg p-2 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <div className="flex items-center gap-1">
                                    <h3 className="font-semibold text-lg">{thread.prompt?.title}</h3>
                                    <span className="text-muted-foreground text-sm">•</span>
                                    <span className="text-muted-foreground text-sm">{thread.prompt?.registry?.name}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    <span className="text-neutral-500">by:</span> 
                                    <span className="text-foreground font-medium"> {thread.userName}</span>
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2 text-neutral-500 text-sm pt-2">
                                <span>Total Replies <span className="text-foreground font-medium">{thread.comments?.length || 0}</span></span>
                                <span>•</span>
                                <span>Followed by <span className="text-foreground font-medium">{thread.followers?.length || 0}</span></span>
                            </div>
                        </div>
                    ))}

                    {isLoadingThreads && page > 1 && (
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="border bg-card rounded-lg p-5 flex flex-col gap-4 animate-pulse opacity-50">
                                    <div className="h-5 bg-muted rounded w-2/3"></div>
                                    <div className="h-4 bg-muted rounded w-1/4"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {!isLoadingThreads && threads.length === 0 && (
                    <div className="text-center py-10 text-neutral-500 italic">
                        No threads found in this category.
                    </div>
                )}

                <div className="text-center pt-0 text-sm">
                    <span className="text-neutral-500">viewing {threads.length} threads</span>
                    {hasMore && (
                        <>
                            <span className="mx-2 text-neutral-500">•</span>
                            <button 
                                onClick={() => setPage(p => p + 1)}
                                disabled={isLoadingThreads}
                                className="text-muted-foreground hover:underline cursor-pointer disabled:opacity-50"
                            >
                                {isLoadingThreads ? 'loading...' : 'show more'}
                            </button>
                        </>
                    )}
                </div>
            </main>

            {/* Right Sidebar: Recent Threads */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-6">
                <RecentThreads />
            </aside>
        </div>
    );
};

export default Home;
