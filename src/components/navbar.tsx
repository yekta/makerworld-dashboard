"use client";

import { LinkButton } from "@/components/ui/button";
import { HomeIcon, TableIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const routes: TRoute[] = [
  {
    label: "Home",
    href: "/",
    Icon: HomeIcon,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    Icon: TableIcon,
  },
];

type TRoute = {
  label: string;
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function Navbar() {
  const pathname = usePathname();
  const [selectedPathname, setSelectedPathname] = useState(pathname);

  return (
    <nav className="w-full flex fixed bottom-0 left-0 bg-background border-t rounded-t-xl overflow-hidden z-50">
      {routes.map((route) => (
        <NavItem
          key={route.href}
          route={route}
          isActive={selectedPathname === route.href}
          onClick={() => setSelectedPathname(route.href)}
        />
      ))}
    </nav>
  );
}

function NavItem({
  route,
  isActive,
  onClick,
}: {
  route: TRoute;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <LinkButton
      data-active={isActive ? true : undefined}
      variant="ghost"
      className="flex-1 cursor-default group/link text-muted-foreground data-active:text-foreground relative min-w-0 overflow-hidden flex flex-col gap-0.5 font-medium rounded-none items-center justify-center pt-3 pb-[calc(0.75rem+var(--safe-area-inset-bottom))]"
      href={route.href}
      onClick={onClick}
    >
      <route.Icon className="size-5 shrink min-0" />
      <div className="w-full flex items-center justify-center">
        <p className="shrink text-xxs min-w-0 overflow-hidden overflow-ellipsis">
          {route.label}
        </p>
      </div>
      <div className="h-0.5 w-full bg-foreground absolute left-0 top-0 -translate-y-0.75 group-data-active/link:translate-y-0 transition-transform" />
    </LinkButton>
  );
}

export function NavbarSpacer() {
  return (
    <div className="w-full h-[calc(4rem+var(--safe-area-inset-bottom))]" />
  );
}
