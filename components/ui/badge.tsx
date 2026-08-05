import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ink text-white",
        accent: "border-transparent bg-accent/10 text-accent",
        outline: "border-stone-300 text-stone-600",
        amber: "border-amber-200 bg-amber-50 text-amber-700",
        emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
        sky: "border-sky-200 bg-sky-50 text-sky-700",
        red: "border-red-200 bg-red-50 text-red-700",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
