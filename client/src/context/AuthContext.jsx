import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../services/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('smartprice_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('smartprice_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('smartprice_token');
      if (storedToken) {
        try {
          const res = await getMeApi();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('smartprice_user', JSON.stringify(res.data));
          }
        } catch (error) {
          console.warn('[AuthContext] Session invalid or expired. Logging out.');
          logout();
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    if (res.success && res.data) {
      const userData = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        avatar: res.data.avatar,
      };
      setUser(userData);
      setToken(res.data.token);
      localStorage.setItem('smartprice_token', res.data.token);
      localStorage.setItem('smartprice_user', JSON.stringify(userData));
      return userData;
    }
  };

  const register = async (name, email, password) => {
    const res = await registerApi({ name, email, password });
    if (res.success && res.data) {
      const userData = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        avatar: res.data.avatar,
      };
      setUser(userData);
      setToken(res.data.token);
      localStorage.setItem('smartprice_token', res.data.token);
      localStorage.setItem('smartprice_user', JSON.stringify(userData));
      return userData;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smartprice_token');
    localStorage.removeItem('smartprice_user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
