
import { PersonalInfo, PassportInfo, Documents } from "@/types/kenya-visa";
import { PersonalInfoCard } from "./PersonalInfo";
import { PassportInfoCard } from "./PassportInfo";
import { DocumentsCard } from "./Documents";

interface ApplicantDetailsProps {
    personalInfo: PersonalInfo;
    passportInfo: PassportInfo;
    documents: Documents | null;
    isPrimary?: boolean;
    visaType: string;
}

export function ApplicantDetails({
    personalInfo,
    passportInfo,
    documents,
    visaType
}: ApplicantDetailsProps) {
    return (
        <div className="space-y-6">
            {personalInfo && <PersonalInfoCard personalInfo={personalInfo} />}
            {passportInfo && <PassportInfoCard passportInfo={passportInfo} />}
            <DocumentsCard documents={documents} visaType={visaType} />
        </div>
    );
}