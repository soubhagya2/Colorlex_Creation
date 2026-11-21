import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('colorlex_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiFetch('/auth/profile');
        if (res.success) {
          setUser(res.data);
        } else {
          localStorage.removeItem('colorlex_token');
        }
      } catch (err) {
        const saved = localStorage.getItem('colorlex_user');
        if (saved) setUser(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.success) {
        localStorage.setItem('colorlex_token', res.data.token);
        localStorage.setItem('colorlex_user', JSON.stringify(res.data));
        setUser(res.data);
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone, role: 'customer' })
      });
      if (res.success) {
        localStorage.setItem('colorlex_token', res.data.token);
        localStorage.setItem('colorlex_user', JSON.stringify(res.data));
        setUser(res.data);
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('colorlex_token');
    localStorage.removeItem('colorlex_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'super_admin' || user?.role === 'staff',
        isSuperAdmin: user?.role === 'super_admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
