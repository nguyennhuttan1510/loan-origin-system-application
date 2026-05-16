'use client';

import { Loan, LOAN_TYPES } from '@/lib/loan-types';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const STATUS_COLORS = {
  pending: '#eab308',
  approved: '#3b82f6',
  rejected: '#ef4444',
  active: '#22c55e',
  completed: '#6b7280',
};

const LOAN_TYPE_COLORS = {
  personal: '#3b82f6',
  home: '#8b5cf6',
  auto: '#06b6d4',
  business: '#f59e0b',
  education: '#10b981',
};

interface LoanChartsProps {
  loans: Loan[];
}

export function LoanCharts({ loans }: LoanChartsProps) {
  // Prepare data for status distribution chart
  const statusData = Object.entries(
    loans.reduce((acc, loan) => {
      acc[loan.status] = (acc[loan.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    fill: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
  }));

  // Prepare data for loan type distribution
  const typeData = Object.entries(
    loans.reduce((acc, loan) => {
      const typeName = LOAN_TYPES[loan.loanType];
      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({
    name: type,
    value: count,
    fill: LOAN_TYPE_COLORS[Object.keys(LOAN_TYPES).find(
      key => LOAN_TYPES[key as keyof typeof LOAN_TYPES] === type
    ) as keyof typeof LOAN_TYPE_COLORS],
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Status Distribution</CardTitle>
          <CardDescription>
            Number of loans by status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Loan Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Loans by Type</CardTitle>
          <CardDescription>
            Distribution of loan types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
