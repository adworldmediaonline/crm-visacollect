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
import {
  ArrowLeft,
  AlertCircle,
  Mail,
  User,
  Globe,
  CreditCard,
  Calendar,
  Phone,
  MapPin,
  Plane,
  FileText,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function IndianVisaDetailsPage() {
  const params = useParams();
  const applicationId = params.id as string;

  const {
    data: application,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['indianVisaApplication', applicationId],
    queryFn: async () => {
      const response = await indianVisaApi.getApplicationById(applicationId);
      return response.data;
    },
    enabled: !!applicationId,
  });

  const handleSendReminder = async (type: 'documents' | 'payment') => {
    try {
      if (type === 'documents') {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatVisaService = (application: {
    visaService?: string;
    eTouristVisa30Days?: string;
    eTouristVisa1Year?: string;
    eTouristVisa5Years?: string;
    eBusinessVisa?: string;
    eMedicalVisa?: string;
    eConferenceVisa?: string;
    eMedicalAttendantVisa?: string;
    eEmergencyXMisc?: string;
  }) => {
    let visaDetails = application.visaService || 'Not specified';

    // Add sub-visa details based on what's available
    if (application.eTouristVisa30Days) {
      visaDetails += ` - ${application.eTouristVisa30Days}`;
    } else if (application.eTouristVisa1Year) {
      visaDetails += ` - ${application.eTouristVisa1Year}`;
    } else if (application.eTouristVisa5Years) {
      visaDetails += ` - ${application.eTouristVisa5Years}`;
    } else if (application.eBusinessVisa) {
      visaDetails += ` - ${application.eBusinessVisa}`;
    } else if (application.eMedicalVisa) {
      visaDetails += ` - ${application.eMedicalVisa}`;
    } else if (application.eConferenceVisa) {
      visaDetails += ` - ${application.eConferenceVisa}`;
    } else if (application.eMedicalAttendantVisa) {
      visaDetails += ` - ${application.eMedicalAttendantVisa}`;
    } else if (application.eEmergencyXMisc) {
      visaDetails += ` - ${application.eEmergencyXMisc}`;
    }

    return visaDetails;
  };

  const getCloudinaryUrl = (publicId: string) => {
    if (!publicId) return '#';
    // If it's already a full URL, return as is
    if (publicId.startsWith('http')) return publicId;
    // Otherwise, construct Cloudinary URL
    return `https://res.cloudinary.com/${
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'
    }/image/upload/${publicId}`;
  };

  console.log(application);
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
            <CardContent className="pt-0">
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
            {/* profile card start - Step 1 Details Only */}
            <Card className="overflow-hidden border-0 pt-0 shadow-2xl bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 mt-0">
              {/* Enhanced Header */}
              <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white pb-8 pt-8 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                <div className="relative flex justify-between items-center">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
                        <FileText className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold tracking-wide text-white drop-shadow-sm">
                          Application #{application._id}
                        </CardTitle>
                        <CardDescription className="text-blue-100 text-lg font-medium mt-1">
                          Created on{' '}
                          {format(
                            new Date(application.createdAt),
                            'MMMM dd, yyyy'
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendReminder('documents')}
                        className="flex items-center gap-2 px-3 py-2 text-xs bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200 shadow-sm hover:shadow backdrop-blur-sm group"
                      >
                        <div className="h-4 w-4 rounded bg-white/20 group-hover:bg-white/30 transition-colors duration-200 flex items-center justify-center">
                          <Mail className="h-2.5 w-2.5 text-white" />
                        </div>
                        <span className="font-medium">Documents</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendReminder('payment')}
                        className="flex items-center gap-2 px-3 py-2 text-xs bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200 shadow-sm hover:shadow backdrop-blur-sm group"
                      >
                        <div className="h-4 w-4 rounded bg-white/20 group-hover:bg-white/30 transition-colors duration-200 flex items-center justify-center">
                          <Mail className="h-2.5 w-2.5 text-white" />
                        </div>
                        <span className="font-medium">Payment</span>
                      </Button>
                    </div>

                    <Badge
                      className={`
                        px-6 py-3 text-base font-bold rounded-2xl shadow-xl border-2 border-white/40 backdrop-blur-sm
                        ${
                          application.visaStatus === 'approved'
                            ? 'bg-emerald-500/90 hover:bg-emerald-600 text-white'
                            : application.visaStatus === 'rejected'
                            ? 'bg-red-500/90 hover:bg-red-600 text-white'
                            : application.visaStatus === 'pending' ||
                              application.visaStatus === 'processing'
                            ? 'bg-amber-500/90 hover:bg-amber-600 text-white'
                            : 'bg-slate-500/90 hover:bg-slate-600 text-white'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-white animate-pulse shadow-lg"></div>
                        <span className="font-bold tracking-wide">
                          {application.visaStatus === 'incomplete'
                            ? 'Incomplete Form'
                            : application.visaStatus === 'pending'
                            ? 'Paid'
                            : application.visaStatus?.toUpperCase()}
                        </span>
                      </div>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              {/* Enhanced Content */}
              <CardContent className="p-3 space-y-3">
                {/* Application Details Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                      <FileText className="h-3 w-3 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800">
                      Application Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white group">
                      <CardContent className="p-3">
                        <div className="flex flex-col items-center text-center gap-1">
                          <div className="h-6 w-6 rounded-md bg-blue-100 group-hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center">
                            <Globe className="h-3 w-3 text-blue-600" />
                          </div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Type
                          </p>
                          <p className="text-xs font-bold text-gray-900 leading-tight">
                            {application.applicationType || 'Not specified'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white group">
                      <CardContent className="p-3">
                        <div className="flex flex-col items-center text-center gap-1">
                          <div className="h-6 w-6 rounded-md bg-green-100 group-hover:bg-green-200 transition-colors duration-200 flex items-center justify-center">
                            <Globe className="h-3 w-3 text-green-600" />
                          </div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Country
                          </p>
                          <p className="text-xs font-bold text-gray-900 leading-tight">
                            {application.nationalityRegion || 'Not specified'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white group">
                      <CardContent className="p-3">
                        <div className="flex flex-col items-center text-center gap-1">
                          <div className="h-6 w-6 rounded-md bg-purple-100 group-hover:bg-purple-200 transition-colors duration-200 flex items-center justify-center">
                            <CreditCard className="h-3 w-3 text-purple-600" />
                          </div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Passport
                          </p>
                          <p className="text-xs font-bold text-gray-900 leading-tight">
                            {application.passportType || 'Not specified'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white group">
                      <CardContent className="p-3">
                        <div className="flex flex-col items-center text-center gap-1">
                          <div className="h-6 w-6 rounded-md bg-orange-100 group-hover:bg-orange-200 transition-colors duration-200 flex items-center justify-center">
                            <Calendar className="h-3 w-3 text-orange-600" />
                          </div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            DOB
                          </p>
                          <p className="text-xs font-bold text-gray-900 leading-tight">
                            {formatDate(application.dateOfBirth)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white group">
                      <CardContent className="p-3">
                        <div className="flex flex-col items-center text-center gap-1">
                          <div className="h-6 w-6 rounded-md bg-indigo-100 group-hover:bg-indigo-200 transition-colors duration-200 flex items-center justify-center">
                            <Plane className="h-3 w-3 text-indigo-600" />
                          </div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Port
                          </p>
                          <p className="text-xs font-bold text-gray-900 leading-tight">
                            {application.portOfArrival || 'Not specified'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white group">
                      <CardContent className="p-3">
                        <div className="flex flex-col items-center text-center gap-1">
                          <div className="h-6 w-6 rounded-md bg-teal-100 group-hover:bg-teal-200 transition-colors duration-200 flex items-center justify-center">
                            <Calendar className="h-3 w-3 text-teal-600" />
                          </div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Arrival
                          </p>
                          <p className="text-xs font-bold text-gray-900 leading-tight">
                            {formatDate(application.expectedDateOfArrival)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Contact & Travel Information Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                      <Mail className="h-3 w-3 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800">
                      Contact Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white group">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-md bg-blue-100 group-hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center">
                            <Mail className="h-3 w-3 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Email
                            </p>
                            <p className="text-xs font-bold text-gray-900 truncate">
                              {application.emailId || 'Not provided'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white group">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-md bg-green-100 group-hover:bg-green-200 transition-colors duration-200 flex items-center justify-center">
                            <Phone className="h-3 w-3 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Phone
                            </p>
                            <p className="text-xs font-bold text-gray-900 truncate">
                              {application.contactNo || 'Not provided'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Visa Service Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-5 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                      <MapPin className="h-3 w-3 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800">
                      Visa Service
                    </h3>
                  </div>
                  <Card className="border shadow-sm bg-gradient-to-br from-purple-50 to-blue-50 hover:shadow-md transition-all duration-200 group">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 group-hover:from-purple-600 group-hover:to-indigo-700 transition-all duration-200 flex items-center justify-center shadow-sm">
                          <DollarSign className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs font-bold text-purple-700 uppercase tracking-wide">
                            Selected Service
                          </p>
                          <p className="text-sm font-bold text-purple-900 leading-tight">
                            {formatVisaService(application)}
                          </p>
                          {application.price > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="h-5 w-5 rounded-md bg-green-100 flex items-center justify-center">
                                <DollarSign className="h-3 w-3 text-green-600" />
                              </div>
                              <div>
                                <span className="text-sm font-bold text-green-600">
                                  ${application.price}
                                </span>
                                <span className="text-xs text-gray-500 ml-1">
                                  Total
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            {/* profile card end */}

            {/* Summary Overview Section */}
            <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-800">
                      Application Overview
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Quick summary of application progress and key information
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1">
                      ID: {application._id}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {/* Progress Cards */}
                  <Card className="border shadow-sm bg-white hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 text-center">
                      <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Step 2
                      </p>
                      <p className="text-xs font-bold text-gray-900">
                        Personal
                      </p>
                      <Badge
                        variant={application.step2 ? 'outline' : 'secondary'}
                        className="mt-1 text-xs"
                      >
                        {application.step2 ? 'Complete' : 'Pending'}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm bg-white hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 text-center">
                      <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Step 3
                      </p>
                      <p className="text-xs font-bold text-gray-900">Address</p>
                      <Badge
                        variant={application.step3 ? 'outline' : 'secondary'}
                        className="mt-1 text-xs"
                      >
                        {application.step3 ? 'Complete' : 'Pending'}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm bg-white hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 text-center">
                      <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center">
                        <Plane className="h-4 w-4 text-purple-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Step 4
                      </p>
                      <p className="text-xs font-bold text-gray-900">Travel</p>
                      <Badge
                        variant={application.step4 ? 'outline' : 'secondary'}
                        className="mt-1 text-xs"
                      >
                        {application.step4 ? 'Complete' : 'Pending'}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm bg-white hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 text-center">
                      <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Step 5
                      </p>
                      <p className="text-xs font-bold text-gray-900">
                        Background
                      </p>
                      <Badge
                        variant={application.step5 ? 'outline' : 'secondary'}
                        className="mt-1 text-xs"
                      >
                        {application.step5 ? 'Complete' : 'Pending'}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm bg-white hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 text-center">
                      <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-orange-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Step 6
                      </p>
                      <p className="text-xs font-bold text-gray-900">
                        Documents
                      </p>
                      <Badge
                        variant={application.step6 ? 'outline' : 'secondary'}
                        className="mt-1 text-xs"
                      >
                        {application.step6 ? 'Complete' : 'Pending'}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm bg-white hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 text-center">
                      <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-indigo-100 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-indigo-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Payment
                      </p>
                      <p className="text-xs font-bold text-gray-900">Terms</p>
                      <Badge
                        variant={
                          application.paid ||
                          application.paymentStatus === 'paid'
                            ? 'outline'
                            : 'secondary'
                        }
                        className="mt-1 text-xs"
                      >
                        {application.paid ||
                        application.paymentStatus === 'paid'
                          ? 'Paid'
                          : 'Pending'}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendReminder('documents')}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Send Document Reminder
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendReminder('payment')}
                    className="flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Send Payment Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  Detailed Application Information
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Complete step-by-step application details organized by
                  categories
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="step2" className="w-full">
                  <div className="px-6 pt-2">
                    <TabsList className="grid w-full grid-cols-6 h-auto p-1">
                      <TabsTrigger
                        value="step2"
                        className="flex flex-col items-center gap-1 p-3"
                      >
                        <User className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          Personal Details
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="step3"
                        className="flex flex-col items-center gap-1 p-3"
                      >
                        <MapPin className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          Address & Family
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="step4"
                        className="flex flex-col items-center gap-1 p-3"
                      >
                        <Plane className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          Travel & Background
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="step5"
                        className="flex flex-col items-center gap-1 p-3"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          Security Questions
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="step6"
                        className="flex flex-col items-center gap-1 p-3"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="text-xs font-medium">Documents</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="step8"
                        className="flex flex-col items-center gap-1 p-3"
                      >
                        <DollarSign className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          Terms & Payment
                        </span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6">
                    {/* Step 2 - Personal Details */}
                    <TabsContent value="step2" className="mt-0">
                      <Card>
                        <CardHeader>
                          <CardTitle>Step 2 - Personal Details</CardTitle>
                          <CardDescription>
                            Applicant&apos;s personal and passport information
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {application.step2 ? (
                            <div className="space-y-6">
                              {/* Personal Information */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                                    <User className="h-3 w-3 text-white" />
                                  </div>
                                  <h3 className="text-lg font-bold text-gray-800">
                                    Personal Information
                                  </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {application.step2.firstName && (
                                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <User className="h-4 w-4 text-blue-600" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Full Name
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                              {application.step2.firstName}{' '}
                                              {application.step2.lastName}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                  {application.step2.gender && (
                                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                          <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <User className="h-4 w-4 text-purple-600" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Gender
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                              {application.step2.gender}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                  {application.step2.dateOfBirth && (
                                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                          <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                            <Calendar className="h-4 w-4 text-green-600" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Date of Birth
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                              {formatDate(
                                                application.step2.dateOfBirth
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                  {(application.step2.townCityOfBirth ||
                                    application.step2.countryRegionOfBirth) && (
                                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                          <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                            <MapPin className="h-4 w-4 text-orange-600" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Place of Birth
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                              {
                                                application.step2
                                                  .townCityOfBirth
                                              }
                                              {application.step2
                                                .townCityOfBirth &&
                                                application.step2
                                                  .countryRegionOfBirth &&
                                                ', '}
                                              {
                                                application.step2
                                                  .countryRegionOfBirth
                                              }
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                  {application.step2.religion && (
                                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                          <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                            <Globe className="h-4 w-4 text-indigo-600" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Religion
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                              {application.step2.religion}
                                              {application.step2
                                                .religionOther &&
                                                ` - ${application.step2.religionOther}`}
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                  {application.step2
                                    .educationalQualification && (
                                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                      <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                          <div className="h-8 w-8 rounded-lg bg-teal-100 flex items-center justify-center">
                                            <FileText className="h-4 w-4 text-teal-600" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Education
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                              {
                                                application.step2
                                                  .educationalQualification
                                              }
                                            </p>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </div>
                              </div>

                              {/* Nationality & Citizenship */}
                              {(application.step2.nationalityRegion ||
                                application.step2.citizenshipNationalID) && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                                      <Globe className="h-3 w-3 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                      Nationality & Citizenship
                                    </h3>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {application.step2.nationalityRegion && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                              <Globe className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Nationality
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step2
                                                    .nationalityRegion
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step2
                                      .citizenshipNationalID && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                              <CreditCard className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Citizenship ID
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step2
                                                    .citizenshipNationalID
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Passport Information */}
                              {(application.step2.passportNumber ||
                                application.step2.placeOfIssue) && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                                      <CreditCard className="h-3 w-3 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                      Passport Information
                                    </h3>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {application.step2.passportNumber && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                              <CreditCard className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Passport Number
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step2
                                                    .passportNumber
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step2.placeOfIssue && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                              <MapPin className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Place of Issue
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {application.step2.placeOfIssue}
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step2.dateOfIssue && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                              <Calendar className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Date of Issue
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {formatDate(
                                                  application.step2.dateOfIssue
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step2.dateOfExpiry && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                                              <Calendar className="h-4 w-4 text-red-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Date of Expiry
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {formatDate(
                                                  application.step2.dateOfExpiry
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step2.countryOfIssue && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                              <Globe className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Country of Issue
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step2
                                                    .countryOfIssue
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Additional Information */}
                              {(application.step2.visibleIdentificationMarks ||
                                application.step2.changedName) && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-sm">
                                      <FileText className="h-3 w-3 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                      Additional Information
                                    </h3>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {application.step2
                                      .visibleIdentificationMarks && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                              <FileText className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Identification Marks
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step2
                                                    .visibleIdentificationMarks
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step2.changedName &&
                                      application.step2.previousName && (
                                        <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                          <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                              <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                                                <User className="h-4 w-4 text-yellow-600" />
                                              </div>
                                              <div className="flex-1">
                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                  Previous Name
                                                </p>
                                                <p className="text-sm font-bold text-gray-900">
                                                  {
                                                    application.step2
                                                      .previousName
                                                  }{' '}
                                                  {
                                                    application.step2
                                                      .previousLastName
                                                  }
                                                </p>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500">
                                No Step 2 data available
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Step 3 - Address & Family Details */}
                    <TabsContent value="step3" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            Step 3 - Address & Family Details
                          </CardTitle>
                          <CardDescription>
                            Address information and family background
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {application.step3 ? (
                            <div className="space-y-6">
                              {/* Present Address */}
                              {(application.step3.houseNoStreet ||
                                application.step3.villageTownCity) && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                                      <MapPin className="h-3 w-3 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                      Present Address
                                    </h3>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {application.step3.houseNoStreet && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                              <MapPin className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                House/Street
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step3
                                                    .houseNoStreet
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step3.villageTownCity && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                              <MapPin className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                City
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step3
                                                    .villageTownCity
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step3
                                      .stateProvinceDistrict && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                              <Globe className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                State/District
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step3
                                                    .stateProvinceDistrict
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step3.country && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                              <Globe className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Country
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {application.step3.country}
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step3.postalZipCode && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                              <Mail className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Postal Code
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step3
                                                    .postalZipCode
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Contact Information */}
                              {(application.step3.phoneNo ||
                                application.step3.mobileNo ||
                                application.step3.emailAddress) && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                                      <Phone className="h-3 w-3 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                      Contact Information
                                    </h3>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {application.step3.phoneNo && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                              <Phone className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Phone
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {application.step3.phoneNo}
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step3.mobileNo && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                              <Phone className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Mobile
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {application.step3.mobileNo}
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step3.emailAddress && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                              <Mail className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Email
                                              </p>
                                              <p className="text-sm font-bold text-gray-900 truncate">
                                                {application.step3.emailAddress}
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Family Information */}
                              {(application.step3.fatherFullName ||
                                application.step3.motherFullName ||
                                application.step3.spouseFullName) && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                                      <User className="h-3 w-3 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                      Family Information
                                    </h3>
                                  </div>
                                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Father's Details */}
                                    {application.step3.fatherFullName && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                                        <CardContent className="p-4">
                                          <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="h-6 w-6 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <User className="h-3 w-3 text-blue-600" />
                                              </div>
                                              <h4 className="text-sm font-bold text-gray-800">
                                                Father's Details
                                              </h4>
                                            </div>
                                            <div className="space-y-2">
                                              <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                  Name
                                                </p>
                                                <p className="text-sm font-bold text-gray-900">
                                                  {
                                                    application.step3
                                                      .fatherFullName
                                                  }
                                                </p>
                                              </div>
                                              {application.step3
                                                .fatherNationality && (
                                                <div>
                                                  <p className="text-xs font-medium text-gray-500">
                                                    Nationality
                                                  </p>
                                                  <p className="text-sm font-bold text-gray-900">
                                                    {
                                                      application.step3
                                                        .fatherNationality
                                                    }
                                                  </p>
                                                </div>
                                              )}
                                              {application.step3
                                                .fatherPlaceOfBirth && (
                                                <div>
                                                  <p className="text-xs font-medium text-gray-500">
                                                    Place of Birth
                                                  </p>
                                                  <p className="text-sm font-bold text-gray-900">
                                                    {
                                                      application.step3
                                                        .fatherPlaceOfBirth
                                                    }
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                    {/* Mother's Details */}
                                    {application.step3.motherFullName && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-pink-50 to-rose-50">
                                        <CardContent className="p-4">
                                          <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="h-6 w-6 rounded-lg bg-pink-100 flex items-center justify-center">
                                                <User className="h-3 w-3 text-pink-600" />
                                              </div>
                                              <h4 className="text-sm font-bold text-gray-800">
                                                Mother's Details
                                              </h4>
                                            </div>
                                            <div className="space-y-2">
                                              <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                  Name
                                                </p>
                                                <p className="text-sm font-bold text-gray-900">
                                                  {
                                                    application.step3
                                                      .motherFullName
                                                  }
                                                </p>
                                              </div>
                                              {application.step3
                                                .motherNationality && (
                                                <div>
                                                  <p className="text-xs font-medium text-gray-500">
                                                    Nationality
                                                  </p>
                                                  <p className="text-sm font-bold text-gray-900">
                                                    {
                                                      application.step3
                                                        .motherNationality
                                                    }
                                                  </p>
                                                </div>
                                              )}
                                              {application.step3
                                                .motherPlaceOfBirth && (
                                                <div>
                                                  <p className="text-xs font-medium text-gray-500">
                                                    Place of Birth
                                                  </p>
                                                  <p className="text-sm font-bold text-gray-900">
                                                    {
                                                      application.step3
                                                        .motherPlaceOfBirth
                                                    }
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                    {/* Spouse Details */}
                                    {application.step3.spouseFullName && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-green-50 to-emerald-50">
                                        <CardContent className="p-4">
                                          <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="h-6 w-6 rounded-lg bg-green-100 flex items-center justify-center">
                                                <User className="h-3 w-3 text-green-600" />
                                              </div>
                                              <h4 className="text-sm font-bold text-gray-800">
                                                Spouse Details
                                              </h4>
                                            </div>
                                            <div className="space-y-2">
                                              <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                  Name
                                                </p>
                                                <p className="text-sm font-bold text-gray-900">
                                                  {
                                                    application.step3
                                                      .spouseFullName
                                                  }
                                                </p>
                                              </div>
                                              {application.step3
                                                .spouseNationality && (
                                                <div>
                                                  <p className="text-xs font-medium text-gray-500">
                                                    Nationality
                                                  </p>
                                                  <p className="text-sm font-bold text-gray-900">
                                                    {
                                                      application.step3
                                                        .spouseNationality
                                                    }
                                                  </p>
                                                </div>
                                              )}
                                              {application.step3
                                                .spousePlaceOfBirth && (
                                                <div>
                                                  <p className="text-xs font-medium text-gray-500">
                                                    Place of Birth
                                                  </p>
                                                  <p className="text-sm font-bold text-gray-900">
                                                    {
                                                      application.step3
                                                        .spousePlaceOfBirth
                                                    }
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Professional Information */}
                              {(application.step3.presentOccupation ||
                                application.step3.employerName) && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-sm">
                                      <FileText className="h-3 w-3 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                      Professional Information
                                    </h3>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {application.step3.presentOccupation && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                              <FileText className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Occupation
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step3
                                                    .presentOccupation
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step3.employerName && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                              <Globe className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Employer
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {application.step3.employerName}
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step3.designation && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                              <CreditCard className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Designation
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {application.step3.designation}
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500">
                                No Step 3 data available
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Step 4 - Professional & Other Details */}
                    <TabsContent value="step4" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            Step 4 - Professional & Other Details
                          </CardTitle>
                          <CardDescription>
                            Visa details, travel plans, and background
                            information
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {application.step4 ? (
                            <div className="space-y-6">
                              {/* Travel Information */}
                              {(application.step4.placesToVisit ||
                                application.step4.portOfArrival) && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                                      <Plane className="h-3 w-3 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                      Travel Information
                                    </h3>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {application.step4.placesToVisit && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                              <MapPin className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Places to Visit
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step4
                                                    .placesToVisit
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step4.portOfArrival && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                              <Plane className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Port of Arrival
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step4
                                                    .portOfArrival
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step4.expectedPortOfExit && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                              <Plane className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Port of Exit
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step4
                                                    .expectedPortOfExit
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step4.durationOfVisa && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                              <Calendar className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Duration
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step4
                                                    .durationOfVisa
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Previous India Visits */}
                              {application.step4.visitedIndiaBefore ===
                                'yes' && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                                      <Globe className="h-3 w-3 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                      Previous India Visits
                                    </h3>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {application.step4
                                      .visitedIndiaBeforeLastIndianVisaNo && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                              <CreditCard className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Last Visa Number
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step4
                                                    .visitedIndiaBeforeLastIndianVisaNo
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                    {application.step4
                                      .visitedIndiaBeforeTypeOfVisa && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                              <FileText className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                Previous Visa Type
                                              </p>
                                              <p className="text-sm font-bold text-gray-900">
                                                {
                                                  application.step4
                                                    .visitedIndiaBeforeTypeOfVisa
                                                }
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Countries Visited */}
                              {application.step4.countryVisitedInLast10Years &&
                                application.step4.countryVisitedInLast10Years
                                  .length > 0 && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                      <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                                        <Globe className="h-3 w-3 text-white" />
                                      </div>
                                      <h3 className="text-lg font-bold text-gray-800">
                                        Countries Visited (Last 10 Years)
                                      </h3>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                      {application.step4.countryVisitedInLast10Years.map(
                                        (country: string, index: number) => (
                                          <Card
                                            key={index}
                                            className="border shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-indigo-50 to-purple-50"
                                          >
                                            <CardContent className="p-3">
                                              <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded bg-indigo-100 flex items-center justify-center">
                                                  <Globe className="h-3 w-3 text-indigo-600" />
                                                </div>
                                                <p className="text-xs font-bold text-gray-900 truncate">
                                                  {country}
                                                </p>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* References */}
                              {(application.step4.referenceNameInIndia ||
                                application.step4
                                  .referenceNameInHomeCountry) && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-sm">
                                      <User className="h-3 w-3 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                      References
                                    </h3>
                                  </div>
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Reference in India */}
                                    {application.step4.referenceNameInIndia && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-teal-50 to-cyan-50">
                                        <CardContent className="p-4">
                                          <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="h-6 w-6 rounded-lg bg-teal-100 flex items-center justify-center">
                                                <User className="h-3 w-3 text-teal-600" />
                                              </div>
                                              <h4 className="text-sm font-bold text-gray-800">
                                                Reference in India
                                              </h4>
                                            </div>
                                            <div className="space-y-2">
                                              <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                  Name
                                                </p>
                                                <p className="text-sm font-bold text-gray-900">
                                                  {
                                                    application.step4
                                                      .referenceNameInIndia
                                                  }
                                                </p>
                                              </div>
                                              {application.step4
                                                .referenceAddress && (
                                                <div>
                                                  <p className="text-xs font-medium text-gray-500">
                                                    Address
                                                  </p>
                                                  <p className="text-sm font-bold text-gray-900">
                                                    {
                                                      application.step4
                                                        .referenceAddress
                                                    }
                                                  </p>
                                                </div>
                                              )}
                                              {application.step4
                                                .referencePhone && (
                                                <div>
                                                  <p className="text-xs font-medium text-gray-500">
                                                    Phone
                                                  </p>
                                                  <p className="text-sm font-bold text-gray-900">
                                                    {
                                                      application.step4
                                                        .referencePhone
                                                    }
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                    {/* Reference in Home Country */}
                                    {application.step4
                                      .referenceNameInHomeCountry && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                                        <CardContent className="p-4">
                                          <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="h-6 w-6 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <User className="h-3 w-3 text-blue-600" />
                                              </div>
                                              <h4 className="text-sm font-bold text-gray-800">
                                                Reference in Home Country
                                              </h4>
                                            </div>
                                            <div className="space-y-2">
                                              <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                  Name
                                                </p>
                                                <p className="text-sm font-bold text-gray-900">
                                                  {
                                                    application.step4
                                                      .referenceNameInHomeCountry
                                                  }
                                                </p>
                                              </div>
                                              {application.step4
                                                .referenceAddressInHomeCountry && (
                                                <div>
                                                  <p className="text-xs font-medium text-gray-500">
                                                    Address
                                                  </p>
                                                  <p className="text-sm font-bold text-gray-900">
                                                    {
                                                      application.step4
                                                        .referenceAddressInHomeCountry
                                                    }
                                                  </p>
                                                </div>
                                              )}
                                              {application.step4
                                                .referencePhoneInHomeCountry && (
                                                <div>
                                                  <p className="text-xs font-medium text-gray-500">
                                                    Phone
                                                  </p>
                                                  <p className="text-sm font-bold text-gray-900">
                                                    {
                                                      application.step4
                                                        .referencePhoneInHomeCountry
                                                    }
                                                  </p>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500">
                                No Step 4 data available
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Step 5 - Background Information */}
                    <TabsContent value="step5" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Step 5 - Background Information</CardTitle>
                          <CardDescription>
                            Security questions and background checks
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {application.step5 ? (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-sm">
                                    <AlertCircle className="h-3 w-3 text-white" />
                                  </div>
                                  <h3 className="text-lg font-bold text-gray-800">
                                    Security Questions
                                  </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {application.step5.haveYouBeenArrested && (
                                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                      <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                          <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                                            <AlertCircle className="h-4 w-4 text-red-600" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Been Arrested
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                              {
                                                application.step5
                                                  .haveYouBeenArrested
                                              }
                                            </p>
                                            {application.step5
                                              .haveYouBeenArrestedInput && (
                                              <p className="text-xs text-gray-600 mt-1">
                                                {
                                                  application.step5
                                                    .haveYouBeenArrestedInput
                                                }
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {application.step5
                                    .haveYouBeenRefusedEntry && (
                                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                      <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                          <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                            <AlertCircle className="h-4 w-4 text-orange-600" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Refused Entry
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                              {
                                                application.step5
                                                  .haveYouBeenRefusedEntry
                                              }
                                            </p>
                                            {application.step5
                                              .haveYouBeenRefusedEntryInput && (
                                              <p className="text-xs text-gray-600 mt-1">
                                                {
                                                  application.step5
                                                    .haveYouBeenRefusedEntryInput
                                                }
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {application.step5
                                    .haveYouBeenEngagedInTrafficking && (
                                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                      <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                          <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                            <AlertCircle className="h-4 w-4 text-purple-600" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Engaged in Trafficking
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                              {
                                                application.step5
                                                  .haveYouBeenEngagedInTrafficking
                                              }
                                            </p>
                                            {application.step5
                                              .haveYouBeenEngagedInTraffickingInput && (
                                              <p className="text-xs text-gray-600 mt-1">
                                                {
                                                  application.step5
                                                    .haveYouBeenEngagedInTraffickingInput
                                                }
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {application.step5
                                    .haveYouBeenEngagedInCrime && (
                                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                      <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                          <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Engaged in Crime
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                              {
                                                application.step5
                                                  .haveYouBeenEngagedInCrime
                                              }
                                            </p>
                                            {application.step5
                                              .haveYouBeenEngagedInCrimeInput && (
                                              <p className="text-xs text-gray-600 mt-1">
                                                {
                                                  application.step5
                                                    .haveYouBeenEngagedInCrimeInput
                                                }
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {application.step5.haveYouExpressedViews && (
                                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                      <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                          <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                            <FileText className="h-4 w-4 text-indigo-600" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Expressed Views
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                              {
                                                application.step5
                                                  .haveYouExpressedViews
                                              }
                                            </p>
                                            {application.step5
                                              .haveYouExpressedViewsInput && (
                                              <p className="text-xs text-gray-600 mt-1">
                                                {
                                                  application.step5
                                                    .haveYouExpressedViewsInput
                                                }
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {application.step5.haveYouSoughtAsylum && (
                                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                      <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                          <div className="h-8 w-8 rounded-lg bg-teal-100 flex items-center justify-center">
                                            <Globe className="h-4 w-4 text-teal-600" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Sought Asylum
                                            </p>
                                            <p className="text-sm font-bold text-gray-900">
                                              {
                                                application.step5
                                                  .haveYouSoughtAsylum
                                              }
                                            </p>
                                            {application.step5
                                              .haveYouSoughtAsylumInput && (
                                              <p className="text-xs text-gray-600 mt-1">
                                                {
                                                  application.step5
                                                    .haveYouSoughtAsylumInput
                                                }
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </div>
                              </div>

                              {/* Declaration */}
                              {application.step5.declaration !== undefined && (
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                                      <FileText className="h-3 w-3 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                      Declaration
                                    </h3>
                                  </div>
                                  <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-green-50 to-emerald-50">
                                    <CardContent className="p-6">
                                      <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                          <FileText className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                          <h4 className="text-lg font-bold text-gray-800">
                                            Declaration Status
                                          </h4>
                                          <p className="text-sm text-gray-600">
                                            {application.step5.declaration
                                              ? 'Declared and Agreed'
                                              : 'Not Declared'}
                                          </p>
                                        </div>
                                        <div className="ml-auto">
                                          <Badge
                                            variant={
                                              application.step5.declaration
                                                ? 'outline'
                                                : 'destructive'
                                            }
                                          >
                                            {application.step5.declaration
                                              ? 'Agreed'
                                              : 'Not Agreed'}
                                          </Badge>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500">
                                No Step 5 data available
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Step 6 - Documents */}
                    <TabsContent value="step6" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Step 6 - Documents & Payment</CardTitle>
                          <CardDescription>
                            Uploaded documents and payment information
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {/* Documents Section */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                                  <FileText className="h-3 w-3 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">
                                  Documents
                                </h3>
                              </div>

                              {application.step6 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Profile Picture */}
                                  {application.step6.profilePicture && (
                                    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                      <CardContent className="p-4">
                                        <div className="space-y-3">
                                          <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-lg bg-blue-100 flex items-center justify-center">
                                              <User className="h-3 w-3 text-blue-600" />
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-800">
                                              Profile Picture
                                            </h4>
                                          </div>
                                          <div className="overflow-hidden rounded-lg w-32 h-32 mx-auto">
                                            <CldImage
                                              src={
                                                application.step6.profilePicture
                                              }
                                              alt="Profile"
                                              width={128}
                                              height={128}
                                              className="object-cover"
                                              crop="fill"
                                            />
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Passport Documents */}
                                  {application.step6.passport &&
                                    application.step6.passport.length > 0 && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="h-6 w-6 rounded-lg bg-green-100 flex items-center justify-center">
                                                <CreditCard className="h-3 w-3 text-green-600" />
                                              </div>
                                              <h4 className="text-sm font-bold text-gray-800">
                                                Passport Documents
                                              </h4>
                                            </div>
                                            <div className="space-y-2">
                                              {application.step6.passport.map(
                                                (
                                                  doc: string,
                                                  index: number
                                                ) => (
                                                  <div
                                                    key={index}
                                                    className="flex items-center gap-2"
                                                  >
                                                    <Button
                                                      variant="outline"
                                                      size="sm"
                                                      asChild
                                                    >
                                                      <a
                                                        href={getCloudinaryUrl(
                                                          doc
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                      >
                                                        <FileText className="h-3 w-3 mr-2" />
                                                        Passport Document{' '}
                                                        {index + 1}
                                                      </a>
                                                    </Button>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                  {/* Business Card */}
                                  {application.step6.businessCard &&
                                    application.step6.businessCard.length >
                                      0 && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="h-6 w-6 rounded-lg bg-purple-100 flex items-center justify-center">
                                                <CreditCard className="h-3 w-3 text-purple-600" />
                                              </div>
                                              <h4 className="text-sm font-bold text-gray-800">
                                                Business Card
                                              </h4>
                                            </div>
                                            <div className="space-y-2">
                                              {application.step6.businessCard.map(
                                                (
                                                  doc: string,
                                                  index: number
                                                ) => (
                                                  <div
                                                    key={index}
                                                    className="flex items-center gap-2"
                                                  >
                                                    <Button
                                                      variant="outline"
                                                      size="sm"
                                                      asChild
                                                    >
                                                      <a
                                                        href={getCloudinaryUrl(
                                                          doc
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                      >
                                                        <FileText className="h-3 w-3 mr-2" />
                                                        Business Card{' '}
                                                        {index + 1}
                                                      </a>
                                                    </Button>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}

                                  {/* Medical Card */}
                                  {application.step6.eMedicalCard &&
                                    application.step6.eMedicalCard.length >
                                      0 && (
                                      <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                        <CardContent className="p-4">
                                          <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                              <div className="h-6 w-6 rounded-lg bg-red-100 flex items-center justify-center">
                                                <FileText className="h-3 w-3 text-red-600" />
                                              </div>
                                              <h4 className="text-sm font-bold text-gray-800">
                                                Medical Card
                                              </h4>
                                            </div>
                                            <div className="space-y-2">
                                              {application.step6.eMedicalCard.map(
                                                (
                                                  doc: string,
                                                  index: number
                                                ) => (
                                                  <div
                                                    key={index}
                                                    className="flex items-center gap-2"
                                                  >
                                                    <Button
                                                      variant="outline"
                                                      size="sm"
                                                      asChild
                                                    >
                                                      <a
                                                        href={getCloudinaryUrl(
                                                          doc
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                      >
                                                        <FileText className="h-3 w-3 mr-2" />
                                                        Medical Card {index + 1}
                                                      </a>
                                                    </Button>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <p className="text-gray-500">
                                    No documents uploaded
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Payment Information */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                                  <DollarSign className="h-3 w-3 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">
                                  Payment Information
                                </h3>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                        <DollarSign className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                          Payment Status
                                        </p>
                                        <Badge
                                          variant={
                                            application.paymentStatus === 'paid'
                                              ? 'outline'
                                              : application.paymentStatus ===
                                                'failed'
                                              ? 'destructive'
                                              : 'default'
                                          }
                                        >
                                          {application.paymentStatus}
                                        </Badge>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <DollarSign className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                          Amount
                                        </p>
                                        <p className="text-sm font-bold text-gray-900">
                                          ${application.price}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* {application.paymentDate && (
                                  <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                    <CardContent className="p-4">
                                      <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                          <Calendar className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Payment Date
                                          </p>
                                          <p className="text-sm font-bold text-gray-900">
                                            {formatDate(application.paymentDate)}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )} */}
                              </div>

                              {application.paymentStatus !== 'paid' && (
                                <Alert className="mt-4">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertTitle>Payment Required</AlertTitle>
                                  <AlertDescription>
                                    This application requires payment to
                                    proceed. Consider sending a payment reminder
                                    to the applicant.
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Step 8 - Terms & Payment */}
                    <TabsContent value="step8" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Terms & Payment Information</CardTitle>
                          <CardDescription>
                            Terms and conditions agreement and payment details
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {/* Terms & Conditions Section */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                                  <FileText className="h-3 w-3 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">
                                  Terms & Conditions
                                </h3>
                              </div>

                              <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                                <CardContent className="p-6">
                                  <div className="space-y-4">
                                    {application.termsAndConditionsContent && (
                                      <div>
                                        <h4 className="text-sm font-bold text-gray-800 mb-2">
                                          Terms & Conditions Content
                                        </h4>
                                        <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto">
                                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {
                                              application.termsAndConditionsContent
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <div
                                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                            application.termsAndConditions
                                              ? 'bg-green-100'
                                              : 'bg-red-100'
                                          }`}
                                        >
                                          <FileText
                                            className={`h-5 w-5 ${
                                              application.termsAndConditions
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}
                                          />
                                        </div>
                                        <div>
                                          <h4 className="text-lg font-bold text-gray-800">
                                            Agreement Status
                                          </h4>
                                          <p className="text-sm text-gray-600">
                                            {application.termsAndConditions
                                              ? 'Applicant has agreed to the terms and conditions'
                                              : 'Applicant has not agreed to the terms and conditions'}
                                          </p>
                                        </div>
                                      </div>
                                      <Badge
                                        variant={
                                          application.termsAndConditions
                                            ? 'outline'
                                            : 'destructive'
                                        }
                                        className="text-lg px-4 py-2"
                                      >
                                        {application.termsAndConditions
                                          ? 'Agreed'
                                          : 'Not Agreed'}
                                      </Badge>
                                    </div>

                                    {!application.termsAndConditions && (
                                      <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>
                                          Terms Not Accepted
                                        </AlertTitle>
                                        <AlertDescription>
                                          The applicant has not yet agreed to
                                          the terms and conditions. This may
                                          prevent the application from
                                          proceeding.
                                        </AlertDescription>
                                      </Alert>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Payment Information Section */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                                  <DollarSign className="h-3 w-3 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">
                                  Payment Information
                                </h3>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Payment Status */}
                                <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                        <DollarSign className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                          Payment Status
                                        </p>
                                        <Badge
                                          variant={
                                            application.paymentStatus ===
                                              'paid' || application.paid
                                              ? 'outline'
                                              : application.paymentStatus ===
                                                'failed'
                                              ? 'destructive'
                                              : 'default'
                                          }
                                          className="mt-1"
                                        >
                                          {application.paymentStatus ||
                                            (application.paid
                                              ? 'paid'
                                              : 'pending')}
                                        </Badge>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Payment Amount */}
                                <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <DollarSign className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                          Amount
                                        </p>
                                        <p className="text-sm font-bold text-gray-900">
                                          $
                                          {application.paymentAmount ||
                                            application.price ||
                                            'N/A'}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Payment Method */}
                                {application.paymentMethod && (
                                  <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                    <CardContent className="p-4">
                                      <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                          <CreditCard className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Payment Method
                                          </p>
                                          <p className="text-sm font-bold text-gray-900 capitalize">
                                            {application.paymentMethod}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Payment Date */}
                                {application.paymentDate && (
                                  <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                    <CardContent className="p-4">
                                      <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                          <Calendar className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Payment Date
                                          </p>
                                          <p className="text-sm font-bold text-gray-900">
                                            {formatDate(
                                              application.paymentDate
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Payment ID */}
                                {application.paymentId && (
                                  <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                                    <CardContent className="p-4">
                                      <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                          <FileText className="h-4 w-4 text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                            Payment ID
                                          </p>
                                          <p
                                            className="text-xs font-bold text-gray-900 truncate"
                                            title={application.paymentId}
                                          >
                                            {application.paymentId}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                              </div>

                              {/* Payment Status Alert */}
                              {!application.paid &&
                                application.paymentStatus !== 'paid' && (
                                  <Alert className="mt-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Payment Required</AlertTitle>
                                    <AlertDescription>
                                      This application requires payment to
                                      proceed. Consider sending a payment
                                      reminder to the applicant.
                                    </AlertDescription>
                                  </Alert>
                                )}

                              {(application.paid ||
                                application.paymentStatus === 'paid') && (
                                <Alert className="mt-4 border-green-200 bg-green-50">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                  <AlertTitle className="text-green-800">
                                    Payment Completed
                                  </AlertTitle>
                                  <AlertDescription className="text-green-700">
                                    Payment has been successfully processed for
                                    this application.
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
