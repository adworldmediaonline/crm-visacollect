'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import { ethiopiaVisaApi } from '@/utils/api-endpoints'
import { EthiopiaVisaTable } from '@/components/ethiopia-visa/EthiopiaVisaTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

const EthiopiaVisaPage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['ethiopiaVisaApplications'],
        queryFn: async () => {
            const response = await ethiopiaVisaApi.getAllApplications()
            return response.data
        }
    })

    return (
        <DashboardLayout>
            <div className="container mx-auto py-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Ethiopia Visa Applications</CardTitle>
                        <CardDescription>
                            Manage and view all Ethiopia visa applications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ) : error ? (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    Failed to load visa applications. Please try again later.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <EthiopiaVisaTable data={data} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}

export default EthiopiaVisaPage
