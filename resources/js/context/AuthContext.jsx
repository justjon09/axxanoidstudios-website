import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/admin/auth/me', { withCredentials: true });
                setUser(response.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axios.post('/api/auth/login', credentials, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            setUser(response.data.user);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/admin/auth/logout', null, { withCredentials: true });
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;