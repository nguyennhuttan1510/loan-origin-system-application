'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ApproveRequest, RejectRequest } from '@/lib/apis/underwriting-types';

const approveSchema = z.object({
  reviewerNotes: z.string().min(1, 'Reviewer notes are required'),
});

const rejectSchema = z.object({
  rejectionReason: z.string().min(1, 'Rejection reason is required'),
  reviewerNotes: z.string().optional(),
});

type ApproveFormValues = z.infer<typeof approveSchema>;
type RejectFormValues = z.infer<typeof rejectSchema>;

type DialogAction = 'approve' | 'reject' | null;

interface UnderwritingDecisionFormProps {
  onApprove: (body: ApproveRequest) => Promise<void>;
  onReject: (body: RejectRequest) => Promise<void>;
}

export function UnderwritingDecisionForm({
  onApprove,
  onReject,
}: UnderwritingDecisionFormProps) {
  const [pendingAction, setPendingAction] = useState<DialogAction>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const approveForm = useForm<ApproveFormValues>({
    resolver: zodResolver(approveSchema),
    defaultValues: { reviewerNotes: '' },
  });

  const rejectForm = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema),
    defaultValues: { rejectionReason: '', reviewerNotes: '' },
  });

  const handleApproveClick = async () => {
    const valid = await approveForm.trigger();
    if (!valid) return;
    setPendingAction('approve');
  };

  const handleRejectClick = async () => {
    const valid = await rejectForm.trigger();
    if (!valid) return;
    setPendingAction('reject');
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (pendingAction === 'approve') {
        const values = approveForm.getValues();
        await onApprove({ reviewerNotes: values.reviewerNotes });
      } else if (pendingAction === 'reject') {
        const values = rejectForm.getValues();
        await onReject({
          rejectionReason: values.rejectionReason,
          reviewerNotes: values.reviewerNotes || undefined,
        });
      }
    } finally {
      setIsSubmitting(false);
      setPendingAction(null);
    }
  };

  return (
    <Card className="border-2 border-dashed border-muted">
      <CardHeader>
        <CardTitle className="text-base">Manual Underwriting Decision</CardTitle>
        <p className="text-sm text-muted-foreground">
          Review all information above before making a final decision.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Approve Section */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-green-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approve Application
          </h3>
          <Form {...approveForm}>
            <form className="space-y-3">
              <FormField
                control={approveForm.control}
                name="reviewerNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-800">
                      Reviewer Notes <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter your approval notes (required)..."
                        rows={3}
                        className="bg-white"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={handleApproveClick}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting && pendingAction === 'approve' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Approve
              </Button>
            </form>
          </Form>
        </div>

        {/* Reject Section */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Reject Application
          </h3>
          <Form {...rejectForm}>
            <form className="space-y-3">
              <FormField
                control={rejectForm.control}
                name="rejectionReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-800">
                      Rejection Reason <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter the rejection reason (required)..."
                        rows={3}
                        className="bg-white"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={rejectForm.control}
                name="reviewerNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-800">Reviewer Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Additional notes (optional)..."
                        rows={2}
                        className="bg-white"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                onClick={handleRejectClick}
                disabled={isSubmitting}
                variant="destructive"
              >
                {isSubmitting && pendingAction === 'reject' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Reject
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={pendingAction !== null} onOpenChange={(open) => { if (!open && !isSubmitting) setPendingAction(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction === 'approve'
                ? 'Are you sure you want to approve this loan application? This action will convert it to a loan and cannot be undone.'
                : 'Are you sure you want to reject this loan application? This action is final and cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isSubmitting}
              className={pendingAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-destructive hover:bg-destructive/90'}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {pendingAction === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
