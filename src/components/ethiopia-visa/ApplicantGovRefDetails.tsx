import { useState } from 'react';
import { VisaApplication } from '@/types/ethiopia-visa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, User } from 'lucide-react';
import { GovRefDetailsForm } from '@/components/ethiopia-visa/GovRefDetailsForm';

interface ApplicantGovRefDetailsProps {
  visaApplication: VisaApplication;
  onSuccess?: () => void;
}

export function ApplicantGovRefDetails({
  visaApplication,
  onSuccess,
}: ApplicantGovRefDetailsProps) {
  const { personalInfo, additionalApplicants } = visaApplication;
  const [activeTab, setActiveTab] = useState('primary');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList
        className={`grid grid-cols-${Math.min(
          6,
          additionalApplicants.length + 1
        )} mb-4`}
      >
        <TabsTrigger value="primary" className="flex items-center gap-2">
          <UserCircle className="h-6 w-6" />
          Primary
        </TabsTrigger>

        {additionalApplicants.map((applicant, index) => (
          <TabsTrigger
            key={applicant._id}
            value={`additional-${index}`}
            className="flex items-center gap-2"
          >
            <User className="h-6 w-6" />
            Additional {index + 1}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="primary">
        <h3 className="text-lg font-semibold mb-4">
          Primary Applicant: {personalInfo.givenName} {personalInfo.surname}
        </h3>
        <GovRefDetailsForm
          applicationId={visaApplication._id}
          applicantType="primary"
          onSuccess={onSuccess}
          visaApplication={visaApplication}
        />
      </TabsContent>

      {additionalApplicants.map((applicant, index) => (
        <TabsContent key={applicant._id} value={`additional-${index}`}>
          <h3 className="text-lg font-semibold mb-4">
            Additional Applicant {index + 1}: {applicant.personalInfo.givenName}{' '}
            {applicant.personalInfo.surname}
          </h3>
          <GovRefDetailsForm
            applicationId={visaApplication._id}
            applicantType="additional"
            additionalApplicantIndex={index}
            onSuccess={onSuccess}
            visaApplication={visaApplication}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
