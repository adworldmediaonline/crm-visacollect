import { VisaDetails } from '@/types/ethiopia-visa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck } from 'lucide-react';

interface VisaDetailsCardProps {
  visaDetails: VisaDetails;
}

export function VisaDetailsCard({ visaDetails }: VisaDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          Visa Details
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Visa Type
            </p>
            <p className="font-medium">{visaDetails?.visaType}</p>
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Visa Validity
            </p>
            <p className="font-medium">{visaDetails?.visaValidity}</p>
          </div>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Visa Fee
            </p>
            <p className="font-medium">${visaDetails?.visaFee}</p>
          </div>
          {visaDetails?.companyReferenceNumber && (
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Company Reference
              </p>
              <p className="font-medium">
                {visaDetails?.companyReferenceNumber}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
