'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ethiopiaVisaApi } from '@/utils/api-endpoints';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { ArrivalInfoCard } from '@/components/ethiopia-visa/ArrivalInfo';
import { VisaDetailsCard } from '@/components/ethiopia-visa/VisaDetails';
import { ApplicationStatusCard } from '@/components/ethiopia-visa/ApplicationStatus';
import { ApplicantTabs } from '@/components/ethiopia-visa/ApplicantsTabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const EthiopiaVisaDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [isReminderSending, setIsReminderSending] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['ethiopiaVisaApplication', id],
    queryFn: async () => {
      const response = await ethiopiaVisaApi.getApplicationById(id);
      return response.data;
    },
  });

  // Document reminder mutation
  const documentReminderMutation = useMutation({
    mutationFn: () => ethiopiaVisaApi.sendDocumentReminder(id),
    onMutate: () => {
      setIsReminderSending(true);
    },
    onSuccess: () => {
      toast.success("Document reminder email sent successfully");
      setIsReminderSending(false);
    },
    onError: () => {
      toast.error("Failed to send document reminder email");
      setIsReminderSending(false);
    },
  });

  // Payment reminder mutation
  const paymentReminderMutation = useMutation({
    mutationFn: () => ethiopiaVisaApi.sendPaymentReminder(id),
    onMutate: () => {
      setIsReminderSending(true);
    },
    onSuccess: () => {
      toast.success("Payment reminder email sent successfully");
      setIsReminderSending(false);
    },
    onError: () => {
      toast.error("Failed to send payment reminder email");
      setIsReminderSending(false);
    },
  });

  // Passport reminder mutation
  const passportReminderMutation = useMutation({
    mutationFn: () => ethiopiaVisaApi.sendPassportReminder(id),
    onMutate: () => {
      setIsReminderSending(true);
    },
    onSuccess: () => {
      toast.success("Passport reminder email sent successfully");
      setIsReminderSending(false);
    },
    onError: () => {
      toast.error("Failed to send passport reminder email");
      setIsReminderSending(false);
    },
  });

  // Photo reminder mutation
  const photoReminderMutation = useMutation({
    mutationFn: () => ethiopiaVisaApi.sendPhotoReminder(id),
    onMutate: () => {
      setIsReminderSending(true);
    },
    onSuccess: () => {
      toast.success("Photo reminder email sent successfully");
      setIsReminderSending(false);
    },
    onError: () => {
      toast.error("Failed to send photo reminder email");
      setIsReminderSending(false);
    },
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Link href="/ethiopia-visa">
            <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
              <ArrowLeft size={16} />
              Back to Applications
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load visa application details. Please try again later.
            </AlertDescription>
          </Alert>
        ) : data ? (
          <>
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    Visa Application: {data?.reference || id}
                  </CardTitle>
                  <CardDescription>
                    Review the details of this visa application
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        disabled={isReminderSending}
                      >
                        <Mail size={16} />
                        Send Reminder
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => documentReminderMutation.mutate()}
                        disabled={isReminderSending}
                      >
                        Documents Reminder
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => paymentReminderMutation.mutate()}
                        disabled={isReminderSending}
                      >
                        Payment Reminder
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => passportReminderMutation.mutate()}
                        disabled={isReminderSending}
                      >
                        Passport Reminder
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => photoReminderMutation.mutate()}
                        disabled={isReminderSending}
                      >
                        Photo Reminder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <ApplicationStatusCard visaApplication={data} />
              {data?.visaDetails && (
                <VisaDetailsCard visaDetails={data?.visaDetails} />
              )}
              {data?.arrivalInfo && (
                <ArrivalInfoCard arrivalInfo={data?.arrivalInfo} />
              )}
            </div>

            {data.additionalApplicants && (
              <ApplicantTabs
                visaApplication={data}
              />
            )}
          </>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Found</AlertTitle>
            <AlertDescription>
              The requested visa application could not be found.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EthiopiaVisaDetailPage;
