import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CyberpunkProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  label: string;
  showPercentage?: boolean;
}

export function CyberpunkProgress({
  value,
  label,
  showPercentage = true,
  className,
  ...props
}: CyberpunkProgressProps) {
  return (
    <div className={cn("mb-3", className)} {...props}>
      <div className="flex justify-between mb-1">
        <span className="text-white font-medium">{label}</span>
        {showPercentage && <span className="text-cyber-teal">{value}%</span>}
      </div>
      <div className="w-full bg-cyber-dark rounded-full h-2.5">
        <div className="progress-bar" style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}
