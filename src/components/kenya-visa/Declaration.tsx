import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Declaration } from '@/types/kenya-visa';

interface DeclarationCardProps {
    declaration: Declaration | undefined;
}

export const DeclarationCard: React.FC<DeclarationCardProps> = ({ declaration }) => {
    if (!declaration) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Declaration Information</CardTitle>
                <CardDescription>
                    {"Applicant's declaration details for Kenya visa"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium">Trip Financed:</p>
                        <Badge variant={declaration.tripFinanced ? "default" : "outline"}>
                            {declaration.tripFinanced ? "Yes" : "No"}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Convicted of Offence:</p>
                        <Badge variant={declaration.convictedOfOffence ? "destructive" : "outline"}>
                            {declaration.convictedOfOffence ? "Yes" : "No"}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Previously Denied Entry to Kenya:</p>
                        <Badge variant={declaration.deniedEntryToKenya ? "destructive" : "outline"}>
                            {declaration.deniedEntryToKenya ? "Yes" : "No"}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Previous Travel to Kenya:</p>
                        <Badge variant={declaration.previousTravelToKenya ? "default" : "outline"}>
                            {declaration.previousTravelToKenya ? "Yes" : "No"}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Carrying Monetary Instrument:</p>
                        <Badge variant={declaration.monetaryInstrument ? "default" : "outline"}>
                            {declaration.monetaryInstrument ? "Yes" : "No"}
                        </Badge>
                    </div>

                    {declaration.monetaryInstrument && (
                        <>
                            {declaration.monetaryInstrumentName && (
                                <div>
                                    <p className="text-sm font-medium">Monetary Instrument Type:</p>
                                    <p className="text-sm">{declaration.monetaryInstrumentName}</p>
                                </div>
                            )}
                            {declaration.monetaryInstrumentCurrency && declaration.amount && (
                                <div>
                                    <p className="text-sm font-medium">Amount:</p>
                                    <p className="text-sm">
                                        {declaration.monetaryInstrumentCurrency} {declaration.amount.toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
