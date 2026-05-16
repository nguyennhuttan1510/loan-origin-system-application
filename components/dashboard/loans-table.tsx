'use client';

import { Loan, LOAN_TYPES, LOAN_STATUS_COLORS } from '@/lib/loan-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoansTableProps {
  loans: Loan[];
}

export function LoansTable({ loans }: LoansTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'pending':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'approved':
        return `${baseClass} bg-blue-100 text-blue-800`;
      case 'rejected':
        return `${baseClass} bg-red-100 text-red-800`;
      case 'active':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'completed':
        return `${baseClass} bg-gray-100 text-gray-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loans</CardTitle>
        <CardDescription>
          {loans.length} total loans in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Loan Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-mono text-sm font-semibold">
                    {loan.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {loan.customerName}
                  </TableCell>
                  <TableCell>
                    {LOAN_TYPES[loan.loanType]}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(loan.amount)}
                  </TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClass(loan.status)}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
