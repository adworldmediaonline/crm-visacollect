'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { indianVisaApi } from '@/utils/api-endpoints';
import { IndianVisaTable } from '@/components/india-visa/IndianVisaTable';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function IndianVisaPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['indianVisaApplications'],
    queryFn: async () => {
      const response = await indianVisaApi.getAllApplications();
      return response.data;
    },
  });
  console.log(data);
  // return;
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Indian Visa Applications</CardTitle>
            <CardDescription>
              Manage and view all Indian visa applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load visa applications. Please try again later.
                </AlertDescription>
              </Alert>
            ) : (
              <IndianVisaTable data={data} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
