import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI, User, LoginPayload, RegisterPayload, ProfilePayload } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  updateUser: (data: ProfilePayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('syscore_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('syscore_token');
      if (storedToken) {
        try {
          const response = await authAPI.me();
          setUser(response.data);
          setToken(storedToken);
        } catch (err) {
          console.error('[SYS.CORE] Session invalid:', err);
          localStorage.removeItem('syscore_token');
          localStorage.removeItem('syscore_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (payload: LoginPayload) => {
    setError(null);
    try {
      const response = await authAPI.login(payload);
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('syscore_token', access_token);
      localStorage.setItem('syscore_user', JSON.stringify(userData));
      
      setUser(userData);
      setToken(access_token);
      return userData;
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Login failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setError(null);
    try {
      const response = await authAPI.register(payload);
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('syscore_token', access_token);
      localStorage.setItem('syscore_user', JSON.stringify(userData));
      
      setUser(userData);
      setToken(access_token);
      return userData;
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('syscore_token');
    localStorage.removeItem('syscore_user');
    setUser(null);
    setToken(null);
    window.location.href = '/';
  };

  const updateUser = async (data: ProfilePayload) => {
    try {
      const response = await userAPI.updateProfile(data);
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('syscore_user', JSON.stringify(updatedUser));
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Profile update failed';
      throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
