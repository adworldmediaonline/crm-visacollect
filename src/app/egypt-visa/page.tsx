'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { egyptVisaApi } from '@/utils/api-endpoints'
import { EgpytVisaTable } from '@/components/egypt-visa/EgpytVisaTable'

const EgyptVisaPage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['egyptVisaApplications'],
        queryFn: async () => {
            const response = await egyptVisaApi.getAllApplications()
            return response.data?.data
        }
    })

    return (
        <DashboardLayout>
            <div className="container mx-auto py-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Egypt Visa Applications</CardTitle>
                        <CardDescription>
                            Manage and view all Egypt visa applications
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
                            <EgpytVisaTable data={data} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}

export default EgyptVisaPage
