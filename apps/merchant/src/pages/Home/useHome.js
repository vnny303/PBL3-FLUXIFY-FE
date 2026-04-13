import { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../../shared/api/mockApi';

export function useHome() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setIsLoading(true);
                const data = await fetchDashboardStats();
                setStats(data);
            } catch (err) {
                setError('Failed to load dashboard stats');
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    return {
        state: {
            stats,
            isLoading,
            error
        }
    };
}
