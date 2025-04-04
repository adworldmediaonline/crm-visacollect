'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
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
import { AlertCircle, ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { ArrivalInfoCard } from '@/components/ethiopia-visa/ArrivalInfo';
import { VisaDetailsCard } from '@/components/ethiopia-visa/VisaDetails';
import { ApplicationStatusCard } from '@/components/ethiopia-visa/ApplicationStatus';
import { ApplicantTabs } from '@/components/ethiopia-visa/ApplicantsTabs';

const EthiopiaVisaDetailPage = () => {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['ethiopiaVisaApplication', id],
    queryFn: async () => {
      const response = await ethiopiaVisaApi.getApplicationById(id);
      return response.data;
    },
  });
  //   if (isSuccess) {
  //     console.log(data);
  //     return (
  //       <div>
  //         <h1>Application Details</h1>
  //         <pre>{JSON.stringify(data, null, 2)}</pre>
  //       </div>
  //     );
  //   }
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Link href="/ethiopia-visa">
            <Button variant="ghost" size="sm" className="gap-2">
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
                  <Button variant="outline" size="sm" className="gap-2">
                    <Printer size={16} />
                    Print
                  </Button>
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

            <ApplicantTabs visaApplication={data} />
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
