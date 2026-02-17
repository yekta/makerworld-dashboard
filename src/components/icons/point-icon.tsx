import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export default function PointIcon({ className, style }: ComponentProps<"svg">) {
  return (
    <svg
      className={cn("size-5 shrink-0", className)}
      style={style}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 2.57735C11.6188 2.22008 12.3812 2.22008 13 2.57735L19.6603 6.42265C20.2791 6.77992 20.6603 7.44017 20.6603 8.1547V15.8453C20.6603 16.5598 20.2791 17.2201 19.6603 17.5774L13 21.4226C12.3812 21.7799 11.6188 21.7799 11 21.4226L4.33975 17.5774C3.72094 17.2201 3.33975 16.5598 3.33975 15.8453V8.1547C3.33975 7.44017 3.72094 6.77992 4.33975 6.42265L11 2.57735Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M11.1679 7.24808C11.5638 6.65434 12.4362 6.65434 12.8321 7.24808L15.6302 11.4453C15.8541 11.7812 15.8541 12.2188 15.6302 12.5547L12.8321 16.7519C12.4362 17.3457 11.5638 17.3457 11.1679 16.7519L8.3698 12.5547C8.14587 12.2188 8.14587 11.7812 8.3698 11.4453L11.1679 7.24808Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
