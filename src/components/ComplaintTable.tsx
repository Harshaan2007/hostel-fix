import { format } from "date-fns";
import { MoreHorizontal, CheckCircle2, Clock, Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { issueTypeLabels } from "@/lib/validation";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Complaint = Database["public"]["Tables"]["complaints"]["Row"];
type IssueStatus = Database["public"]["Enums"]["issue_status"];

interface ComplaintTableProps {
  complaints: Complaint[];
  onStatusChange: (id: string, status: IssueStatus) => void;
  isUpdating: string | null;
}

export function ComplaintTable({ complaints, onStatusChange, isUpdating }: ComplaintTableProps) {
  if (complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-lg font-medium">No complaints found</h3>
        <p className="text-sm text-muted-foreground">
          No complaints match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Room</TableHead>
            <TableHead>Issue Type</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((complaint) => (
            <TableRow key={complaint.id} className="animate-fade-in">
              <TableCell className="font-mono font-medium">
                {complaint.room_number}
              </TableCell>
              <TableCell>{issueTypeLabels[complaint.issue_type]}</TableCell>
              <TableCell className="hidden max-w-xs truncate md:table-cell">
                {complaint.description}
              </TableCell>
              <TableCell>
                <StatusBadge status={complaint.status} />
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {format(new Date(complaint.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isUpdating === complaint.id}
                    >
                      {isUpdating === complaint.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreHorizontal className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onStatusChange(complaint.id, "pending")}
                      disabled={complaint.status === "pending"}
                    >
                      <Clock className="mr-2 h-4 w-4 text-status-pending" />
                      Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(complaint.id, "in_progress")}
                      disabled={complaint.status === "in_progress"}
                    >
                      <Loader2 className="mr-2 h-4 w-4 text-status-progress" />
                      Mark as In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(complaint.id, "resolved")}
                      disabled={complaint.status === "resolved"}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4 text-status-resolved" />
                      Mark as Resolved
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
