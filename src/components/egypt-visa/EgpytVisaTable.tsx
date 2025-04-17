'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, Search, Eye, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { VisaApplication } from '@/types/kenya-visa'
import { format } from 'date-fns'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function EgpytVisaTable({ data }: { data: VisaApplication[] }) {
    const router = useRouter()
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [globalFilter, setGlobalFilter] = useState('')

    // Extract unique values for filter dropdowns
    const [uniquePaymentStatuses, setUniquePaymentStatuses] = useState<string[]>([])
    const [uniqueApplicationStatuses, setUniqueApplicationStatuses] = useState<string[]>([])
    const [uniqueLastExitUrls, setUniqueLastExitUrls] = useState<string[]>([])

    useEffect(() => {
        // Extract unique values for filter dropdowns
        const paymentStatuses = Array.from(new Set(data.map(item => item.paymentStatus))).filter(Boolean) as string[]
        const applicationStatuses = Array.from(new Set(data.map(item => item.applicationStatus))).filter(Boolean) as string[]
        const lastExitUrls = Array.from(new Set(data.map(item => item.lastExitUrl))).filter(Boolean) as string[]

        setUniquePaymentStatuses(paymentStatuses)
        setUniqueApplicationStatuses(applicationStatuses)
        setUniqueLastExitUrls(lastExitUrls)
    }, [data])

    const columns: ColumnDef<VisaApplication>[] = [
        {
            accessorKey: 'id',
            header: 'Application ID',
            cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
        },
        {
            accessorKey: 'personalInfo.givenName',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const firstName = row.original.personalInfo?.givenName || ''
                const lastName = row.original.personalInfo?.surname || ''
                return <div>{`${firstName} ${lastName}`}</div>
            },
        },
        {
            accessorKey: 'emailAddress',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        // {
        //     accessorKey: 'personalInfo.phoneNumber',
        //     header: ({ column }) => {
        //         return (
        //             <Button
        //                 variant="ghost"
        //                 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        //             >
        //                 Phone Number
        //                 <ArrowUpDown className="ml-2 h-4 w-4" />
        //             </Button>
        //         )
        //     },
        //     cell: ({ row }) => <div>{row.original.personalInfo?.phoneNumber}</div>,
        // },
        {
            accessorKey: 'noOfVisa',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        No. of Visas
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: 'visaDetails.visaType',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Visa Type
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.original.visaDetails?.visaType}</div>,
        },
        // {
        //     accessorKey: 'visaDetails.visaValidity',
        //     header: ({ column }) => {
        //         return (
        //             <Button
        //                 variant="ghost"
        //                 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        //             >
        //                 Visa Validity
        //                 <ArrowUpDown className="ml-2 h-4 w-4" />
        //             </Button>
        //         )
        //     },
        //     cell: ({ row }) => <div>{row.original.visaDetails?.visaValidity}</div>,
        // },
        {
            accessorKey: 'visaDetails.visaFee',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div>${row.original.visaDetails?.visaFee}</div>,
        },
        {
            accessorKey: 'applicationStatus',
            header: ({ column }) => {
                return (
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            className="w-full justify-between"
                        >
                            Status
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                        <Select
                            onValueChange={(value) => {
                                if (value === "all") {
                                    // Clear filter if "All" is selected
                                    table.getColumn('applicationStatus')?.setFilterValue(undefined)
                                } else {
                                    table.getColumn('applicationStatus')?.setFilterValue(value)
                                }
                            }}
                            value={(table.getColumn('applicationStatus')?.getFilterValue() as string) || "all"}
                        >
                            <SelectTrigger className="h-8 w-full">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {uniqueApplicationStatuses.map((status) => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )
            },
            cell: ({ row }) => {
                const status = row.getValue('applicationStatus') as string
                return (
                    <Badge variant={
                        status === 'submitted' ? 'default' :
                            status === 'incomplete' ? 'destructive' :
                                status === 'processing' ? 'outline' : 'outline'
                    }>
                        {status}
                    </Badge>
                )
            },
        },
        {
            accessorKey: 'paymentStatus',
            header: ({ column }) => {
                return (
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            className="w-full justify-between"
                        >
                            Payment Status
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                        <Select
                            onValueChange={(value) => {
                                if (value === "all") {
                                    table.getColumn('paymentStatus')?.setFilterValue(undefined)
                                } else {
                                    table.getColumn('paymentStatus')?.setFilterValue(value)
                                }
                            }}
                            value={(table.getColumn('paymentStatus')?.getFilterValue() as string) || "all"}
                        >
                            <SelectTrigger className="h-8 w-full">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {uniquePaymentStatuses.map((status) => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )
            },
            cell: ({ row }) => {
                const status = row.getValue('paymentStatus') as string
                return (
                    <Badge variant={
                        status === 'paid' ? 'default' :
                            status === 'pending' ? 'destructive' :
                                status === 'failed' ? 'outline' : 'outline'
                    }>
                        {status}
                    </Badge>
                )
            },
        },
        {
            accessorKey: 'lastExitUrl',
            header: ({ column }) => {
                return (
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                            className="w-full justify-between"
                        >
                            LastExitUrl
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                        <Select
                            onValueChange={(value) => {
                                if (value === "all") {
                                    table.getColumn('lastExitUrl')?.setFilterValue(undefined)
                                } else {
                                    table.getColumn('lastExitUrl')?.setFilterValue(value)
                                }
                            }}
                            value={(table.getColumn('lastExitUrl')?.getFilterValue() as string) || "all"}
                        >
                            <SelectTrigger className="h-8 w-full">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {uniqueLastExitUrls.map((url) => (
                                    <SelectItem key={url} value={url}>{url}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )
            },
            cell: ({ row }) => {
                return <div>{row.original.lastExitUrl}</div>
            },
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Date Applied
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return <div>{format(new Date(row.getValue('createdAt')), 'PPP')}</div>
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                return (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => router.push(`/egypt-visa/${row.original.id}`)}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                    </Button>
                )
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
        },
    })

    // Function to get active filters for display
    const getActiveFilters = () => {
        const filters = []

        const applicationStatusFilter = table.getColumn('applicationStatus')?.getFilterValue() as string
        if (applicationStatusFilter) {
            filters.push({ column: 'Application Status', value: applicationStatusFilter })
        }

        const paymentStatusFilter = table.getColumn('paymentStatus')?.getFilterValue() as string
        if (paymentStatusFilter) {
            filters.push({ column: 'Payment Status', value: paymentStatusFilter })
        }

        const lastExitUrlFilter = table.getColumn('lastExitUrl')?.getFilterValue() as string
        if (lastExitUrlFilter) {
            filters.push({ column: 'Last Exit URL', value: lastExitUrlFilter })
        }

        return filters
    }

    const activeFilters = getActiveFilters()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search applications..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="h-8 w-[250px] lg:w-[300px]"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id.replace(/([A-Z])/g, ' $1').replace(/\./g, ' ').trim()}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Active Filters Display */}
            {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-medium">Active Filters:</span>
                    {activeFilters.map((filter, index) => (
                        <Badge key={index} variant="outline" className="px-2 py-1 flex items-center gap-1">
                            <span>{filter.column}: {filter.value}</span>
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => {
                                    if (filter.column === 'Application Status') {
                                        table.getColumn('applicationStatus')?.setFilterValue(undefined)
                                    } else if (filter.column === 'Payment Status') {
                                        table.getColumn('paymentStatus')?.setFilterValue(undefined)
                                    } else if (filter.column === 'Last Exit URL') {
                                        table.getColumn('lastExitUrl')?.setFilterValue(undefined)
                                    }
                                }}
                            />
                        </Badge>
                    ))}
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            table.getColumn('applicationStatus')?.setFilterValue(undefined)
                            table.getColumn('paymentStatus')?.setFilterValue(undefined)
                            table.getColumn('lastExitUrl')?.setFilterValue(undefined)
                        }}
                        className="h-7 text-xs cursor-pointer"
                    >
                        Clear All
                    </Button>
                </div>
            )}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    Showing {table.getFilteredRowModel().rows.length} of {data.length} applications
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
