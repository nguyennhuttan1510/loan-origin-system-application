'use client';

import {useEffect, useState} from 'react';
import { mockStaff } from '@/lib/mock-staff';
import { Staff } from '@/lib/staff-types';
import { StaffTable } from '@/components/staff/staff-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { Users, Plus } from 'lucide-react';
import {Sidebar} from "@/components/dashboard/sidebar";
import {LoanFormWizard} from "@/components/loan-form/loan-form-wizard";
import {StaffApi} from "@/lib/apis";
import {StaffResponse} from "@/lib/apis/staff-types";
import {toast} from "sonner";
import {useAuth} from "@/lib/auth-context";

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffResponse[]>();
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const { user, isLoading } = useAuth();


  const getStaff = async () => {
    try {
      const res = await StaffApi.getStaffs()
      setStaff(res.data.data)
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    const fetch = async () => {
      await getStaff();
    }
    fetch();
  }, [])

  const handleDelete = async (staffId: number) => {
    try {
      const res = await StaffApi.deleteStaff(staffId);
      if (res.status === 200) {
        await getStaff();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-0">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage your team members and assign roles
              </p>
            </div>
          </div>
        </header>

        {/* Content */}

        <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">

          <Link href="/staff/create">
            <Button className="gap-2 mb-4">
              <Plus className="h-4 w-4" />
              Add Staff
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>All Staff Members</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <StaffTable
                staff={staff}
                onDelete={(staffId) => setDeleteConfirm(staffId)}
              />
            </CardContent>
          </Card>

          <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
            <AlertDialogContent>
              <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this staff member? This action cannot
                be undone.
              </AlertDialogDescription>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </div>
  );
}