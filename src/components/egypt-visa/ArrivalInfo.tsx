import { ArrivalInfo } from '@/types/egypt-visa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ArrivalInfoCardProps {
  arrivalInfo: ArrivalInfo;
}

export function ArrivalInfoCard({ arrivalInfo }: ArrivalInfoCardProps) {
  const formattedArrivalDate = new Date(arrivalInfo?.arrivalDate);
  const formattedDepartureDate = new Date(arrivalInfo?.departureDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Travel Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Travel Details */}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1">
            <Plane className="h-4 w-4" />
            <span>Travel Details</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Travelling From</p>
              <p className="font-medium">{arrivalInfo.travellingFrom}</p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Arrival Date</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(formattedArrivalDate, 'PPP')}
              </p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Departure Date</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(formattedDepartureDate, 'PPP')}
              </p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Duration of Stay</p>
              <p className="font-medium">
                {Math.ceil((formattedDepartureDate.getTime() - formattedArrivalDate.getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
