'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ApplicationStatusBadge, RiskRatingBadge } from '@/components/underwriting/application-status-badge';
import { ApplicationStatus, UnderwritingListItem } from '@/lib/apis/underwriting-types';
import { ChevronLeft, ChevronRight, Search, Eye } from 'lucide-react';

const QUEUE_STATUSES: { value: ApplicationStatus | 'ALL'; label: string }[] = [
  { value: 'ALL',                   label: 'All Statuses' },
  { value: 'UNDER_REVIEW',          label: 'Under Review' },
  { value: 'RISK_ASSESSMENT',       label: 'Risk Assessment' },
  { value: 'CREDIT_CHECK',          label: 'Credit Check' },
  { value: 'CONDITIONALLY_APPROVED', label: 'Conditionally Approved' },
];

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr));
};

const getWaitingTime = (submittedAt: string | null): string => {
  if (!submittedAt) return '—';
  const diff = Date.now() - new Date(submittedAt).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return '1 day';
  return `${days} days`;
};

const GRADE_COLORS: Record<string, string> = {
  A: 'text-green-700 font-bold',
  B: 'text-teal-700 font-bold',
  C: 'text-yellow-700 font-bold',
  D: 'text-orange-700 font-bold',
  F: 'text-red-700 font-bold',
};

interface UnderwritingQueueTableProps {
  items: UnderwritingListItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  isLoading: boolean;
  statusFilter: ApplicationStatus | 'ALL';
  searchValue: string;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onStatusChange: (status: ApplicationStatus | 'ALL') => void;
  onSearchChange: (value: string) => void;
}

export function UnderwritingQueueTable({
  items,
  totalElements,
  totalPages,
  page,
  size,
  isLoading,
  statusFilter,
  searchValue,
  onPageChange,
  onSizeChange,
  onStatusChange,
  onSearchChange,
}: UnderwritingQueueTableProps) {
  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by application number..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => onStatusChange(v as ApplicationStatus | 'ALL')}
          >
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {QUEUE_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page:</span>
          <Select
            value={String(size)}
            onValueChange={(v) => onSizeChange(Number(v))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Application #</TableHead>
              <TableHead>Requested Amount</TableHead>
              <TableHead>Tenure</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Auto Grade</TableHead>
              <TableHead>Risk Rating</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Waiting</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                  No applications in the underwriting queue.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs max-w-[140px] truncate" title={item.applicationNumber}>
                    {item.applicationNumber.slice(0, 12)}...
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatVND(item.requestedAmount)}
                  </TableCell>
                  <TableCell>{item.requestedTenureMonths} mo.</TableCell>
                  <TableCell>
                    <ApplicationStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    {item.autoScoreGrade ? (
                      <span className={`text-sm ${GRADE_COLORS[item.autoScoreGrade] ?? 'text-foreground'}`}>
                        {item.autoScoreGrade}
                        {item.autoScoreTotal != null && (
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            ({item.autoScoreTotal})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <RiskRatingBadge rating={item.riskRating} />
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(item.submittedAt)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getWaitingTime(item.submittedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/underwriting/${item.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-1 h-4 w-4" />
                        Detail
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {page * size + 1}–{Math.min((page + 1) * size, totalElements)} of {totalElements} applications
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm">
              Page {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
