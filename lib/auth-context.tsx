'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import http from '@/lib/http';
import { AuthContextType, RegisterClientRequest, User, UserResponse } from '@/lib/auth-types';
import { UserType } from '@/lib/constants/user-types';
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
      const res: HttpResponse<UserResponse> = await http.get('/me');
      const data = res.data?.data ?? res.data as unknown as UserResponse;
      setUser({
        id:        data.userId,
        email:     data.username,
        name:      data.username,
        username:  data.username,
        createdAt: new Date(),
        roles:     (data.roles ?? []) as UserType[],
      });
    } catch (e) {
      console.error(e);
      setUser(null);
    }
  }

  async function login(username: string, password: string): Promise<void> {
    // BFF sets httpOnly cookie — no token in response body
    await http.post('/auth/login', { username, password });
    await getMe();
  }

  async function register(req: RegisterClientRequest): Promise<void> {
    await http.post('/auth/register/end-user', req);
    await getMe();
  }

  async function logout(): Promise<void> {
    try {
      // BFF clears cookie + revokes token on auth-service
      await http.post('/auth/logout');
    } finally {
      setUser(null);
    }
  }

  async function changePassword(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    await http.post('/auth/change-password', { oldPassword, newPassword, confirmPassword });
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
