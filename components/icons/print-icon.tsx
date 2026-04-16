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
        d="M2 6V4a2 2 0 0 1 2-2h2m12 0h2a2 2 0 0 1 2 2v2m0 12v2a2 2 0 0 1-2 2h-2M6 22H4a2 2 0 0 1-2-2v-2M5.91 8.5 12 12m0 0 6.09-3.5M12 12v7m6.3-9.8a1.4 1.4 0 0 0-.7-1.211l-4.9-2.8a1.4 1.4 0 0 0-1.4 0l-4.9 2.8A1.4 1.4 0 0 0 5.7 9.2v5.6a1.4 1.4 0 0 0 .7 1.211l4.9 2.8a1.4 1.4 0 0 0 1.4 0l4.9-2.8a1.4 1.4 0 0 0 .7-1.211z"
      />
    </svg>
  );
}
