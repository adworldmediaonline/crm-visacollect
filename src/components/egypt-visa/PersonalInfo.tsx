import { PersonalInfo } from "@/types/egypt-visa";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    User,
    Flag,
    Mail,
    Phone,
    Calendar,
    Briefcase,
    Heart,
} from "lucide-react";
import { format } from "date-fns";

interface PersonalInfoCardProps {
    personalInfo: PersonalInfo;
}

export function PersonalInfoCard({ personalInfo }: PersonalInfoCardProps) {
    const dateOfBirth = new Date(personalInfo?.dateOfBirth);

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                        <p className="font-medium">{personalInfo?.givenName || ""} {personalInfo?.surname || ""}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Gender</p>
                        <p className="font-medium capitalize">{personalInfo?.gender}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                        <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(dateOfBirth, "PPP")}
                        </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Place of Birth</p>
                        <p className="font-medium">{personalInfo?.placeOfBirth}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Country of Birth</p>
                        <p className="font-medium">{personalInfo?.countryOfBirth}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Citizenship</p>
                        <p className="font-medium flex items-center gap-1">
                            <Flag className="h-4 w-4" />
                            {personalInfo?.citizenship}
                        </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Marital Status</p>
                        <p className="font-medium flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span className="capitalize">{personalInfo?.maritalStatus}</span>
                        </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Occupation</p>
                        <p className="font-medium flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {personalInfo?.occupation}
                        </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="font-medium flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {personalInfo?.email}
                        </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                        <p className="font-medium flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {personalInfo?.phoneNumber}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
