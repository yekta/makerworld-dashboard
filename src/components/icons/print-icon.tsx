import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export default function PrintIcon({ className, style }: ComponentProps<"svg">) {
  return (
    <svg
      className={cn("size-5 shrink-0", className)}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M2 6V4a2 2 0 0 1 2-2h2m12 0h2a2 2 0 0 1 2 2v2m0 12v2a2 2 0 0 1-2 2h-2M6 22H4a2 2 0 0 1-2-2v-2M5.475 8.25 12 12m0 0 6.525-3.75M12 12v7.5M18.75 9A1.5 1.5 0 0 0 18 7.702l-5.25-3a1.5 1.5 0 0 0-1.5 0l-5.25 3A1.5 1.5 0 0 0 5.25 9v6A1.5 1.5 0 0 0 6 16.297l5.25 3a1.5 1.5 0 0 0 1.5 0l5.25-3A1.5 1.5 0 0 0 18.75 15z"
      />
    </svg>
  );
}
