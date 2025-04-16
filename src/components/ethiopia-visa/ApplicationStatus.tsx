import { VisaApplication } from '@/types/ethiopia-visa';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, CreditCard, Check, Clock, DollarSign, CreditCard as CreditCardIcon, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { ethiopiaVisaApi } from '@/utils/api-endpoints';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ApplicationStatusCardProps {
  visaApplication: VisaApplication;
}

export function ApplicationStatusCard({
  visaApplication,
}: ApplicationStatusCardProps) {
  const {
    applicationStatus,
    paymentStatus,
    paymentId,
    paymentDate,
    paymentMethod,
    paymentAmount,
    createdAt,
    _id,
    noOfVisa,
    isComplete,
  } = visaApplication;

  const [status, setStatus] = useState(applicationStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const createdDate = new Date(createdAt);

  const statusOptions = [
    "incomplete",
    "submitted",
    "pending document",
    "on hold",
    "pending",
    "form filled",
    "processed",
    "future processing",
    "visa granted",
    "visa email sent",
    "escalated",
    "visa declined",
    "refund pending",
    "refund completed",
    "payment disputed",
    "miscellaneous",
    "not interested",
    "chargeback",
  ];

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      await ethiopiaVisaApi.updateApplicationStatus(_id, newStatus);
      setStatus(newStatus);
      toast.success("Application status updated successfully");
    } catch (error) {
      toast.error("Failed to update application status");
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-bold">Application ID: {_id}</h2>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarClock className="h-4 w-4" />
                Submitted on {format(createdDate, 'PPP')}
              </div>
              <div>Number of visas: {noOfVisa}</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="status-select" className="text-sm font-medium">
                Application Status
              </label>
              <Select
                value={status}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger id="status-select" className="w-[200px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Badge
            variant={paymentStatus === 'paid' ? 'secondary' : 'destructive'}
          >
            <CreditCard className="mr-1 h-3 w-3" />
            Payment:{' '}
            {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
          </Badge>

          <Badge variant={isComplete ? 'secondary' : 'destructive'}>
            {isComplete ? (
              <>
                <Check className="mr-1 h-3 w-3" />
                Complete
              </>
            ) : (
              <>
                <Clock className="mr-1 h-3 w-3" />
                Incomplete
              </>
            )}
          </Badge>

          <div className="flex flex-col gap-2">
            {paymentStatus === 'paid' && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  <CalendarClock className="mr-1 h-3 w-3" />
                  Payment Date: {format(new Date(paymentDate), 'PPP')}
                </Badge>
                <Badge variant="outline" className="text-xs break-all max-w whitespace-normal">
                  <Hash className="mr-1 h-3 w-3" />
                  Payment ID: {paymentId}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <CreditCardIcon className="mr-1 h-3 w-3" />
                  Payment Method: {paymentMethod}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <DollarSign className="mr-1 h-3 w-3" />
                  Paid Amount: ${paymentAmount}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
