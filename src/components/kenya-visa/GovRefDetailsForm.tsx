import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { kenyaVisaApi } from '@/utils/api-endpoints';
import { GovRefDetails, VisaApplication } from '@/types/kenya-visa';

interface GovRefDetailsFormProps {
  applicationId: string;
  visaApplication?: VisaApplication;
  applicantType: 'primary' | 'additional';
  additionalApplicantIndex?: number | null;
}

export function GovRefDetailsForm({
  applicationId,
  visaApplication,
  applicantType,
  additionalApplicantIndex = null,
}: GovRefDetailsFormProps) {
  // Initialize form data based on applicant type
  let initialData = {
    govRefEmail: '',
    govRefNumber: '',
    comment: '',
  };
  const queryClient = useQueryClient();

  if (visaApplication) {
    if (applicantType === 'primary' && visaApplication.govRefDetails) {
      // For primary applicant, use the main govRefDetails
      initialData = {
        govRefEmail: visaApplication.govRefDetails.govRefEmail || '',
        govRefNumber: visaApplication.govRefDetails.govRefNumber || '',
        comment: visaApplication.govRefDetails.comment || '',
      };
    } else if (
      applicantType === 'additional' &&
      additionalApplicantIndex !== null &&
      visaApplication.additionalApplicants &&
      visaApplication.additionalApplicants[additionalApplicantIndex]?.govRefDetails
    ) {
      // For additional applicant, use the govRefDetails from the specific additional applicant
      const additionalApplicantGovRef = visaApplication.additionalApplicants[additionalApplicantIndex].govRefDetails;
      initialData = {
        govRefEmail: additionalApplicantGovRef.govRefEmail || '',
        govRefNumber: additionalApplicantGovRef.govRefNumber || '',
        comment: additionalApplicantGovRef.comment || '',
      };
    }
  }

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
  >(initialData);

  // Mutation to update gov ref details
  const { mutate, isPending } = useMutation({
    mutationFn: (data: {
      applicationId: string;
      govRefEmail: string;
      govRefNumber: string;
      comment: string;
      applicantType: 'primary' | 'additional';
      additionalApplicantIndex: number | null;
    }) => kenyaVisaApi.createOrUpdateGovRefDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['KenyaVisaApplication', applicationId] });
      toast.success('Government reference details updated successfully');
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
        <CardTitle>
          {applicantType === 'primary'
            ? 'Government Reference Details'
            : `Government Reference Details - Additional Applicant ${additionalApplicantIndex !== null ? additionalApplicantIndex + 1 : ''}`}
        </CardTitle>
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
