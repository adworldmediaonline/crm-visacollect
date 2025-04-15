import { ArrivalInfo } from '@/types/kenya-visa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Calendar, Ship, Car, Building, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ArrivalInfoCardProps {
  arrivalInfo: ArrivalInfo;
}

export function ArrivalInfoCard({ arrivalInfo }: ArrivalInfoCardProps) {
  const formattedArrivalDate = new Date(arrivalInfo?.arrivalDate);
  const formattedAccommodationFromDate = new Date(arrivalInfo?.accommodationFromDate);
  const formattedAccommodationToDate = new Date(arrivalInfo?.accommodationToDate);

  const renderArrivalDetails = () => {
    switch (arrivalInfo.arrivingBy) {
      case 'By Air':
        return (
          <>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Airline</p>
              <p className="font-medium">{arrivalInfo.arrivalAirline}</p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Flight Number</p>
              <p className="font-medium">{arrivalInfo.arrivalFlightNumber}</p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Airport</p>
              <p className="font-medium">{arrivalInfo.arrivalAirPort}</p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Origin Country</p>
              <p className="font-medium">{arrivalInfo.originCountry}</p>
            </div>
          </>
        );
      case 'By Sea':
        return (
          <>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Vessel Name</p>
              <p className="font-medium">{arrivalInfo.arrivalVesselName}</p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Sea Port</p>
              <p className="font-medium">{arrivalInfo.arrivalSeaPort}</p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Origin Country</p>
              <p className="font-medium">{arrivalInfo.originCountry}</p>
            </div>
          </>
        );
      case 'By Land':
        return (
          <>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Border Crossing</p>
              <p className="font-medium">{arrivalInfo.landBorderCrossing}</p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Origin Country</p>
              <p className="font-medium">{arrivalInfo.originCountry}</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderDepartureDetails = () => {
    switch (arrivalInfo.departureBy) {
      case 'By Air':
        return (
          <>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Airline</p>
              <p className="font-medium">{arrivalInfo.departureAirline}</p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Flight Number</p>
              <p className="font-medium">{arrivalInfo.departureFlightNumber}</p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Airport</p>
              <p className="font-medium">{arrivalInfo.departureAirPort}</p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Destination Country</p>
              <p className="font-medium">{arrivalInfo.destinationCountry}</p>
            </div>
          </>
        );
      case 'By Sea':
        return (
          <>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Vessel Name</p>
              <p className="font-medium">{arrivalInfo.departureVesselName}</p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Sea Port</p>
              <p className="font-medium">{arrivalInfo.departureSeaPort}</p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Destination Country</p>
              <p className="font-medium">{arrivalInfo.destinationCountry}</p>
            </div>
          </>
        );
      case 'By Land':
        return (
          <>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Border Crossing</p>
              <p className="font-medium">{arrivalInfo.departureLandBorderCrossing}</p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Destination Country</p>
              <p className="font-medium">{arrivalInfo.destinationCountry}</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getTransportIcon = (transportType: string) => {
    switch (transportType) {
      case 'By Air':
        return <Plane className="h-4 w-4" />;
      case 'By Sea':
        return <Ship className="h-4 w-4" />;
      case 'By Land':
        return <Car className="h-4 w-4" />;
      default:
        return <Plane className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Travel Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Arrival Section */}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1">
            {getTransportIcon(arrivalInfo.arrivingBy)}
            <span>Arrival Details ({arrivalInfo.arrivingBy})</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Arrival Date</p>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(formattedArrivalDate, 'PPP')}
              </p>
            </div>
            {renderArrivalDetails()}
          </div>
        </div>

        {/* Departure Section */}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1">
            {getTransportIcon(arrivalInfo.departureBy)}
            <span>Departure Details ({arrivalInfo.departureBy})</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderDepartureDetails()}
          </div>
        </div>

        {/* Accommodation Section */}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1">
            <Building className="h-4 w-4" />
            <span>Accommodation Details</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="font-medium">{arrivalInfo.accommodationName}</p>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Stay Period</p>
              <p className="font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {format(formattedAccommodationFromDate, 'PP')} - {format(formattedAccommodationToDate, 'PP')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
