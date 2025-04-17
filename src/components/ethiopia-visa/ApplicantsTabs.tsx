import { useState } from 'react';
import { VisaApplication } from '@/types/ethiopia-visa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApplicantDetails } from '@/components/ethiopia-visa/AdditionalApplicants';
import { UserCircle, User } from 'lucide-react';
import { GovRefDetailsForm } from '@/components/ethiopia-visa/GovRefDetailsForm';

interface ApplicantTabsProps {
  visaApplication: VisaApplication;
}

export function ApplicantTabs({ visaApplication }: ApplicantTabsProps) {
  const { personalInfo, passportInfo, documents, additionalApplicants, applicationStatus } =
    visaApplication;
  const [activeTab, setActiveTab] = useState('primary');

  return (
    <>
      {applicationStatus === "submitted" &&
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid grid-cols-6 mb-4`}>
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
              Primary Applicant : {personalInfo?.givenName} {personalInfo?.surname}
            </h3>

            {/* Government Reference Form for Primary Applicant */}
            <div className="mb-6">
              <GovRefDetailsForm
                applicationId={visaApplication._id}
                applicantType="primary"
                visaApplication={visaApplication}
              />
            </div>

            <ApplicantDetails
              personalInfo={personalInfo}
              passportInfo={passportInfo}
              documents={documents}
              visaType={visaApplication?.visaDetails?.visaType}
              isPrimary
            />
          </TabsContent>

          {additionalApplicants.map((applicant, index) => (
            <TabsContent key={applicant._id} value={`additional-${index}`}>
              <h3 className="text-lg font-semibold mb-4">
                Additional Applicant {index + 1}: {applicant.personalInfo?.givenName}{' '}
                {applicant.personalInfo?.surname}
              </h3>

              {/* Government Reference Form for Additional Applicant */}
              <div className="mb-6">
                <GovRefDetailsForm
                  applicationId={visaApplication._id}
                  applicantType="additional"
                  additionalApplicantIndex={index}
                  visaApplication={visaApplication}
                />
              </div>

              <ApplicantDetails
                personalInfo={applicant?.personalInfo}
                passportInfo={applicant?.passportInfo}
                documents={applicant?.documents}
                visaType={visaApplication?.visaDetails?.visaType}
                isPrimary={false}
              />
            </TabsContent>
          ))}
        </Tabs>
      }
    </>
  );
}
