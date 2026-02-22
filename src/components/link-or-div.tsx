import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import type { LinkProps } from "next/link";

type AsLinkProps = LinkProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof LinkProps> & {
    href: LinkProps["href"];
    children?: ReactNode;
  };

type AsDivProps = ComponentPropsWithoutRef<"div"> & {
  href?: never;
  children?: ReactNode;
};

export type LinkOrDivProps = AsLinkProps | AsDivProps;

function isLinkProps(props: LinkOrDivProps): props is AsLinkProps {
  return props.href != null;
}

export default function LinkOrDiv(props: LinkOrDivProps) {
  if (isLinkProps(props)) {
    const {
      href,
      as,
      replace,
      scroll,
      shallow,
      passHref,
      prefetch,
      locale,
      onMouseEnter,
      onTouchStart,
      onClick,
      ...rest
    } = props;

    return (
      <Link
        href={href}
        as={as}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
        prefetch={prefetch}
        locale={locale}
        onMouseEnter={onMouseEnter}
        onTouchStart={onTouchStart}
        onClick={onClick}
        {...rest}
      />
    );
  }

  const { href: _, ...divProps } = props;
  return <div {...divProps} />;
}
