import React, { createContext, useState, useEffect } from 'react';
import { 
    getToken, 
    setAuthSession, 
    clearAuthSession, 
    getAuthSession 
} from '@fluxify/shared';
import { logout as logoutApi } from '../../share/api/authApi';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [currentTenant, setCurrentTenant] = useState(null);  
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const session = getAuthSession();
            const storedUser = localStorage.getItem('user');
            const storedCurrentTenant = localStorage.getItem('currentTenant');
            
            if (session.token) {
                setToken(session.token);
            }

            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } catch (parseErr) {
                    console.error('Failed to parse stored user:', parseErr);
                    localStorage.removeItem('user');
                }
            }

            if (storedCurrentTenant) {
                try {
                    const parsedTenant = JSON.parse(storedCurrentTenant);
                    setCurrentTenant(parsedTenant);
                } catch (parseErr) {
                    console.error('Failed to parse stored currentTenant:', parseErr);
                    localStorage.removeItem('currentTenant');
                }
            }
        } catch (err) {
            console.error('Error loading session:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Normalize data 
    const normalizeUserData = (data) => {
        let tenants = [];

        if (data.tenants && Array.isArray(data.tenants)) {
            tenants = data.tenants;
        }
        else if (data.tenantId && data.subdomain) {
            tenants = [{ tenantId: data.tenantId, subdomain: data.subdomain, storeName: data.storeName }];
        }

        return {
            userId: data.userId,
            email: data.email,
            role: data.role,
            tenants 
        };
    };

    // LOGOUT
    const logout = async () => {
        try {
            await logoutApi();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
            setToken(null);
            setCurrentTenant(null);
            clearAuthSession();
            localStorage.removeItem('user');
            localStorage.removeItem('currentTenant');
        }
    };

    // LOGIN
    const login = (data) => {
        try {
            const normalizedUser = normalizeUserData(data);
            setUser(normalizedUser);
            setToken(data.token);

            if (normalizedUser.tenants.length === 1) {
                const firstTenant = normalizedUser.tenants[0];
                setCurrentTenant(firstTenant);
                localStorage.setItem('currentTenant', JSON.stringify(firstTenant));
            }

            setAuthSession(data);
            localStorage.setItem('user', JSON.stringify(normalizedUser));

       

        } catch (err) {
            console.error('Login error:', err);
            setError('Có lỗi xảy ra khi lưu thông tin');
        }
    };

    // REGISTER MERCHANT
    const register = (data) => {
        try {
            const normalizedUser = normalizeUserData(data);
            setUser(normalizedUser);
            setToken(data.token);

            const firstTenant = normalizedUser.tenants[0];
            setCurrentTenant(firstTenant);

            setAuthSession(data);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
            localStorage.setItem('currentTenant', JSON.stringify(firstTenant));
        } catch (err) {
            console.error('Register error:', err);
            setError('Có lỗi xảy ra khi lưu thông tin');
        }
    };

    // Switch between tenants
    const switchTenant = (tenantId) => {
        if (!user || !user.tenants) return;

        const selectedTenant = user.tenants.find(t => t.tenantId === tenantId);
        if (selectedTenant) {
            setCurrentTenant(selectedTenant);
            localStorage.setItem('currentTenant', JSON.stringify(selectedTenant));
        }
    };

    // Add a newly created tenant to the user's tenant list
    const addTenant = (tenant) => {
        const cleanTenant = {
            tenantId: tenant.id,       
            subdomain: tenant.subdomain,
            storeName: tenant.storeName,
        };

        if (!user) return;
        const updatedUser = {
            ...user,
            tenants: [...(user.tenants || []), cleanTenant],
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentTenant(cleanTenant);
        localStorage.setItem('currentTenant', JSON.stringify(cleanTenant));
    };

    // Remove a tenant from the user's tenant list
    const removeTenant = (tenantId) => {
        if (!user) return;
        const updatedTenants = (user.tenants || []).filter(t => t.tenantId !== tenantId);
        const updatedUser = { ...user, tenants: updatedTenants };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // If the deleted tenant was the current one, switch to first available
        if (currentTenant?.tenantId === tenantId) {
            const next = updatedTenants[0] || null;
            setCurrentTenant(next);
            if (next) {
                localStorage.setItem('currentTenant', JSON.stringify(next));
            } else {
                localStorage.removeItem('currentTenant');
            }
        }
    };

    const value = {
        user,
        token,
        currentTenant,  
        isLoading,
        error,
        login,
        logout,
        register,
        switchTenant,
        addTenant,
        removeTenant,
        isAuthenticated: !!token && !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}