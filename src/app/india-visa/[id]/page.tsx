'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { indianVisaApi } from '@/utils/api-endpoints';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function IndianVisaDetailsPage() {
  const params = useParams();
  const applicationId = params.id as string;
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState<string>('incomplete');

  const {
    data: application,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['indianVisaApplication', applicationId],
    queryFn: async () => {
      const response = await indianVisaApi.getApplicationById(applicationId);
      setStatus(response.data.visaStatus);
      return response.data;
    },
    enabled: !!applicationId,
  });

  const handleSendReminder = async (type: 'incomplete' | 'documents' | 'payment') => {
    try {
      if (type === 'incomplete') {
        await indianVisaApi.sendIncompleteReminder(applicationId);
      }
      else if (type === 'documents') {
        await indianVisaApi.sendDocumentReminder(applicationId);
      } else if (type === 'payment') {
        await indianVisaApi.sendPaymentReminder(applicationId);
      }

      toast.success(`The ${type} reminder has been sent successfully.`);
    } catch (error) {
      console.error(`Error sending ${type} reminder:`, error);
      toast.error(`Failed to send ${type} reminder. Please try again.`);
    }
  };

  const statusOptions = [
    "incomplete",
    "submitted",
    "pending document",
    "on hold",
    "pending",
    "form filled",
    "processed",
    "future processing",
    "visa granted",
    "visa email sent",
    "escalated",
    "visa declined",
    "refund pending",
    "refund completed",
    "payment disputed",
    "miscellaneous",
    "not interested",
    "chargeback",
  ];

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      await indianVisaApi.updateApplicationStatus(applicationId, newStatus);
      setStatus(newStatus);
      toast.success("Application status updated successfully");
    } catch (error) {
      toast.error("Failed to update application status");
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <Link href="/india-visa" className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load application details. Please try again later.
            </AlertDescription>
          </Alert>
        ) : application ? (
          <>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      Application #{application._id}
                    </CardTitle>
                    <CardDescription>
                      Created on{' '}
                      {format(new Date(application.createdAt), 'MMM dd, yyyy')}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge
                      variant={
                        application.visaStatus === 'approved'
                          ? 'outline'
                          : application.visaStatus === 'rejected'
                            ? 'destructive'
                            : application.visaStatus === 'pending' ||
                              application.visaStatus === 'processing'
                              ? 'default'
                              : 'outline'
                      }
                    >
                      Status: {application.visaStatus}
                    </Badge>
                    <Badge
                      variant={
                        application.paymentStatus === 'paid'
                          ? 'outline'
                          : application.paymentStatus === 'failed'
                            ? 'destructive'
                            : 'default'
                      }
                    >
                      Payment: {application.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Applicant Information
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Email:</p>
                        <p>{application.emailId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Contact Number:
                        </p>
                        <p>{application.contactNo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Name:</p>
                        <p>
                          {application.step2?.firstName}{' '}
                          {application.step2?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Nationality:
                        </p>
                        <p>{application.nationalityRegion}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Visa Information
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Visa Type:
                        </p>
                        <p>{application.visaService}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Port of Arrival:
                        </p>
                        <p>{application.portOfArrival}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Expected Arrival:
                        </p>
                        <p>
                          {format(
                            new Date(application.expectedDateOfArrival),
                            'MMM dd, yyyy'
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Price:</p>
                        <p>${application.price}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendReminder('incomplete')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Incomplete Reminder
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendReminder('documents')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Document Reminder
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendReminder('payment')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Payment Reminder
                  </Button>
                </div>
                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="status-select" className="text-sm font-medium">
                      Application Status
                    </label>
                    <Select
                      value={status}
                      onValueChange={handleStatusChange}
                      disabled={isUpdating}
                    >
                      <SelectTrigger id="status-select" className="w-[200px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal Details</TabsTrigger>
                <TabsTrigger value="address">Address & Family</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                    <CardDescription>
                      Applicant&apos;s personal and passport information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {application.step2 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Personal Information
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Full Name:
                              </p>
                              <p>
                                {application.step2.firstName}{' '}
                                {application.step2.lastName}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Gender:
                              </p>
                              <p>{application.step2.gender}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Date of Birth:
                              </p>
                              <p>{application.step2.dateOfBirth}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Place of Birth:
                              </p>
                              <p>
                                {application.step2.townCityOfBirth},{' '}
                                {application.step2.countryRegionOfBirth}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Religion:
                              </p>
                              <p>{application.step2.religion}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Passport Information
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Passport Number:
                              </p>
                              <p>{application.step2.passportNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Issue Date:
                              </p>
                              <p>{application.step2.dateOfIssue}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Expiry Date:
                              </p>
                              <p>{application.step2.dateOfExpiry}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Place of Issue:
                              </p>
                              <p>{application.step2.placeOfIssue}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Country of Issue:
                              </p>
                              <p>{application.step2.countryOfIssue}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Missing Information</AlertTitle>
                        <AlertDescription>
                          No personal details available for this application.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="address" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Address & Family Details</CardTitle>
                    <CardDescription>
                      Applicant&apos;s address and family information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {application.step3 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Address Information
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Street Address:
                              </p>
                              <p>{application.step3.houseNoStreet}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                City:
                              </p>
                              <p>{application.step3.villageTownCity}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                State/Province:
                              </p>
                              <p>{application.step3.stateProvinceDistrict}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Country:
                              </p>
                              <p>{application.step3.country}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Postal Code:
                              </p>
                              <p>{application.step3.postalZipCode}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Family Information
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Father&apos;s Name:
                              </p>
                              <p>
                                {application.step3.fatherFullName ||
                                  'Not provided'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Father&apos;s Nationality:
                              </p>
                              <p>
                                {application.step3.fatherNationality ||
                                  'Not provided'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Mother&apos;s Name:
                              </p>
                              <p>
                                {application.step3.motherFullName ||
                                  'Not provided'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Mother&apos;s Nationality:
                              </p>
                              <p>
                                {application.step3.motherNationality ||
                                  'Not provided'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Applicant&apos;s Marital Status:
                              </p>
                              <p>
                                {application.step3.applicantMaritalStatus ||
                                  'Not provided'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Missing Information</AlertTitle>
                        <AlertDescription>
                          No address or family details available for this
                          application.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>
                      Uploaded application documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {application.step6 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Profile Picture
                          </h3>
                          {application.step6.profilePicture ? (
                            <div className="overflow-hidden rounded-md w-32 h-32">
                              <img
                                src={application.step6.profilePicture}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <p className="text-muted-foreground">
                              No profile picture uploaded
                            </p>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            Passport
                          </h3>
                          {application.step6.passport &&
                            application.step6.passport.length > 0 ? (
                            <div className="space-y-2">
                              {application.step6.passport.map(
                                (doc: string, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <Button variant="outline" size="sm" asChild>
                                      <a
                                        href={doc}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        View Document {index + 1}
                                      </a>
                                    </Button>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">
                              No passport documents uploaded
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Missing Information</AlertTitle>
                        <AlertDescription>
                          No documents available for this application.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>
                      Payment details and status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Payment Status:
                          </p>
                          <Badge
                            variant={
                              application.paymentStatus === 'paid'
                                ? 'outline'
                                : application.paymentStatus === 'failed'
                                  ? 'destructive'
                                  : 'default'
                            }
                          >
                            {application.paymentStatus}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Payment Amount:
                          </p>
                          <p>${application.price}</p>
                        </div>
                        {application.paymentId && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Payment ID:
                            </p>
                            <p>{application.paymentId}</p>
                          </div>
                        )}
                        {application.paymentMethod && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Payment Method:
                            </p>
                            <p>{application.paymentMethod}</p>
                          </div>
                        )}
                        {application.paymentDate && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Payment Date:
                            </p>
                            <p>
                              {format(
                                new Date(application.paymentDate),
                                'MMM dd, yyyy'
                              )}
                            </p>
                          </div>
                        )}
                      </div>

                      {application.paymentStatus !== 'paid' && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Payment Required</AlertTitle>
                          <AlertDescription>
                            This application requires payment to proceed.
                            Consider sending a payment reminder to the
                            applicant.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
