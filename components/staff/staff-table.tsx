'use client';

import { Staff, staffRoleLabels } from '@/lib/staff-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit2, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import {StaffResponse} from "@/lib/apis/staff-types";

interface StaffTableProps {
  staff: StaffResponse[] | undefined;
  onEdit?: (staff: StaffResponse) => void;
  onDelete?: (staffId: number) => void;
}

export function StaffTable({ staff, onEdit, onDelete }: StaffTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {/*<TableHead>Email</TableHead>*/}
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Loans</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(staff) && staff.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.fullName}</TableCell>
              {/*<TableCell className="text-sm text-muted-foreground">*/}
              {/*  {member.email}*/}
              {/*</TableCell>*/}
              <TableCell className="w-1/4">
                  {/*{staffRoleLabels[member.role]}*/}
                  <div className="flex flex-wrap gap-2">
                    {member.roles.map((role, key) => (
                      <Badge key={key} variant="outline">{role.name}</Badge>
                    ))}
                  </div>
              </TableCell>
              <TableCell className="text-sm w-1/4">
                <div className="flex flex-wrap gap-2">
                  {member.departments.map((department, key) => (
                    <Badge key={key} variant="outline">{department}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={member.active ? 'default' : 'secondary'}
                >
                  {member.active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {0}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/staff/${member.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/staff/${member.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(member.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}