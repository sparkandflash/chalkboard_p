import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api';

const PublicSearch = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query.trim()) return;
        const fetchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await api.get(`/threads/search?q=${encodeURIComponent(query)}`);
                setResults(res.data || []);
            } catch (err) {
                setError('Search failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [query]);

    return (
        <div className="max-w-2xl mx-auto py-8 space-y-6">
            <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
                <p className="text-sm text-muted-foreground">
                    {isLoading
                        ? 'Searching...'
                        : `${results.length} result${results.length !== 1 ? 's' : ''} for `}
                    {!isLoading && <span className="font-medium text-foreground">"{query}"</span>}
                </p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {!isLoading && results.length === 0 && !error && (
                <p className="text-sm text-neutral-500 italic text-center py-8">
                    No prompts found matching "{query}".
                </p>
            )}

            <div className="space-y-0">
                {results.map((thread, index) => {
                    const charCount = thread.prompt?.content?.length || 0;
                    const tokenEstimate = Math.ceil(charCount / 4);
                    const comments = thread.comments || [];
                    return (
                        <div key={thread.id}>
                            {index > 0 && <hr className="border-neutral-300 dark:border-neutral-600" />}
                            <Link to={`/p/${thread.id}`} className="block py-4 px-2 hover:bg-muted/20 rounded-md transition-colors">
                                <h2 className="font-semibold text-foreground hover:text-primary transition-colors">
                                    {thread.prompt?.title}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 font-mono">
                                    {thread.prompt?.content}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-2">
                                    <span>by <span className="text-foreground">{thread.userName}</span></span>
                                    {thread.prompt?.registry?.name && (
                                        <>
                                            <span>•</span>
                                            <span>{thread.prompt.registry.name}</span>
                                        </>
                                    )}
                                    <span>•</span>
                                    <span>{comments.length} replies</span>
                                    <span>•</span>
                                    <span>{charCount} chars</span>
                                    <span>•</span>
                                    <span>~{tokenEstimate} tokens</span>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PublicSearch;
