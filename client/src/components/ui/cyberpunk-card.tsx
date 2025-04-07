import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CyberpunkCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glassEffect?: boolean;
  glowOnHover?: boolean;
  scaleOnHover?: boolean;
}

export function CyberpunkCard({
  children,
  className,
  glassEffect = true,
  glowOnHover = true,
  scaleOnHover = true,
  ...props
}: CyberpunkCardProps) {
  return (
    <div
      className={cn(
        "cyber-border rounded-lg p-6",
        glassEffect && "glass-card",
        glowOnHover && "hover:box-glow",
        scaleOnHover && "transform transition duration-300 hover:scale-105",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
