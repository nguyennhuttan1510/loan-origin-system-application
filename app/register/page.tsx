'use client';

import React, {useState, useEffect, ChangeEvent} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Field, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { UserPlus } from 'lucide-react';
import {RegisterClientRequest} from "@/lib/auth-types";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userInfo, setUserInfo] = useState<Partial<Omit<RegisterClientRequest, "password" | "username">>>({});
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      const payload = {
        username: username,
        password: password,
        customerName: userInfo.customerName,
        nationalId: userInfo.nationalId,
        national: userInfo.national,
        phoneNumber: userInfo.phoneNumber,
        type: "CLIENT",
      } as RegisterClientRequest
      await register(payload);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const onChangeUserInfo = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    setUserInfo((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <UserPlus className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Sign up to get started with the loan origination system
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Field>
              <FieldLabel htmlFor="customerName">Full Name</FieldLabel>
              <Input
                id="customerName"
                name="customerName"
                type="text"
                placeholder="John Doe"
                value={userInfo.customerName}
                onChange={onChangeUserInfo}
                disabled={isLoading}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                type="username"
                placeholder="09023456***"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="customerName">Phone number</FieldLabel>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                placeholder="0902356***"
                value={userInfo.phoneNumber}
                onChange={onChangeUserInfo}
                disabled={isLoading}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="national">National</FieldLabel>
              <Input
                id="national"
                name="national"
                type="text"
                placeholder="Viet Nam"
                value={userInfo.national}
                onChange={onChangeUserInfo}
                disabled={isLoading}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="nationalId">National ID</FieldLabel>
              <Input
                id="nationalId"
                name="nationalId"
                type="text"
                placeholder="07920000****"
                value={userInfo.nationalId}
                onChange={onChangeUserInfo}
                disabled={isLoading}
                required
              />
            </Field>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Already have an account?</span>
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
