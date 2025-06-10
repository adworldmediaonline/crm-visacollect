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
  FileText,
  Globe,
  CreditCard,
  Calendar,
  Phone,
  MapPin,
  Plane,
  DollarSign,
  User,
  Home,
  Shield,
  FileUp,
  ClipboardCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GovRefDetailsForm } from '@/components/india-visa/GovRefDetailsForm';
import { CldImage } from 'next-cloudinary';

// Helper function to safely format dates
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not provided';
  try {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

// Helper function to format visa service information
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
  const visaService = application.visaService || 'Not specified';

  const subTypes = [
    application.eTouristVisa30Days,
    application.eTouristVisa1Year,
    application.eTouristVisa5Years,
    application.eBusinessVisa,
    application.eMedicalVisa,
    application.eConferenceVisa,
    application.eMedicalAttendantVisa,
    application.eEmergencyXMisc,
  ].filter(Boolean);

  return {
    main: visaService,
    subType: subTypes.length > 0 ? subTypes[0] : null,
  };
};

// Helper function to get Cloudinary URL
const getCloudinaryUrl = (publicId: string): string => {
  if (!publicId) return '';
  if (publicId.startsWith('http')) return publicId;
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
};

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

  const handleSendReminder = async (
    type: 'incomplete' | 'documents' | 'payment'
  ) => {
    try {
      if (type === 'incomplete') {
        await indianVisaApi.sendIncompleteReminder(applicationId);
      } else if (type === 'documents') {
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
    'incomplete',
    'submitted',
    'pending document',
    'on hold',
    'pending',
    'form filled',
    'processed',
    'future processing',
    'visa granted',
    'visa email sent',
    'escalated',
    'visa declined',
    'refund pending',
    'refund completed',
    'payment disputed',
    'miscellaneous',
    'not interested',
    'chargeback',
  ];

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      await indianVisaApi.updateApplicationStatus(applicationId, newStatus);
      setStatus(newStatus);
      toast.success('Application status updated successfully');
    } catch (error) {
      toast.error('Failed to update application status');
      console.error('Error updating status:', error);
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
            {/* Profile Card with Step 1 Information */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white mt-0 p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl lg:text-2xl font-bold">
                      Application #{application._id}
                    </CardTitle>
                    <CardDescription className="text-blue-100 text-sm lg:text-base">
                      Created on {formatDate(application.createdAt)}
                    </CardDescription>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs lg:text-sm"
                      onClick={() => handleSendReminder('documents')}
                    >
                      <Mail className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                      Documents
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs lg:text-sm"
                      onClick={() => handleSendReminder('payment')}
                    >
                      <Mail className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                      Payment
                    </Button>
                  </div>

                  <div className="flex items-center">
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm rounded-full px-3 py-1 text-xs lg:text-sm font-medium shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      {application.visaStatus || 'Pending'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
                  {/* Application Details Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-blue-500 p-1 rounded-full">
                        <FileText className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                      </div>
                      <h3 className="text-xs font-semibold text-blue-800">
                        Application Details
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white/70 rounded p-2">
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="text-xs lg:text-sm font-medium break-words">
                          {application.applicationType || 'Not specified'}
                        </p>
                      </div>
                      <div className="bg-white/70 rounded p-2">
                        <p className="text-xs text-muted-foreground">Country</p>
                        <p className="text-xs lg:text-sm font-medium break-words">
                          {application.nationalityRegion || 'Not specified'}
                        </p>
                      </div>
                      <div className="bg-white/70 rounded p-2">
                        <p className="text-xs text-muted-foreground">
                          Passport
                        </p>
                        <p className="text-xs lg:text-sm font-medium break-words">
                          {application.passportType || 'Not specified'}
                        </p>
                      </div>
                      <div className="bg-white/70 rounded p-2">
                        <p className="text-xs text-muted-foreground">DOB</p>
                        <p className="text-xs lg:text-sm font-medium break-words">
                          {formatDate(application.dateOfBirth)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Travel Section */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-500 p-1 rounded-full">
                        <Phone className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                      </div>
                      <h3 className="text-xs font-semibold text-green-800">
                        Contact & Travel
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white/70 rounded p-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs lg:text-sm font-medium break-words truncate">
                              {application.emailId || 'Not provided'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs lg:text-sm font-medium break-words truncate">
                              {application.contactNo || 'Not provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/70 rounded p-2">
                        <p className="text-xs text-muted-foreground">
                          Port of Arrival
                        </p>
                        <p className="text-xs lg:text-sm font-medium break-words">
                          {application.portOfArrival || 'Not specified'}
                        </p>
                      </div>
                      <div className="bg-white/70 rounded p-2">
                        <p className="text-xs text-muted-foreground">
                          Expected Arrival
                        </p>
                        <p className="text-xs lg:text-sm font-medium break-words">
                          {formatDate(application.expectedDateOfArrival)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Visa Service Section */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-purple-500 p-1 rounded-full">
                        <Plane className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                      </div>
                      <h3 className="text-xs font-semibold text-purple-800">
                        Visa Service
                      </h3>
                    </div>
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-3">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-purple-100">
                            Service Type
                          </p>
                          <p className="text-xs lg:text-sm font-semibold">
                            {formatVisaService(application).main}
                          </p>
                        </div>
                        {formatVisaService(application).subType && (
                          <div>
                            <p className="text-xs text-purple-100">Sub Type</p>
                            <p className="text-xs font-medium break-words">
                              {formatVisaService(application).subType}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          <DollarSign className="h-3 w-3 lg:h-4 lg:w-4" />
                          <span className="text-xs lg:text-sm font-bold">
                            ${application.price || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="status-select"
                      className="text-sm font-medium"
                    >
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
                        {statusOptions.map(option => (
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

            {/* Summary Overview Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary Overview</CardTitle>
                <CardDescription>
                  Quick overview of application progress and actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  {[
                    {
                      step: 'Step 2',
                      label: 'Personal',
                      data: application.step2,
                      icon: User,
                    },
                    {
                      step: 'Step 3',
                      label: 'Address',
                      data: application.step3,
                      icon: Home,
                    },
                    {
                      step: 'Step 4',
                      label: 'Travel',
                      data: application.step4,
                      icon: Plane,
                    },
                    {
                      step: 'Step 5',
                      label: 'Security',
                      data: application.step5,
                      icon: Shield,
                    },
                    {
                      step: 'Step 6',
                      label: 'Documents',
                      data: application.step6,
                      icon: FileUp,
                    },
                    {
                      step: 'Payment',
                      label: 'Payment',
                      data: application.paymentStatus === 'paid',
                      icon: CreditCard,
                    },
                  ].map(({ step, label, data, icon: Icon }) => (
                    <div
                      key={step}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        data
                          ? 'border-green-200 bg-green-50'
                          : 'border-orange-200 bg-orange-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          className={`h-4 w-4 ${
                            data ? 'text-green-600' : 'text-orange-600'
                          }`}
                        />
                        <span className="text-xs font-medium">{label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {data ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <Clock className="h-3 w-3 text-orange-600" />
                        )}
                        <span
                          className={`text-xs ${
                            data ? 'text-green-600' : 'text-orange-600'
                          }`}
                        >
                          {data ? 'Completed' : 'Incomplete'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendReminder('documents')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Document Reminder
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendReminder('payment')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Payment Reminder
                  </Button>
                  <div className="flex items-center gap-2 ml-auto">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      ID: {application._id}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <GovRefDetailsForm
              applicationId={applicationId}
              visaApplication={application}
            />

            {/* Enhanced Detailed Information Tabs */}
            <Tabs defaultValue="step2" className="mt-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="step2" className="text-xs sm:text-sm">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Personal Details</span>
                  <span className="sm:hidden">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="step3" className="text-xs sm:text-sm">
                  <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Address & Family</span>
                  <span className="sm:hidden">Address</span>
                </TabsTrigger>
                <TabsTrigger value="step4" className="text-xs sm:text-sm">
                  <Plane className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Travel & Background</span>
                  <span className="sm:hidden">Travel</span>
                </TabsTrigger>
                <TabsTrigger value="step5" className="text-xs sm:text-sm">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Security Questions</span>
                  <span className="sm:hidden">Security</span>
                </TabsTrigger>
                <TabsTrigger value="step6" className="text-xs sm:text-sm">
                  <FileUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Documents</span>
                  <span className="sm:hidden">Docs</span>
                </TabsTrigger>
                <TabsTrigger value="step8" className="text-xs sm:text-sm">
                  <ClipboardCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Terms & Payment</span>
                  <span className="sm:hidden">Terms</span>
                </TabsTrigger>
              </TabsList>
              {/* Step 2: Personal Details */}
              <TabsContent value="step2" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Details - Step 2
                    </CardTitle>
                    <CardDescription>
                      Applicant&apos;s personal and passport information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {application.step2 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Personal Information */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                          <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Personal Information
                          </h3>
                          <div className="space-y-3">
                            {[
                              {
                                label: 'First Name',
                                value: application.step2?.firstName,
                              },
                              {
                                label: 'Last Name',
                                value: application.step2?.lastName,
                              },
                              {
                                label: 'Gender',
                                value: application.step2?.gender,
                              },
                              {
                                label: 'Date of Birth',
                                value: formatDate(
                                  application.step2?.dateOfBirth
                                ),
                              },
                              {
                                label: 'Place of Birth (City)',
                                value: application.step2?.townCityOfBirth,
                              },
                              {
                                label: 'Place of Birth (Country)',
                                value: application.step2?.countryRegionOfBirth,
                              },
                              {
                                label: 'Religion',
                                value: application.step2?.religion,
                              },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="bg-white/70 rounded p-3"
                              >
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                <p className="text-sm font-medium break-words">
                                  {value || 'Not provided'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Passport Information */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                          <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Passport Information
                          </h3>
                          <div className="space-y-3">
                            {[
                              {
                                label: 'Passport Number',
                                value: application.step2?.passportNumber,
                              },
                              {
                                label: 'Date of Issue',
                                value: formatDate(
                                  application.step2?.dateOfIssue
                                ),
                              },
                              {
                                label: 'Date of Expiry',
                                value: formatDate(
                                  application.step2?.dateOfExpiry
                                ),
                              },
                              {
                                label: 'Place of Issue',
                                value: application.step2?.placeOfIssue,
                              },
                              {
                                label: 'Country of Issue',
                                value: application.step2?.countryOfIssue,
                              },
                              {
                                label: 'Any Other Valid Passport',
                                value: application.step2?.anyOtherValidPassport,
                              },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="bg-white/70 rounded p-3"
                              >
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                <p className="text-sm font-medium break-words">
                                  {value || 'Not provided'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Additional Details */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                          <h3 className="text-lg font-semibold mb-3 text-purple-800 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Additional Details
                          </h3>
                          <div className="space-y-3">
                            {[
                              {
                                label: 'Educational Qualification',
                                value:
                                  application.step2?.educationalQualification,
                              },
                              {
                                label: 'Visible Identification Marks',
                                value: application.step2?.visibleIdentification,
                              },
                              {
                                label: 'Nationality by Birth',
                                value: application.step2?.nationalityByBirth,
                              },
                              {
                                label: 'Any Other Nationality',
                                value: application.step2?.anyOtherNationality,
                              },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="bg-white/70 rounded p-3"
                              >
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                <p className="text-sm font-medium break-words">
                                  {value || 'Not provided'}
                                </p>
                              </div>
                            ))}
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

              {/* Step 3: Address & Family Details */}
              <TabsContent value="step3" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Address & Family Details - Step 3
                    </CardTitle>
                    <CardDescription>
                      Applicant&apos;s address and family information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {application.step3 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Present Address */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                          <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Present Address
                          </h3>
                          <div className="space-y-3">
                            {[
                              {
                                label: 'House No./Street',
                                value: application.step3?.houseNoStreet,
                              },
                              {
                                label: 'Village/Town/City',
                                value: application.step3?.villageTownCity,
                              },
                              {
                                label: 'State/Province/District',
                                value: application.step3?.stateProvinceDistrict,
                              },
                              {
                                label: 'Country',
                                value: application.step3?.country,
                              },
                              {
                                label: 'Postal/ZIP Code',
                                value: application.step3?.postalZipCode,
                              },
                              {
                                label: 'Phone Number',
                                value: application.step3?.phoneNumber,
                              },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="bg-white/70 rounded p-3"
                              >
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                <p className="text-sm font-medium break-words">
                                  {value || 'Not provided'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Family Information */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                          <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Family Information
                          </h3>
                          <div className="space-y-3">
                            {[
                              {
                                label: "Father's Full Name",
                                value: application.step3?.fatherFullName,
                              },
                              {
                                label: "Father's Nationality",
                                value: application.step3?.fatherNationality,
                              },
                              {
                                label: "Father's Previous Nationality",
                                value:
                                  application.step3?.fatherPreviousNationality,
                              },
                              {
                                label: "Father's Place of Birth",
                                value: application.step3?.fatherPlaceOfBirth,
                              },
                              {
                                label: "Father's Country of Birth",
                                value: application.step3?.fatherCountryOfBirth,
                              },
                              {
                                label: "Mother's Full Name",
                                value: application.step3?.motherFullName,
                              },
                              {
                                label: "Mother's Nationality",
                                value: application.step3?.motherNationality,
                              },
                              {
                                label: "Mother's Previous Nationality",
                                value:
                                  application.step3?.motherPreviousNationality,
                              },
                              {
                                label: "Mother's Place of Birth",
                                value: application.step3?.motherPlaceOfBirth,
                              },
                              {
                                label: "Mother's Country of Birth",
                                value: application.step3?.motherCountryOfBirth,
                              },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="bg-white/70 rounded p-3"
                              >
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                <p className="text-sm font-medium break-words">
                                  {value || 'Not provided'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Marital Status & Spouse Details */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                          <h3 className="text-lg font-semibold mb-3 text-purple-800 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Marital & Spouse Details
                          </h3>
                          <div className="space-y-3">
                            {[
                              {
                                label: 'Marital Status',
                                value:
                                  application.step3?.applicantMaritalStatus,
                              },
                              {
                                label: 'Spouse Name',
                                value: application.step3?.spouseName,
                              },
                              {
                                label: 'Spouse Nationality',
                                value: application.step3?.spouseNationality,
                              },
                              {
                                label: 'Spouse Previous Nationality',
                                value:
                                  application.step3?.spousePreviousNationality,
                              },
                              {
                                label: 'Spouse Place of Birth',
                                value: application.step3?.spousePlaceOfBirth,
                              },
                              {
                                label: 'Spouse Country of Birth',
                                value: application.step3?.spouseCountryOfBirth,
                              },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="bg-white/70 rounded p-3"
                              >
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                <p className="text-sm font-medium break-words">
                                  {value || 'Not provided'}
                                </p>
                              </div>
                            ))}
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

              {/* Step 4: Travel & Background Details */}
              <TabsContent value="step4" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plane className="h-5 w-5" />
                      Travel & Background Details - Step 4
                    </CardTitle>
                    <CardDescription>
                      Professional, travel, and background information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {application.step4 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Professional Details */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                          <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Professional Details
                          </h3>
                          <div className="space-y-3">
                            {[
                              {
                                label: 'Present Occupation',
                                value: application.step4?.presentOccupation,
                              },
                              {
                                label: 'Employer Name/Business',
                                value: application.step4?.employerNameBusiness,
                              },
                              {
                                label: 'Employer Address',
                                value: application.step4?.employerAddress,
                              },
                              {
                                label: 'Employer Phone',
                                value: application.step4?.employerPhone,
                              },
                              {
                                label: 'Previous Occupation',
                                value: application.step4?.previousOccupation,
                              },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="bg-white/70 rounded p-3"
                              >
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                <p className="text-sm font-medium break-words">
                                  {value || 'Not provided'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Visit Details */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                          <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center gap-2">
                            <Plane className="h-4 w-4" />
                            Visit Details
                          </h3>
                          <div className="space-y-3">
                            {[
                              {
                                label: 'Purpose of Visit',
                                value: application.step4?.purposeOfVisit,
                              },
                              {
                                label: 'Intended Length of Stay',
                                value: application.step4?.lengthOfStay,
                              },
                              {
                                label: 'Places to Visit',
                                value: application.step4?.placesToVisit,
                              },
                              {
                                label: 'Duration of Stay',
                                value: application.step4?.durationOfStay,
                              },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="bg-white/70 rounded p-3"
                              >
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                <p className="text-sm font-medium break-words">
                                  {value || 'Not provided'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Travel History */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                          <h3 className="text-lg font-semibold mb-3 text-purple-800 flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Travel History
                          </h3>
                          <div className="space-y-3">
                            {[
                              {
                                label: 'Countries Visited (Last 10 Years)',
                                value: application.step4?.countriesVisited,
                              },
                              {
                                label: 'SAARC Countries Visited',
                                value: application.step4?.saarcCountriesVisited,
                              },
                              {
                                label: 'Previous India Visits',
                                value: application.step4?.previousIndiaVisits,
                              },
                              {
                                label: 'Previous India Visa Details',
                                value: application.step4?.previousVisaDetails,
                              },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="bg-white/70 rounded p-3"
                              >
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                <p className="text-sm font-medium break-words">
                                  {value || 'Not provided'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Missing Information</AlertTitle>
                        <AlertDescription>
                          No travel and background details available for this
                          application.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 5: Security Questions */}
              <TabsContent value="step5" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Questions - Step 5
                    </CardTitle>
                    <CardDescription>
                      Background and security related information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {application.step5 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Security Questions */}
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                          <h3 className="text-lg font-semibold mb-3 text-red-800 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Security Questions
                          </h3>
                          <div className="space-y-3">
                            {[
                              {
                                label:
                                  'Armed Forces/Police/Security Forces Background',
                                value: application.step5?.armedForcesBackground,
                              },
                              {
                                label: 'Prosecution/Conviction History',
                                value: application.step5?.prosecutionHistory,
                              },
                              {
                                label: 'Deportation/Repatriation History',
                                value: application.step5?.deportationHistory,
                              },
                              {
                                label: 'Visa Rejection History',
                                value: application.step5?.visaRejectionHistory,
                              },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="bg-white/70 rounded p-3"
                              >
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                <p className="text-sm font-medium break-words">
                                  {typeof value === 'boolean'
                                    ? value
                                      ? 'Yes'
                                      : 'No'
                                    : value || 'Not provided'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Additional Security Information */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                          <h3 className="text-lg font-semibold mb-3 text-orange-800 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Additional Information
                          </h3>
                          <div className="space-y-3">
                            {[
                              {
                                label: 'Criminal Record',
                                value: application.step5?.criminalRecord,
                              },
                              {
                                label: 'Substance Abuse History',
                                value: application.step5?.substanceAbuseHistory,
                              },
                              {
                                label:
                                  'Associations with Terrorist Organizations',
                                value: application.step5?.terroristAssociations,
                              },
                              {
                                label: 'Other Security Concerns',
                                value: application.step5?.otherSecurityConcerns,
                              },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="bg-white/70 rounded p-3"
                              >
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                <p className="text-sm font-medium break-words">
                                  {typeof value === 'boolean'
                                    ? value
                                      ? 'Yes'
                                      : 'No'
                                    : value || 'Not provided'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Missing Information</AlertTitle>
                        <AlertDescription>
                          No security information available for this
                          application.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 6: Documents */}
              <TabsContent value="step6" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileUp className="h-5 w-5" />
                      Documents - Step 6
                    </CardTitle>
                    <CardDescription>
                      Uploaded application documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {application.step6 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Profile Picture */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                          <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Profile Picture
                          </h3>
                          {application.step6.profilePicture ? (
                            <div className="bg-white/70 rounded p-3">
                              <div className="overflow-hidden rounded-md w-32 h-32 mx-auto">
                                <CldImage
                                  src={application.step6.profilePicture}
                                  alt="Profile"
                                  width={128}
                                  height={128}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="bg-white/70 rounded p-3">
                              <p className="text-sm text-muted-foreground text-center">
                                No profile picture uploaded
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Passport Documents */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                          <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Passport Documents
                          </h3>
                          {application.step6.passport &&
                          application.step6.passport.length > 0 ? (
                            <div className="space-y-3">
                              {application.step6.passport.map(
                                (doc: string, index: number) => (
                                  <div
                                    key={index}
                                    className="bg-white/70 rounded p-3"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">
                                        Document {index + 1}
                                      </span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                      >
                                        <a
                                          href={getCloudinaryUrl(doc)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          View
                                        </a>
                                      </Button>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="bg-white/70 rounded p-3">
                              <p className="text-sm text-muted-foreground">
                                No passport documents uploaded
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Additional Documents */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                          <h3 className="text-lg font-semibold mb-3 text-purple-800 flex items-center gap-2">
                            <FileUp className="h-4 w-4" />
                            Additional Documents
                          </h3>
                          <div className="space-y-3">
                            {[
                              {
                                label: 'Supporting Documents',
                                value: application.step6?.supportingDocuments,
                              },
                              {
                                label: 'Medical Records',
                                value: application.step6?.medicalRecords,
                              },
                              {
                                label: 'Financial Documents',
                                value: application.step6?.financialDocuments,
                              },
                              {
                                label: 'Other Documents',
                                value: application.step6?.otherDocuments,
                              },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="bg-white/70 rounded p-3"
                              >
                                <p className="text-xs text-muted-foreground">
                                  {label}
                                </p>
                                {value &&
                                Array.isArray(value) &&
                                value.length > 0 ? (
                                  <div className="mt-2 space-y-1">
                                    {value.map((doc: string, index: number) => (
                                      <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        asChild
                                      >
                                        <a
                                          href={getCloudinaryUrl(doc)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          View Document {index + 1}
                                        </a>
                                      </Button>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground">
                                    No documents uploaded
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
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

              {/* Step 8: Terms & Payment */}
              <TabsContent value="step8" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5" />
                      Terms & Payment - Step 8
                    </CardTitle>
                    <CardDescription>
                      Terms and conditions acceptance and payment information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Terms and Conditions */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                        <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center gap-2">
                          <ClipboardCheck className="h-4 w-4" />
                          Terms & Conditions
                        </h3>
                        <div className="space-y-3">
                          <div className="bg-white/70 rounded p-3">
                            <p className="text-xs text-muted-foreground">
                              Terms Accepted
                            </p>
                            <p className="text-sm font-medium break-words">
                              {application.termsAndConditions ? 'Yes' : 'No'}
                            </p>
                          </div>
                          <div className="bg-white/70 rounded p-3">
                            <p className="text-xs text-muted-foreground">
                              Agreement Date
                            </p>
                            <p className="text-sm font-medium break-words">
                              {formatDate(application.termsAcceptedDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                        <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Payment Information
                        </h3>
                        <div className="space-y-3">
                          <div className="bg-white/70 rounded p-3">
                            <p className="text-xs text-muted-foreground">
                              Payment Status
                            </p>
                            <Badge
                              variant={
                                application.paymentStatus === 'paid'
                                  ? 'outline'
                                  : application.paymentStatus === 'failed'
                                  ? 'destructive'
                                  : 'default'
                              }
                              className="mt-1"
                            >
                              {application.paymentStatus || 'Pending'}
                            </Badge>
                          </div>
                          <div className="bg-white/70 rounded p-3">
                            <p className="text-xs text-muted-foreground">
                              Payment Amount
                            </p>
                            <p className="text-sm font-medium break-words">
                              ${application.price || 'N/A'}
                            </p>
                          </div>
                          {application.paymentMethod && (
                            <div className="bg-white/70 rounded p-3">
                              <p className="text-xs text-muted-foreground">
                                Payment Method
                              </p>
                              <p className="text-sm font-medium break-words">
                                {application.paymentMethod}
                              </p>
                            </div>
                          )}
                          {application.paymentId && (
                            <div className="bg-white/70 rounded p-3">
                              <p className="text-xs text-muted-foreground">
                                Payment ID
                              </p>
                              <p className="text-sm font-medium break-words">
                                {application.paymentId}
                              </p>
                            </div>
                          )}
                          {application.paymentDate && (
                            <div className="bg-white/70 rounded p-3">
                              <p className="text-xs text-muted-foreground">
                                Payment Date
                              </p>
                              <p className="text-sm font-medium break-words">
                                {formatDate(application.paymentDate)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {application.paymentStatus !== 'paid' && (
                      <Alert className="mt-6">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Payment Required</AlertTitle>
                        <AlertDescription>
                          This application requires payment to proceed. Consider
                          sending a payment reminder to the applicant.
                        </AlertDescription>
                      </Alert>
                    )}
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
