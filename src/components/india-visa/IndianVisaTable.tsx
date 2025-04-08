'use client';

import { useState, useEffect } from 'react';
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
import { ArrowUpDown, ChevronDown, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export function IndianVisaTable({ data }: { data: IndianVisaApplication[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');

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
