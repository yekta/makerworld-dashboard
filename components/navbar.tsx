"use client";

import { useIsCN } from "@/app/(home)/_components/filters-section/hooks";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AppRouterOutputs } from "@/server/trpc/api/root";
import { TableIcon, UserRoundIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

type TRoute = {
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const cnString = "?cn=true";

export default function Navbar({
  users,
}: {
  users: AppRouterOutputs["myUsers"]["list"]["users"];
}) {
  const pathname = usePathname();
  const [selectedPathname, setSelectedPathname] = useState(pathname);
  const [isCN] = useIsCN();

  const routes: TRoute[] = useMemo(() => {
    return [
      ...users.map((user) => {
        let Icon: React.ComponentType<{ className?: string }> = UserRoundIcon;

        const avatarUrl = user.avatar_url;

        if (avatarUrl) {
          Icon = ({ className }: { className?: string }) => (
            <Image
              alt="Avatar"
              src={avatarUrl}
              className={cn(
                className,
                "rounded-full opacity-75 saturate-0 border border-muted-more-foreground group-hover/link:saturate-100 group-hover/link:opacity-100 group-hover/link:border-foreground group-data-active/link:opacity-100 group-data-active/link:saturate-100 group-data-active/link:border-foreground",
              )}
              width={512}
              height={512}
              sizes="64px"
            />
          );
        }

        return {
          label: `${user.username}`,
          href: `/${user.username}${isCN ? cnString : ""}`,
          Icon,
        };
      }),
      {
        label: "Leaderboard",
        href: "/leaderboard",
        Icon: TableIcon,
      },
    ];
  }, [users, isCN]);

  return (
    <nav className="w-full flex fixed bottom-0 bg-background border-t rounded-t-xl overflow-hidden z-50">
      {routes.map((route) => (
        <NavItem
          key={route.href}
          route={route}
          isActive={
            selectedPathname === route.href ||
            selectedPathname + cnString === route.href
          }
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
      className="flex-1 p-0 cursor-default group/link text-muted-more-foreground data-active:text-foreground relative min-w-0 overflow-hidden flex font-semibold rounded-none items-center justify-center"
      href={route.href}
      onClick={onClick}
    >
      <div className="w-full md:w-auto shrink min-w-0 flex flex-col gap-0.5 sm:gap-1.5 sm:flex-row items-center justify-center relative px-4 sm:px-10 sm:pt-3.5 sm:pb-3.5 pt-2 pb-[calc(0.5rem+var(--safe-area-inset-bottom))]">
        <route.Icon className="size-4.5 shrink min-0" />
        <div className="w-full sm:w-auto min-w-0 flex items-center justify-center">
          <p className="shrink text-xxs sm:text-sm min-w-0 overflow-hidden overflow-ellipsis">
            {route.label}
          </p>
        </div>
        <div className="w-full absolute left-0 top-0 -translate-y-0.5 group-data-active/link:translate-y-0 transition-transform px-3.5 sm:px-0">
          <div className="h-0.5 w-full bg-foreground rounded-full" />
        </div>
      </div>
    </LinkButton>
  );
}

export function NavbarSpacer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full h-[calc(3.5rem+var(--safe-area-inset-bottom))] sm:h-12 pointer-events-none",
        className,
      )}
    />
  );
}
