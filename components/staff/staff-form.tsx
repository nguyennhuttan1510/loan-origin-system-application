'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import {staffFormSchema, StaffFormTypes} from "@/lib/staff-form-types";
import {Categories} from "@/app/staff/create/page";
import {StaffResponse} from "@/lib/apis/staff-types";

interface StaffFormProps {
  staff?: StaffResponse;
  onSubmit: (data: StaffFormTypes) => void;
  isLoading?: boolean;
  categories: Categories
}

export function StaffForm({ staff, categories, onSubmit, isLoading }: StaffFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<StaffFormTypes>({
    name: staff?.fullName || '',
    phoneNumber: staff?.phone || '',
    national: "",
    nationalId: "",
    roles: []
    // department: staff?.department || '',
    // status: staff?.status || 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if(!staff) return;
    setFormData({
      name: staff?.fullName,
      phoneNumber: staff?.phone,
      national: staff.national,
      nationalId: staff.nationalId,
      roles: staff.roles.map(item => item.value)
    })
  }, [staff])

  const roleMap = useMemo(() => {
    const map = new Map<string, string>()
    categories.roles.forEach(role => {
      map.set(role.value, role.name)
    })
    return map
  }, [categories.roles]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({id: staff?.id, ...formData});
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {staff ? 'Edit Staff Member' : 'Create New Staff Member'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {hasErrors && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  Please fix the errors below
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className={errors.phoneNumber ? 'border-destructive' : ''}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-destructive">{errors.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nation">Nation</Label>
              <Input
                id="nation"
                type="nation"
                value={formData.national}
                onChange={(e) =>
                  setFormData({ ...formData, national: e.target.value })
                }
                className={errors.national ? 'border-destructive' : ''}
              />
              {errors.national && (
                <p className="text-xs text-destructive">{errors.national}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalId">NationalId</Label>
              <Input
                id="nationalId"
                type="nationalId"
                value={formData.nationalId}
                onChange={(e) =>
                  setFormData({ ...formData, nationalId: e.target.value })
                }
                className={errors.nationalId ? 'border-destructive' : ''}
              />
              {errors.nationalId && (
                <p className="text-xs text-destructive">{errors.nationalId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roles">Roles</Label>
              <Select onValueChange={(role) =>
                setFormData({ ...formData, roles: [...formData.roles, role] })
              }>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.roles?.map((role, key) => (
                    <SelectItem key={key} value={role.value}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2">
                {formData.roles.map((roleId, key) => (
                  <Badge variant='outline' key={key}>{roleMap.get(String(roleId))}</Badge>
                ))}
              </div>
            </div>


            {/*<div className="space-y-2">*/}
            {/*  <Label htmlFor="department">Department</Label>*/}
            {/*  <Select*/}
            {/*    value={formData.department}*/}
            {/*    onValueChange={(dept) =>*/}
            {/*      setFormData({ ...formData, department: dept })*/}
            {/*    }*/}
            {/*  >*/}
            {/*    <SelectTrigger id="department" className="w-full">*/}
            {/*      <SelectValue />*/}
            {/*    </SelectTrigger>*/}
            {/*    <SelectContent>*/}
            {/*      {staffDepartments.map((dept) => (*/}
            {/*        <SelectItem key={dept} value={dept}>*/}
            {/*          {dept}*/}
            {/*        </SelectItem>*/}
            {/*      ))}*/}
            {/*    </SelectContent>*/}
            {/*  </Select>*/}
            {/*  {errors.department && (*/}
            {/*    <p className="text-xs text-destructive">{errors.department}</p>*/}
            {/*  )}*/}
            {/*</div>*/}

            {/*<div className="space-y-2">*/}
            {/*  <Label htmlFor="status">Status</Label>*/}
            {/*  <Select*/}
            {/*    value={formData.status}*/}
            {/*    onValueChange={(status) =>*/}
            {/*      setFormData({*/}
            {/*        ...formData,*/}
            {/*        status: status as 'active' | 'inactive',*/}
            {/*      })*/}
            {/*    }*/}
            {/*  >*/}
            {/*    <SelectTrigger id="status" className="w-full">*/}
            {/*      <SelectValue />*/}
            {/*    </SelectTrigger>*/}
            {/*    <SelectContent>*/}
            {/*      <SelectItem value="active">Active</SelectItem>*/}
            {/*      <SelectItem value="inactive">Inactive</SelectItem>*/}
            {/*    </SelectContent>*/}
            {/*  </Select>*/}
            {/*</div>*/}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Staff Member'}
            </Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}