import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

type CopyTruncateProps = {
  value: string;
  label?: string; // optional custom tooltip
  trimLength?: number; // how many chars to show
};

export const CopyTruncate = ({
  value,
  label,
  trimLength = 8,
}: CopyTruncateProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  const display =
    value.length > trimLength ? `${value.slice(0, trimLength)}..` : value;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="text-left w-full truncate px-0 font-mono"
            onClick={copyToClipboard}
          >
            {display}
            <CopyIcon className="ml-2 h-3 w-3 text-muted-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label ?? `Click to copy: ${value}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
