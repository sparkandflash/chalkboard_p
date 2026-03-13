import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export const UserRegistries = () => {
  const [registries, setRegistries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="border rounded-lg p-4 h-full bg-card shadow-sm animate-pulse">
        <h3 className="font-semibold text-lg mb-4 text-foreground border-b pb-2">My Registries</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 bg-muted rounded-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 h-full bg-card shadow-sm">
      <h3 className="font-semibold text-lg mb-4 text-foreground border-b pb-2">My Registries</h3>
      {registries.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No registries found.</p>
      ) : (
        <ul className="space-y-3">
          {registries.map((reg) => (
            <li key={reg.id} className="flex items-center gap-2 group">
               <span className="text-muted-foreground">•</span>
               <Link 
                 to={`/registry/${reg.id}`} 
                 className="text-sm font-medium hover:text-primary transition-colors truncate"
               >
                 {reg.name}
               </Link>
               <span className="text-xs text-neutral-500 whitespace-nowrap">
                  {reg.prompts?.length || 0} {(reg.prompts?.length === 1) ? 'prompt' : 'prompts'}
               </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
