'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import http from '@/lib/http';
import { AuthContextType, RegisterClientRequest, User, UserResponse } from '@/lib/auth-types';
import { HttpResponse } from '@/lib/http-types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_PATHS = ['/login', '/register'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]     = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  // Restore session on mount — cookie is sent automatically
  useEffect(() => {
    getMe().finally(() => setLoading(false));
  }, []);

  async function getMe(): Promise<void> {
    try {
      const res: HttpResponse<UserResponse> = await http.get('/api/me');
      const data = res.data?.data ?? res.data as unknown as UserResponse;
      setUser({
        id:          data.id,
        email:       data.username,
        name:        data.username,
        username:    data.username,
        nationalId:  data.nationalId,
        phoneNumber: data.phoneNumber,
        createdAt:   new Date(),
        role:        data.type,
      });
    } catch {
      setUser(null);
    }
  }

  async function login(username: string, password: string): Promise<void> {
    // BFF sets httpOnly cookie — no token in response body
    await http.post('/api/auth/login', { username, password });
    await getMe();
  }

  async function register(req: RegisterClientRequest): Promise<void> {
    await http.post('/api/auth/register/end-user', req);
    await getMe();
  }

  async function logout(): Promise<void> {
    try {
      // BFF clears cookie + revokes token on auth-service
      await http.post('/api/auth/logout');
    } finally {
      setUser(null);
    }
  }

  async function changePassword(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    await http.post('/api/auth/change-password', { oldPassword, newPassword, confirmPassword });
    // auth-service revokes all sessions → BFF cleared cookies → must re-login
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  const router  = useRouter();
  const pathname = usePathname();

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  useEffect(() => {
    if (PUBLIC_PATHS.includes(pathname)) return;
    if (!context.user && !context.isLoading) {
      router.push('/login');
    }
  }, [context.user, context.isLoading, pathname, router]);

  return context;
}
