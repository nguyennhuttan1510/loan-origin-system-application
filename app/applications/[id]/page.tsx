'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/dashboard/sidebar';
import { ApplicationStatusBadge } from '@/components/underwriting/application-status-badge';
import { LoanFormWizard } from '@/components/loan-form/loan-form-wizard';
import Application from '@/lib/apis/application';
import type { LoanApplication } from '@/lib/apis/application-types';
import { mapFormDataToUpdateRequest, loanApplicationToFormData } from '@/lib/utils/application-form-mapping';
import type { LoanFormData } from '@/lib/loan-form-types';
import { ApplicationStatus } from '@/lib/apis/underwriting-types';
import { hasAnyRole, UNDERWRITING_ROLES } from '@/lib/constants/user-types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function ApplicationDetailPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      const res = await Application.getApplicationDetail(id);
      setApplication(res.data?.data ?? null);
    } catch {
      toast({ title: 'Lỗi', description: 'Không tải được thông tin hồ sơ.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!authLoading && user && hasAnyRole(user.roles, ...UNDERWRITING_ROLES)) {
      fetchDetail();
    }
  }, [authLoading, user, fetchDetail]);

  const handleSubmitUpdate = useCallback(async (wizardData: LoanFormData) => {
    const payload = mapFormDataToUpdateRequest(wizardData);
    await Application.updateApplication(id, payload);
    toast({ title: 'Cập nhật thành công', description: 'Thông tin hồ sơ đã được lưu.' });
  }, [id]);

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
        <header className="border-b border-border bg-card">
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link href="/applications" className="hover:text-foreground transition-colors">
                Applications
              </Link>
              <span>/</span>
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {isLoading ? '...' : (application?.applicationNumber ?? String(id))}
              </span>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/applications">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {isLoading ? 'Loading...' : (application?.applicationNumber ?? `Application #${id}`)}
                </h1>
                {application && (
                  <ApplicationStatusBadge
                    status={application.status as ApplicationStatus}
                    className="mt-1"
                  />
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : application ? (
            <LoanFormWizard
              mode="edit"
              initialFormData={loanApplicationToFormData(application)}
              onSubmitOverride={handleSubmitUpdate}
            />
          ) : (
            <div className="py-24 text-center text-muted-foreground">
              Application not found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
