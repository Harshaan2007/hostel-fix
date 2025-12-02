import { cn } from "@/lib/utils";
import { Clock, Loader2, CheckCircle2 } from "lucide-react";

type Status = "pending" | "in_progress" | "resolved";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-status-pending-bg text-status-pending",
  },
  in_progress: {
    label: "In Progress",
    icon: Loader2,
    className: "bg-status-progress-bg text-status-progress",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    className: "bg-status-resolved-bg text-status-resolved",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className={cn("h-3 w-3", status === "in_progress" && "animate-spin")} />
      {config.label}
    </span>
  );
}
