import { VisaApplication } from "@/types/ethiopia-visa";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    CalendarClock,
    CreditCard,
    Check,
    Clock
} from "lucide-react";
import { format } from "date-fns";

interface ApplicationStatusCardProps {
    visaApplication: VisaApplication;
}

export function ApplicationStatusCard({ visaApplication }: ApplicationStatusCardProps) {
    const {
        applicationStatus,
        paymentStatus,
        createdAt,
        _id,
        noOfVisa,
        isComplete
    } = visaApplication;

    const createdDate = new Date(createdAt);

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-lg font-bold">Application ID: {_id}</h2>
                            <Badge variant={applicationStatus === "submitted" ? "default" : "outline"}>
                                {applicationStatus === "submitted" ? (
                                    <Check className="mr-1 h-3 w-3" />
                                ) : (
                                    <Clock className="mr-1 h-3 w-3" />
                                )}
                                {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <CalendarClock className="h-4 w-4" />
                                Submitted on {format(createdDate, "PPP")}
                            </div>
                            <div>
                                Number of visas: {noOfVisa}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant={paymentStatus === "paid" ? "secondary" : "destructive"}>
                            <CreditCard className="mr-1 h-3 w-3" />
                            Payment: {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                        </Badge>

                        <Badge variant={isComplete ? "secondary" : "destructive"}>
                            {isComplete ? (
                                <>
                                    <Check className="mr-1 h-3 w-3" />
                                    Complete
                                </>
                            ) : (
                                <>
                                    <Clock className="mr-1 h-3 w-3" />
                                    Incomplete
                                </>
                            )}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}