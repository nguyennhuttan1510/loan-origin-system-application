'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/dashboard/sidebar';
import { UnderwritingQueueTable } from '@/components/underwriting/underwriting-queue-table';
import UnderwritingApi from '@/lib/apis/underwriting';
import { ApplicationStatus, UnderwritingListItem } from '@/lib/apis/underwriting-types';
import { hasAnyRole, UNDERWRITING_ROLES } from '@/lib/constants/user-types';
import { ShieldCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 20;

export default function UnderwritingQueuePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<UnderwritingListItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Role guard
  useEffect(() => {
    if (authLoading) return;
    if (!user) return; // useAuth handles redirect to /login
    if (!hasAnyRole(user.roles, ...UNDERWRITING_ROLES)) {
      router.replace('/dashboard');
    }
  }, [authLoading, user, router]);

  const fetchQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await UnderwritingApi.listQueue({
        page,
        size,
        ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
      });
      const data = res.data?.data;
      setItems(data?.content ?? []);
      setTotalElements(data?.totalElements ?? 0);
      setTotalPages(data?.totalPages ?? 0);
    } catch {
      toast({ title: 'Error', description: 'Failed to load underwriting queue.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [page, size, statusFilter]);

  useEffect(() => {
    if (!authLoading && user && hasAnyRole(user.roles, ...UNDERWRITING_ROLES)) {
      fetchQueue();
    }
  }, [authLoading, user, fetchQueue]);

  // Client-side search filter (applicationNumber)
  const filteredItems = searchValue.trim()
    ? items.filter((item) =>
        item.applicationNumber.toLowerCase().includes(searchValue.trim().toLowerCase())
      )
    : items;

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-0">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Underwriting Queue</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isLoading ? 'Loading...' : `${totalElements} application${totalElements !== 1 ? 's' : ''} pending review`}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <UnderwritingQueueTable
            items={filteredItems}
            totalElements={searchValue.trim() ? filteredItems.length : totalElements}
            totalPages={searchValue.trim() ? 1 : totalPages}
            page={page}
            size={size}
            isLoading={isLoading}
            statusFilter={statusFilter}
            searchValue={searchValue}
            onPageChange={(p) => setPage(p)}
            onSizeChange={(s) => { setSize(s); setPage(0); }}
            onStatusChange={(s) => { setStatusFilter(s); setPage(0); }}
            onSearchChange={(v) => setSearchValue(v)}
          />
        </div>
      </main>
    </div>
  );
}
