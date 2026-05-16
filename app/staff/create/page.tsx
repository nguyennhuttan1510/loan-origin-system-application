'use client';

import { useRouter } from 'next/navigation';
import { StaffForm } from '@/components/staff/staff-form';
import { Staff } from '@/lib/staff-types';
import {ChevronLeft, Plus, Users} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {Sidebar} from "@/components/dashboard/sidebar";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {StaffTable} from "@/components/staff/staff-table";
import {
  AlertDialog, AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {StaffFormTypes} from "@/lib/staff-form-types";
import {RegisterStaffRequest} from "@/lib/apis/authentication-types";
import {AuthenticationApi, CategoryApi, StaffApi} from "@/lib/apis";
import {useCallback, useEffect, useState} from "react";
import {CategoryItem} from "@/lib/apis/category-types";
import {HttpResponse} from "@/lib/http-types";
import {StaffResponse} from "@/lib/apis/staff-types";
import {useAuth} from "@/lib/auth-context";

export interface Categories {
  roles: CategoryItem[];
}

const initialCategory: Categories = {
  roles: []
}

interface StaffPageProps {
  mode: 'create' | 'edit'
  staff?: StaffResponse
}

export default function CreateStaffPage(props: StaffPageProps) {
  const {staff, mode} = props

  const [categories, setCategories] = useState<Categories>(initialCategory);

  const router = useRouter();

  const { user, isLoading } = useAuth();


  const onSetCategories = (partial: Partial<Categories>) => {
    setCategories(prevState => ({...prevState, ...partial}));
  }

  const getRoles = async () => {
    try {
      const rolesRes: HttpResponse<CategoryItem[]> = await CategoryApi.getRolesByAuth();
      onSetCategories({"roles": rolesRes.data.data});
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    const fetch = async () => {
      await getRoles()
    }
    fetch();
  }, [])

  const handleSubmit = async (data: StaffFormTypes) => {
    try {
      const payload: RegisterStaffRequest = {
        customerName: data.name,
        phoneNumber: data.phoneNumber,
        national: data.national,
        nationalId: data.nationalId,
        roles: data.roles,
        type: "STAFF"
      };
      if (mode === 'edit') {
        if(!staff?.id) throw new Error("Staff not found");
        await StaffApi.updateStaff(staff.id, payload);
      } else {
        await AuthenticationApi.registerStaff(payload);
      }
      router.push('/staff');

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

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="flex items-center gap-4">
            <Link href="/staff">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Staff
              </Button>
            </Link>
          </div>

          <div className="max-w-2xl">
            <StaffForm staff={staff} categories={categories} onSubmit={handleSubmit} />
          </div>
        </div>
      </main>
    </div>
  );
}