'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/dashboard/sidebar';
import { LoanFormWizard } from '@/components/loan-form/loan-form-wizard';

export default function ApplicationPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-0">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">New Loan Application</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill out the form below to create a new loan application.
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <LoanFormWizard />
        </div>
      </main>
    </div>
  );
}
