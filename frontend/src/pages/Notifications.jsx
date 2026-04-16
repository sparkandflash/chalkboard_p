import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import api from '../api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                setNotifications(res.data || []);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        // Optimistically update UI
        setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );

        try {
            await api.put(`/notifications/${id}/read`);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
            // Revert on failure (simplified)
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, read: false } : n)
            );
        }
    };

    // Helper to format timestamps closely simulating 'time ago'
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };

    return (
        <DashboardLayout>
            <div className="bg-card border rounded-lg p-6 shadow-sm min-h-[400px]">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 border rounded-lg animate-pulse flex gap-4 bg-muted/20">
                                <div className="w-2 h-2 mt-2 rounded-full bg-muted shrink-0"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-3 bg-muted rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground italic">
                        You have no new notifications.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {notifications.map(notification => (
                            <div 
                                key={notification.id} 
                                onClick={() => !notification.read && markAsRead(notification.id)}
                                className={`p-4 border rounded-lg transition-all flex items-start gap-4 ${
                                    notification.read 
                                    ? 'bg-background opacity-70 border-border' 
                                    : 'bg-muted/30 border-primary/20 cursor-pointer hover:bg-muted/50'
                                }`}
                            >
                                {!notification.read ? (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markAsRead(notification.id);
                                        }}
                                        className="mt-0.5 shrink-0 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/30 rounded hover:bg-primary/10 transition-colors"
                                    >
                                        Mark read
                                    </button>
                                ) : (
                                    <div className="w-[66px] shrink-0"></div> // Spacer to align text with read buttons
                                )}
                                <div className="flex-1 text-left">
                                    <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                                        {notification.event_data}
                                    </p>
                                    <span className="text-xs text-muted-foreground mt-1 inline-block">
                                        {formatDate(notification.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Notifications;
