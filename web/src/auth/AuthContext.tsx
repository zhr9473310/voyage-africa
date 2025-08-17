import React, { createContext, useContext, useEffect, useState } from 'react';

export type User = {
  id: string;
  email: string;
  name?: string | null;
  avatar_url?: string | null;
  email_verified?: boolean;
}
type Ctx = {
  user: User | null;
  loading: boolean;
  login: (email:string, password:string) => Promise<void>;
  register: (email:string, password:string, name?:string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}
const AuthCtx = createContext<Ctx>(null as any);
export const useAuth = () => useContext(AuthCtx);

export const AuthProvider: React.FC<{children:React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User|null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/auth/me', { credentials:'include' });
      const j = await r.json(); setUser(j.user);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ refresh() }, []);

  const login = async (email:string, password:string) => {
    const r = await fetch('/api/auth/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      credentials:'include', body: JSON.stringify({ email, password })
    });
    const j = await r.json(); if(!r.ok) throw new Error(j.error || '登录失败');
    setUser(j.user);
  };

  const register = async (email:string, password:string, name?:string) => {
    const r = await fetch('/api/auth/register', {
      method:'POST', headers:{'Content-Type':'application/json'},
      credentials:'include', body: JSON.stringify({ email, password, name })
    });
    const j = await r.json(); if(!r.ok) throw new Error(j.error || '注册失败');
    setUser(j.user);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method:'POST', credentials:'include' });
    setUser(null);
  };

  return <AuthCtx.Provider value={{ user, loading, login, register, logout, refresh }}>{children}</AuthCtx.Provider>
}
