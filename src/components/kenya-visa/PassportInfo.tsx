import { PassportInfo } from "@/types/kenya-visa";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    BookOpen,
    Calendar
} from "lucide-react";
import { format } from "date-fns";

interface PassportInfoCardProps {
    passportInfo: PassportInfo;
}

export function PassportInfoCard({ passportInfo }: PassportInfoCardProps) {
    const issueDate = new Date(passportInfo?.passportIssueDate);
    const expiryDate = new Date(passportInfo?.passportExpiryDate);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Passport Information
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Passport Number</p>
                        <p className="font-medium">{passportInfo?.passportNumber}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                        <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(issueDate, "PPP")}
                        </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                        <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(expiryDate, "PPP")}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}