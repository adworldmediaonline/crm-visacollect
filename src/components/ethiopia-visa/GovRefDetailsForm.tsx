import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { ethiopiaVisaApi } from '@/utils/api-endpoints';
import { GovRefDetails, VisaApplication } from '@/types/ethiopia-visa';

interface GovRefDetailsFormProps {
  applicationId: string;
  visaApplication?: VisaApplication;
  applicantType: 'primary' | 'additional';
  additionalApplicantIndex?: number | null;
  onSuccess?: () => void;
}

export function GovRefDetailsForm({
  applicationId,
  visaApplication,
  applicantType,
  additionalApplicantIndex = null,
  onSuccess,
}: GovRefDetailsFormProps) {
  // Initialize form data from existing govRefDetails if available
  const initialData = visaApplication?.govRefDetails || {
    govRefEmail: '',
    govRefNumber: '',
    comment: '',
  };

  const [formData, setFormData] = useState<
    Omit<
      GovRefDetails,
      | '_id'
      | 'applicationId'
      | 'applicantType'
      | 'additionalApplicantIndex'
      | 'createdAt'
      | 'updatedAt'
      | '__v'
    >
  >({
    govRefEmail: initialData.govRefEmail || '',
    govRefNumber: initialData.govRefNumber || '',
    comment: initialData.comment || '',
  });

  // Mutation to update gov ref details
  const { mutate, isPending } = useMutation({
    mutationFn: (data: {
      applicationId: string;
      govRefEmail: string;
      govRefNumber: string;
      comment: string;
      applicantType: 'primary' | 'additional';
      additionalApplicantIndex: number | null;
    }) => ethiopiaVisaApi.createOrUpdateGovRefDetails(data),
    onSuccess: () => {
      toast.success('Government reference details updated successfully');
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: error => {
      console.error('Error updating government reference details:', error);
      toast.error('Failed to update government reference details');
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicationId) {
      toast.error('Application ID is missing');
      return;
    }

    mutate({
      applicationId,
      govRefEmail: formData.govRefEmail,
      govRefNumber: formData.govRefNumber,
      comment: formData.comment,
      applicantType,
      additionalApplicantIndex:
        applicantType === 'additional' ? additionalApplicantIndex : null,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Government Reference Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="govRefEmail">Government Reference Email</Label>
            <Input
              id="govRefEmail"
              name="govRefEmail"
              value={formData.govRefEmail}
              onChange={handleChange}
              placeholder="Enter government reference email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="govRefNumber">Government Reference Number</Label>
            <Input
              id="govRefNumber"
              name="govRefNumber"
              value={formData.govRefNumber}
              onChange={handleChange}
              placeholder="Enter government reference number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comments</Label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Add any additional comments or notes"
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Details'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
