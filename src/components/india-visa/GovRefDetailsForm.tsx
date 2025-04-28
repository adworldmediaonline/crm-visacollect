import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { indianVisaApi } from '@/utils/api-endpoints';

interface GovRefDetails {
  govRefEmail: string;
  govRefNumber: string;
  comment: string;
}

interface VisaApplication {
  govRefDetails?: GovRefDetails;
}

interface GovRefDetailsFormProps {
  applicationId: string;
  visaApplication?: VisaApplication;
}

export function GovRefDetailsForm({
  applicationId,
  visaApplication,
}: GovRefDetailsFormProps) {
  // Initialize form data
  let initialData = {
    govRefEmail: '',
    govRefNumber: '',
    comment: '',
  };
  const queryClient = useQueryClient();

  if (visaApplication && visaApplication.govRefDetails) {
    initialData = {
      govRefEmail: visaApplication.govRefDetails.govRefEmail || '',
      govRefNumber: visaApplication.govRefDetails.govRefNumber || '',
      comment: visaApplication.govRefDetails.comment || '',
    };
  }

  const [formData, setFormData] = useState<GovRefDetails>(initialData);

  // Mutation to update gov ref details
  const { mutate, isPending } = useMutation({
    mutationFn: (data: {
      visaApplicationId: string;
      govRefEmail: string;
      govRefNumber: string;
      comment: string;
    }) => indianVisaApi.createOrUpdateGovRefDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indianVisaApplication', applicationId] });
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
      visaApplicationId: applicationId,
      govRefEmail: formData.govRefEmail,
      govRefNumber: formData.govRefNumber,
      comment: formData.comment,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Government Reference Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
