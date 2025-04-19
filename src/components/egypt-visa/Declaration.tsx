import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Declaration } from '@/types/egypt-visa';

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
                    {"Applicant's declaration details for Egypt visa"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium">Previously Visited Egypt:</p>
                        <Badge variant={declaration.visitedBefore ? "default" : "outline"}>
                            {declaration.visitedBefore ? "Yes" : "No"}
                        </Badge>
                    </div>

                    {declaration.visitedBefore && declaration.dateFrom && declaration.dateTo && (
                        <div>
                            <p className="text-sm font-medium">Previous Visit Period:</p>
                            <p className="text-sm">
                                {format(new Date(declaration.dateFrom), 'PP')} - {format(new Date(declaration.dateTo), 'PP')}
                            </p>
                        </div>
                    )}

                    {declaration.visitedBefore && declaration.whereStayed && (
                        <div>
                            <p className="text-sm font-medium">Where Stayed:</p>
                            <p className="text-sm">{declaration.whereStayed}</p>
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-medium">Deported from Egypt or Other Country:</p>
                        <Badge variant={declaration.deportedFromEgyptOrOtherCountry ? "destructive" : "outline"}>
                            {declaration.deportedFromEgyptOrOtherCountry ? "Yes" : "No"}
                        </Badge>
                    </div>

                    {declaration.deportedFromEgyptOrOtherCountry && declaration.deportedDateFrom && declaration.deportedDateTo && (
                        <div>
                            <p className="text-sm font-medium">Deportation Period:</p>
                            <p className="text-sm">
                                {format(new Date(declaration.deportedDateFrom), 'PP')} - {format(new Date(declaration.deportedDateTo), 'PP')}
                            </p>
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-medium">Trip Financed By:</p>
                        <p className="text-sm">{declaration.whoIsPaying}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
