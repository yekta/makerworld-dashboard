"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

export const minButtonSizeEnforcerClassName =
  "before:w-full before:h-full before:min-w-[44px] before:min-h-[44px] before:z-[-1] before:bg-transparent before:absolute before:-translate-y-1/2 before:top-1/2 before:-translate-x-1/2 before:left-1/2";

const buttonVariants = cva(
  "inline-flex font-bold items-center touch-manipulation justify-center gap-2 whitespace-nowrap rounded-md text-sm disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90",
        warning:
          "bg-warning text-background hover:bg-warning/90 active:bg-warning/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 active:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground active:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 dark:active:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/80",
        ghost:
          "hover:bg-border active:bg-border active:text-foreground hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2 has-[>svg]:px-3",
        sm: "rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      state: {
        default: "",
        loading: "opacity-75 disabled:opacity-75",
      },
      fadeOnDisabled: {
        default: "disabled:opacity-50",
        false: "",
      },
      forceMinSize: {
        default: minButtonSizeEnforcerClassName,
        medium:
          "before:w-full before:h-full before:min-w-[36px] before:min-h-[36px] before:z-[-1] before:bg-transparent before:absolute before:-translate-y-1/2 before:top-1/2 before:-translate-x-1/2 before:left-1/2",
        false: "",
      },
      focusVariant: {
        default:
          "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "input-like": "",
      },
      layout: {
        default: "",
        flex: "inline-flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export interface TLinkButtonProps
  extends
    React.ComponentProps<typeof LinkCustom>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function LinkButton({
  className,
  variant,
  size,
  state,
  fadeOnDisabled,
  focusVariant,
  forceMinSize,
  children,
  asChild,
  ...props
}: TLinkButtonProps) {
  const Comp = asChild ? Slot : LinkCustom;
  const isText = typeof children === "string";

  return (
    <Comp
      className={cn(
        buttonVariants({
          variant,
          size,
          state,
          fadeOnDisabled,
          focusVariant,
          forceMinSize,
          layout: isText ? undefined : "flex",
          className,
        }),
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

type TPrefetch = "hover" | false;
type TLinkCustomProps = Omit<React.ComponentProps<typeof Link>, "prefetch"> & {
  prefetch?: TPrefetch;
};

function LinkCustom({
  onMouseEnter: onMouseEnterProp,
  onTouchStart: onTouchStartProp,
  href,
  prefetch = "hover",
  ...rest
}: TLinkCustomProps) {
  const router = useRouter();

  const onMouseEnter = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onMouseEnterProp?.(e);
      if (prefetch === "hover") {
        router.prefetch(href.toString());
      }
    },
    [onMouseEnterProp, href, router, prefetch],
  );

  const onTouchStart = React.useCallback(
    (e: React.TouchEvent<HTMLAnchorElement>) => {
      onTouchStartProp?.(e);
      if (prefetch === "hover") {
        router.prefetch(href.toString());
      }
    },
    [onTouchStartProp, href, router, prefetch],
  );

  return (
    <Link
      href={href}
      onMouseEnter={onMouseEnter}
      onTouchStart={onTouchStart}
      prefetch={false}
      {...rest}
    />
  );
}

export { Button, buttonVariants, LinkButton };
