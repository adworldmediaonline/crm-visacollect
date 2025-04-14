'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@tanstack/react-table';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpDown, ChevronDown, Eye, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { IndianVisaApplication } from '@/types/india-visa';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { indianVisaApi } from '@/utils/api-endpoints';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

// Helper function to format elapsed time
function formatElapsedTime(startTime: Date): string {
  const timeElapsed = Math.floor(
    (new Date().getTime() - startTime.getTime()) / 1000
  );
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  return `${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;
}

export function IndianVisaTable({ data }: { data: IndianVisaApplication[] }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);

  // State for selective email sending
  const [selectedEmailTypes, setSelectedEmailTypes] = useState({
    incomplete: true,
    pendingDocument: true,
    holdOn: true,
  });

  // Email sending status tracker
  const [emailProcessingStatus, setEmailProcessingStatus] = useState<{
    inProgress: boolean;
    startTime: Date | null;
    emailTypes: string[];
  }>({
    inProgress: false,
    startTime: null,
    emailTypes: [],
  });

  // Set up the mutation for sending reminder emails
  const reminderEmailsMutation = useMutation({
    mutationFn: (emailTypes: {
      incomplete: boolean;
      pendingDocument: boolean;
      holdOn: boolean;
    }) => indianVisaApi.sendReminderEmails(emailTypes),
    onSuccess: () => {
      toast.success('Email sending has started in the background');

      // Don't close the dialog here - let the useEffect handle it

      // Set email sending status with properly typed keys
      const emailTypeLabels: Record<string, string> = {
        incomplete: 'Incomplete Form',
        pendingDocument: 'Document Upload',
        holdOn: 'Payment',
      };

      // Safely map selected email types to labels
      const selectedTypes = Object.entries(selectedEmailTypes)
        .filter(entry => entry[1])
        .map(
          ([type]) =>
            emailTypeLabels[type as keyof typeof emailTypeLabels] || type
        );

      setEmailProcessingStatus({
        inProgress: true,
        startTime: new Date(),
        emailTypes: selectedTypes,
      });

      // Optionally refresh the data after sending reminders
      queryClient.invalidateQueries({ queryKey: ['indianVisaApplications'] });
    },
    onError: error => {
      console.error('Error sending reminder emails:', error);
      toast.error('Failed to start email sending process. Please try again.');
    },
  });

  // Toggle all email types
  const toggleAllEmailTypes = (checked: boolean) => {
    setSelectedEmailTypes({
      incomplete: checked,
      pendingDocument: checked,
      holdOn: checked,
    });
  };

  // Function to handle sending reminder emails
  const handleSendReminderEmails = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    reminderEmailsMutation.mutate(selectedEmailTypes);
    // Don't close the dialog here - let the mutation's onSuccess handle that
  };

  // Close dialog on successful email sending
  useEffect(() => {
    if (reminderEmailsMutation.isSuccess) {
      // Add a slight delay before closing for better UX
      const timer = setTimeout(() => {
        setIsReminderDialogOpen(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [reminderEmailsMutation.isSuccess]);

  // Update the status indicator every second to show elapsed time
  useEffect(() => {
    if (!emailProcessingStatus.inProgress || !emailProcessingStatus.startTime)
      return;

    const timer = setInterval(() => {
      setEmailProcessingStatus(current => ({ ...current }));
    }, 1000);

    return () => clearInterval(timer);
  }, [emailProcessingStatus.inProgress, emailProcessingStatus.startTime]);

  // Extract unique values for filter dropdowns
  const [uniquePaymentStatuses, setUniquePaymentStatuses] = useState<string[]>(
    []
  );
  const [uniqueVisaStatuses, setUniqueVisaStatuses] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique values for filter dropdowns
    const paymentStatuses = Array.from(
      new Set(data.map(item => item.paymentStatus))
    ).filter(Boolean) as string[];
    const visaStatuses = Array.from(
      new Set(data.map(item => item.visaStatus))
    ).filter(Boolean) as string[];

    setUniquePaymentStatuses(paymentStatuses);
    setUniqueVisaStatuses(visaStatuses);
  }, [data]);

  const columns: ColumnDef<IndianVisaApplication>[] = [
    {
      accessorKey: '_id',
      header: 'Application ID',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('_id')}</div>
      ),
    },
    {
      accessorKey: 'step2.firstName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const firstName = row.original.step2?.firstName || '';
        const lastName = row.original.step2?.lastName || '';
        return <div>{`${firstName} ${lastName}`}</div>;
      },
    },
    {
      accessorKey: 'emailId',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'contactNo',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Phone Number
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'visaService',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Visa Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'price',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>${row.getValue('price')}</div>,
    },
    {
      accessorKey: 'visaStatus',
      header: ({ column }) => {
        return (
          <div className="space-y-1">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="w-full justify-between"
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            <Select
              onValueChange={value => {
                if (value === 'all') {
                  table.getColumn('visaStatus')?.setFilterValue(undefined);
                } else {
                  table.getColumn('visaStatus')?.setFilterValue(value);
                }
              }}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {uniqueVisaStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue('visaStatus') as string;
        return (
          <Badge
            variant={
              status === 'approved'
                ? 'outline'
                : status === 'rejected'
                ? 'destructive'
                : status === 'pending' || status === 'processing'
                ? 'secondary'
                : status === 'incomplete'
                ? 'outline'
                : 'default'
            }
          >
            {status}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value === row.getValue(id);
      },
    },
    {
      accessorKey: 'paymentStatus',
      header: ({ column }) => {
        return (
          <div className="space-y-1">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="w-full justify-between"
            >
              Payment
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            <Select
              onValueChange={value => {
                if (value === 'all') {
                  table.getColumn('paymentStatus')?.setFilterValue(undefined);
                } else {
                  table.getColumn('paymentStatus')?.setFilterValue(value);
                }
              }}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {uniquePaymentStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue('paymentStatus') as string;
        return (
          <Badge
            variant={
              status === 'paid'
                ? 'outline'
                : status === 'failed'
                ? 'destructive'
                : status === 'pending'
                ? 'secondary'
                : 'default'
            }
          >
            {status}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value === row.getValue(id);
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
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return <div>{format(date, 'MMM dd, yyyy')}</div>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const application = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/india-visa/${application._id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  // Function to get active filters
  const getActiveFilters = () => {
    const filters: { id: string; value: string | number }[] = [];

    columnFilters.forEach(filter => {
      filters.push({
        id: filter.id,
        value: filter.value as string | number,
      });
    });

    if (globalFilter) {
      filters.push({
        id: 'global',
        value: globalFilter,
      });
    }

    return filters;
  };

  // Active filters
  const activeFilters = getActiveFilters();

  // Count the number of applications by status
  const statusCounts = useMemo(() => {
    return data.reduce(
      (acc, application) => {
        if (application.visaStatus === 'incomplete') acc.incomplete++;
        if (application.visaStatus === 'pending document')
          acc.pendingDocument++;
        if (application.visaStatus === 'hold on') acc.holdOn++;
        return acc;
      },
      { incomplete: 0, pendingDocument: 0, holdOn: 0 }
    );
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="flex w-full md:w-auto gap-2">
          <Input
            placeholder="Search applications..."
            value={globalFilter ?? ''}
            onChange={event => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <AlertDialog
          open={isReminderDialogOpen}
          onOpenChange={open => {
            // Only allow closing if we're not in the middle of sending emails
            if (!reminderEmailsMutation.isPending) {
              setIsReminderDialogOpen(open);
            }
          }}
        >
          <AlertDialogTrigger asChild>
            <Button variant="default" className="gap-2">
              <Mail className="h-4 w-4" />
              Send Reminder Emails
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {reminderEmailsMutation.isPending
                  ? 'Sending Reminder Emails...'
                  : 'Send Reminder Emails'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {reminderEmailsMutation.isPending ? (
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                    <p>Sending reminder emails. This may take a moment...</p>
                  </div>
                ) : reminderEmailsMutation.isSuccess ? (
                  <div className="py-2">
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                      <p className="text-green-800 font-medium">
                        Email reminders sent successfully!
                      </p>
                      {reminderEmailsMutation.data?.data.summary && (
                        <p className="text-green-700 text-sm mt-1">
                          {reminderEmailsMutation.data.data.summary.sent} emails
                          sent (
                          {reminderEmailsMutation.data.data.summary.details})
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mb-3">
                      Select which types of reminder emails to send. This will
                      be processed in the background for better performance.
                    </p>

                    <div className="bg-slate-50 p-3 rounded-md space-y-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all"
                          checked={
                            selectedEmailTypes.incomplete &&
                            selectedEmailTypes.pendingDocument &&
                            selectedEmailTypes.holdOn
                          }
                          onCheckedChange={checked =>
                            toggleAllEmailTypes(!!checked)
                          }
                          className="data-[state=checked]:bg-primary"
                        />
                        <label
                          htmlFor="select-all"
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          Select All
                        </label>
                      </div>

                      <div className="flex items-center justify-between border-t pt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="incomplete-form"
                            checked={selectedEmailTypes.incomplete}
                            onCheckedChange={checked =>
                              setSelectedEmailTypes({
                                ...selectedEmailTypes,
                                incomplete: !!checked,
                              })
                            }
                            className="data-[state=checked]:bg-amber-600"
                          />
                          <label
                            htmlFor="incomplete-form"
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            Incomplete Applications
                          </label>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          {statusCounts.incomplete} users
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between border-t pt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="pending-document"
                            checked={selectedEmailTypes.pendingDocument}
                            onCheckedChange={checked =>
                              setSelectedEmailTypes({
                                ...selectedEmailTypes,
                                pendingDocument: !!checked,
                              })
                            }
                            className="data-[state=checked]:bg-blue-600"
                          />
                          <label
                            htmlFor="pending-document"
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            Pending Document
                          </label>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          {statusCounts.pendingDocument} users
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between border-t pt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hold-on"
                            checked={selectedEmailTypes.holdOn}
                            onCheckedChange={checked =>
                              setSelectedEmailTypes({
                                ...selectedEmailTypes,
                                holdOn: !!checked,
                              })
                            }
                            className="data-[state=checked]:bg-purple-600"
                          />
                          <label
                            htmlFor="hold-on"
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            Payment Required (Hold On)
                          </label>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          {statusCounts.holdOn} users
                        </Badge>
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      Note: Applications with arrival date as today will be
                      skipped.
                    </p>
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {!reminderEmailsMutation.isPending &&
                !reminderEmailsMutation.isSuccess && (
                  <>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSendReminderEmails}
                      className="gap-2"
                      disabled={
                        !selectedEmailTypes.incomplete &&
                        !selectedEmailTypes.pendingDocument &&
                        !selectedEmailTypes.holdOn
                      }
                    >
                      Send Reminders
                    </AlertDialogAction>
                  </>
                )}

              {reminderEmailsMutation.isSuccess && (
                <AlertDialogAction
                  onClick={() => setIsReminderDialogOpen(false)}
                >
                  Close
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Display active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge
              variant="secondary"
              key={index}
              className="flex items-center gap-1"
            >
              {filter.id === 'global' ? 'Search' : filter.id}:{' '}
              {filter.value.toString()}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  if (filter.id === 'global') {
                    setGlobalFilter('');
                  } else {
                    table.getColumn(filter.id)?.setFilterValue(undefined);
                  }
                }}
              />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setGlobalFilter('');
              setColumnFilters([]);
            }}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Show email sending status indicator */}
      {emailProcessingStatus.inProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 flex justify-between items-center">
          <div>
            <p className="text-blue-800 font-medium flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              Emails are being sent in the background
            </p>
            <p className="text-blue-700 text-sm mt-1">
              Sending: {emailProcessingStatus.emailTypes.join(', ')} reminders
            </p>
            {emailProcessingStatus.startTime && (
              <p className="text-blue-600 text-xs">
                Started {formatElapsedTime(emailProcessingStatus.startTime)} ago
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setEmailProcessingStatus({
                inProgress: false,
                startTime: null,
                emailTypes: [],
              })
            }
          >
            Dismiss
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {data.length}{' '}
          applications
        </div>
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
  );
}
