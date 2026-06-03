'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/dashboard/sidebar';
import { UnderwritingDetailPanel } from '@/components/underwriting/underwriting-detail-panel';
import { UnderwritingDecisionForm } from '@/components/underwriting/underwriting-decision-form';
import { ApplicationStatusBadge } from '@/components/underwriting/application-status-badge';
import UnderwritingApi from '@/lib/apis/underwriting';
import {
  ApproveRequest,
  RejectRequest,
  UnderwritingDetailResponse,
} from '@/lib/apis/underwriting-types';
import { hasAnyRole, UNDERWRITING_ROLES } from '@/lib/constants/user-types';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

/** Statuses where the manual decision form should be shown */
const ACTIONABLE_STATUSES = new Set([
  'UNDER_REVIEW',
  'RISK_ASSESSMENT',
  'CREDIT_CHECK',
  'CONDITIONALLY_APPROVED',
]);

/** Statuses that represent a final (read-only) decision */
const FINAL_STATUSES = new Set([
  'APPROVED',
  'REJECTED',
  'CONVERTED_TO_LOAN',
  'CANCELLED',
  'WITHDRAWN',
  'EXPIRED',
]);

export default function UnderwritingDetailPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [detail, setDetail] = useState<UnderwritingDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Role guard
  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    if (!hasAnyRole(user.roles, ...UNDERWRITING_ROLES)) {
      router.replace('/dashboard');
    }
  }, [authLoading, user, router]);

  const fetchDetail = useCallback(async () => {
    if (!id || isNaN(id)) return;
    setIsLoading(true);
    try {
      const res = await UnderwritingApi.getDetail(id);
      setDetail(res.data?.data ?? null);
    } catch {
      toast({ title: 'Error', description: 'Failed to load application detail.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!authLoading && user && hasAnyRole(user.roles, ...UNDERWRITING_ROLES)) {
      fetchDetail();
    }
  }, [authLoading, user, fetchDetail]);

  const handleApprove = async (body: ApproveRequest) => {
    setIsSubmitting(true);
    try {
      await UnderwritingApi.approve(id, body);
      toast({ title: 'Approved', description: 'Application has been approved successfully.' });
      await fetchDetail();
    } catch {
      toast({ title: 'Error', description: 'Failed to approve application.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (body: RejectRequest) => {
    setIsSubmitting(true);
    try {
      await UnderwritingApi.reject(id, body);
      toast({ title: 'Rejected', description: 'Application has been rejected.' });
      await fetchDetail();
    } catch {
      toast({ title: 'Error', description: 'Failed to reject application.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-0">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link href="/underwriting" className="hover:text-foreground transition-colors">
                Underwriting
              </Link>
              <span>/</span>
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {isLoading ? '...' : (detail?.applicationNumber ?? String(id))}
              </span>
            </nav>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/underwriting">
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </Link>
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {isLoading ? 'Loading...' : (detail?.applicationNumber ?? `Application #${id}`)}
                  </h1>
                  {detail && (
                    <ApplicationStatusBadge status={detail.status} className="mt-1" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : detail ? (
            <>
              {/* Detail sections */}
              <UnderwritingDetailPanel detail={detail} />

              {/* Decision form — only for actionable statuses */}
              {ACTIONABLE_STATUSES.has(detail.status) && !FINAL_STATUSES.has(detail.status) && (
                <UnderwritingDecisionForm
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              )}

              {/* Read-only notice for final statuses */}
              {FINAL_STATUSES.has(detail.status) && (
                <div className="rounded-lg border border-muted bg-muted/30 px-6 py-4 text-sm text-muted-foreground">
                  This application has a final decision (<strong>{detail.status}</strong>) and can no longer be actioned.
                </div>
              )}
            </>
          ) : (
            <div className="py-24 text-center text-muted-foreground">
              Application not found.
            </div>
          )}
        </div>

        {/* Global submitting overlay (prevents stale interactions) */}
        {isSubmitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}
      </main>
    </div>
  );
}
