import { cn } from "@/lib/utils";

type StatusType = 
  | "inquiry" 
  | "pending" 
  | "confirmed" 
  | "on-location" 
  | "returned"
  | "available"
  | "in-use"
  | "maintenance"
  | "lost";

const statusStyles: Record<StatusType, string> = {
  inquiry: "bg-secondary text-secondary-foreground",
  pending: "bg-warning/10 text-warning border border-warning/20",
  confirmed: "bg-success/10 text-success border border-success/20",
  "on-location": "bg-primary/10 text-primary border border-primary/20",
  returned: "bg-muted text-muted-foreground",
  available: "bg-success/10 text-success border border-success/20",
  "in-use": "bg-primary/10 text-primary border border-primary/20",
  maintenance: "bg-warning/10 text-warning border border-warning/20",
  lost: "bg-destructive/10 text-destructive border border-destructive/20",
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
    </span>
  );
}
