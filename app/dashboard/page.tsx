'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/dashboard/sidebar';
import { LoanCharts } from '@/components/dashboard/loan-charts';
import { LoansTable } from '@/components/dashboard/loans-table';
import { MOCK_LOANS } from '@/lib/mock-loans';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
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

  const totalLoans = MOCK_LOANS.length;
  const activeLoans = MOCK_LOANS.filter(l => l.status === 'active').length;
  const approvedLoans = MOCK_LOANS.filter(l => l.status === 'approved').length;
  const pendingLoans = MOCK_LOANS.filter(l => l.status === 'pending').length;
  const totalAmount = MOCK_LOANS.reduce((sum, loan) => sum + loan.amount, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-0">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Welcome back, {user.name}. Here&apos;s your loan portfolio overview.
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLoans}</div>
                <p className="text-xs text-muted-foreground">
                  {MOCK_LOANS.filter(l => l.status === 'rejected').length} rejected
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeLoans}</div>
                <p className="text-xs text-muted-foreground">
                  {approvedLoans} approved awaiting disbursement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingLoans}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting assessment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(totalAmount / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground">
                  Total loan amount
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <LoanCharts loans={MOCK_LOANS} />

          {/* Loans Table */}
          <LoansTable loans={MOCK_LOANS} />
        </div>
      </main>
    </div>
  );
}
