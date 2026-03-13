import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export const RecentThreads = () => {
  const [recentThreads, setRecentThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentThreads = async () => {
      try {
        const res = await api.get('/recent-threads');
        setRecentThreads(res.data || []);
      } catch (error) {
        console.error("Failed to fetch recent threads", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentThreads();
  }, []);

  if (isLoading) {
    return (
      <div className="border rounded-lg p-4 h-full bg-card shadow-sm animate-pulse">
        <h3 className="font-semibold text-lg mb-4 text-foreground border-b pb-2">Recent Threads</h3>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 h-full bg-card shadow-sm">
      <h3 className="font-semibold text-lg mb-4 text-foreground border-b pb-2">Recent Threads</h3>
      {recentThreads.length === 0 ? (
        <p className="text-xs text-neutral-500 italic">No activity today. Threads will appear here when you comment on them.</p>
      ) : (
        <ul className="space-y-3">
          {recentThreads.map((thread) => (
            <li key={thread.id} className="flex items-center gap-2 group">
               <span className="text-muted-foreground">•</span>
               <Link 
                 to={`/thread/${thread.id}`} 
                 className="text-sm font-medium hover:text-primary transition-colors truncate"
               >
                 {thread.prompt?.title || 'Untitled Thread'}
               </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
