import { Documents } from "@/types/ethiopia-visa";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    FileText,
    Check,
    X,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ethiopiaVisaApi } from "@/utils/api-endpoints";

interface DocumentsCardProps {
    documents: Documents;
    visaType: string;
}

type VisaTypeData = {
    name: string;
    validities: Array<{ type: string; price: number }>;
    attachments: string[];
};

// Map document names from API to document keys in our system
const documentKeyMap: Record<string, string> = {
    "Passport": "passport",
    "Photo": "photo",
    "Application Letter": "applicationLetter",
    "Support Letter": "supportLetter",
    "Invitation Letter": "invitationLetter",
    "Inviting Company Information": "invitingCompanyInfo",
    "Registration License": "registrationLicense",
    "Business License": "businessLicense",
    "TIN Certificate": "tinCertificate",
    "Copy of foreign Investor employee Visa": "foreignInvestorEmployeeVisa",
    "Letter of acceptance from an institution where study will take place": "acceptanceLetter",
    "Bank Statement": "bankStatement",
    "Company Profile": "companyProfile"
};

export function DocumentsCard({ documents, visaType }: DocumentsCardProps) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['visaTypes'],
        queryFn: async () => {
            const response = await ethiopiaVisaApi.getVisaTypes();
            return response.data.visaTypes as VisaTypeData[];
        }
    });

    // Find the visa type that matches the one passed in props
    const selectedVisaType = data?.find(type => type.name === visaType);
    const requiredDocuments = selectedVisaType?.attachments || [];

    // Get document types that are required for this visa type
    const requiredDocumentTypes = requiredDocuments.map(docName => ({
        key: documentKeyMap[docName] || "",
        label: docName
    })).filter(doc => doc.key !== "");

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documents
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>Loading required documents...</div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documents
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-red-500">Error loading document requirements</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Required Documents for {visaType}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requiredDocumentTypes.length > 0 ? (
                        requiredDocumentTypes.map(({ key, label }) => {
                            // Safely access document properties with null checks
                            const docObj = documents?.documents?.[key as keyof typeof documents.documents];
                            const hasDocument = !!docObj?.secure_url;

                            return (
                                <div key={key} className="flex items-center justify-between p-2 border rounded">
                                    <div className="flex items-center gap-2">
                                        {hasDocument ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <X className="h-4 w-4 text-red-500" />
                                        )}
                                        <span>{label}</span>
                                    </div>

                                    {hasDocument && docObj?.secure_url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a
                                                href={docObj.secure_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1"
                                            >
                                                <span className="text-xs">View</span>
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-2 text-center text-gray-500">
                            No document requirements found for this visa type
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
