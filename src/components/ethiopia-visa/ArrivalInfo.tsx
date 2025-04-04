import { ArrivalInfo } from "@/types/ethiopia-visa";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Plane,
    Calendar,
    MapPin,
} from "lucide-react";
import { format } from "date-fns";

interface ArrivalInfoCardProps {
    arrivalInfo: ArrivalInfo;
}

export function ArrivalInfoCard({ arrivalInfo }: ArrivalInfoCardProps) {
    const formattedDate = new Date(arrivalInfo.arrivalDate);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plane className="h-5 w-5" />
                    Arrival Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Arrival Date</p>
                        <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(formattedDate, "PPP")}
                        </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Departure From</p>
                        <p className="font-medium flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {arrivalInfo.departureCity}, {arrivalInfo.departureCountry}
                        </p>
                    </div>
                </div>

                <div className="pt-2">
                    <p className="text-sm font-medium mb-2">Accommodation Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Type</p>
                            <p className="font-medium">{arrivalInfo.accommodationType}</p>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                            <p className="font-medium">{arrivalInfo.accommodationName}</p>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Address</p>
                            <p className="font-medium">
                                {arrivalInfo.accommodationStreetAddress}, {arrivalInfo.accommodationCity}
                            </p>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Contact</p>
                            <p className="font-medium">{arrivalInfo.accommodationTelephone}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}