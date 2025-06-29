// StatusFilter.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusFilter {
  value: string;
  label: string;
  color: string;
}

interface StatusFilterProps {
  filters: readonly StatusFilter[];
  activeStatus: string;
  onStatusChange: (status: string) => void;
  title?: string;
  showClearButton?: boolean;
  className?: string;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  filters,
  activeStatus,
  onStatusChange,
  title = "Filter by Status",
  showClearButton = true,
  className,
}) => {
  const activeFilter = filters.find((f) => f.value === activeStatus);
  const hasActiveFilter = activeStatus !== "ALL";

  return (
    <div className={cn("space-y-3", className)}>
      {/* Title */}
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = activeStatus === filter.value;

          return (
            <Button
              key={filter.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange(filter.value)}
              className={cn(
                "transition-all duration-200",
                isActive && [
                  "shadow-md",
                  filter.color === "green" &&
                    "bg-green-600 hover:bg-green-700 border-green-600",
                  filter.color === "yellow" &&
                    "bg-yellow-600 hover:bg-yellow-700 border-yellow-600",
                  filter.color === "red" &&
                    "bg-red-600 hover:bg-red-700 border-red-600",
                  filter.color === "blue" &&
                    "bg-blue-600 hover:bg-blue-700 border-blue-600",
                  filter.color === "gray" &&
                    "bg-gray-600 hover:bg-gray-700 border-gray-600",
                ],
                !isActive && "hover:bg-muted",
              )}
            >
              {filter.label}
            </Button>
          );
        })}
      </div>

      {/* Active Filter Indicator with Clear Button */}
      {hasActiveFilter && showClearButton && (
        <div className="flex items-center gap-2 text-sm ">
          <span className="text-muted-foreground">Active:</span>
          <Badge
            variant="secondary"
            className="gap-1"
            style={{
              backgroundColor: activeFilter?.color
                ? `var(--${activeFilter.color}-100)`
                : undefined,
              color: activeFilter?.color
                ? `var(--${activeFilter.color}-800)`
                : undefined,
            }}
          >
            {activeFilter?.label}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onStatusChange("ALL")}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};
