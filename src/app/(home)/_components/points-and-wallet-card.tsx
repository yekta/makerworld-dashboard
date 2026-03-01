import { useStats } from "@/components/providers/stats-provider";
import {
  exclusivePointsToUsd,
  regularPointsToUsd,
} from "@/lib/calculate-points";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export default function PointsAndWalletCard() {
  const { data, isPending, isError } = useStats();

  const kmbtFormatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short", // uses K, M, B…
    maximumSignificantDigits: 4,
  });

  const balanceValue = useMemo(() => {
    if (!data && !isPending && isError) return "Error";
    if (isPending) return "1,001";
    if (data.pointsAndWallet.wallet_balance !== null && data.redemptions) {
      return "$" + kmbtFormatter.format(data.pointsAndWallet.wallet_balance);
    }
    return "N/A";
  }, [data, isPending, isError]);

  const pendingBalanceValue = useMemo(() => {
    if (!data && !isPending && isError) return "Error";
    if (isPending) return "$101.1";
    if (data.redemptions) {
      const pendingCurrencyRedemptions = data.redemptions.filter(
        (redemption) =>
          redemption.audit_status === 1 && redemption.redeem_cash_amount > 0,
      );
      const pendingCurrencyRedemptionsAmount =
        pendingCurrencyRedemptions.reduce(
          (sum, redemption) => sum + redemption.redeem_cash_amount,
          0,
        );
      return `$${kmbtFormatter.format(pendingCurrencyRedemptionsAmount)}`;
    }
    return "N/A";
  }, [data, isPending, isError]);

  return (
    <div
      data-pending={isPending ? true : undefined}
      data-error={!data && !isPending && isError ? true : undefined}
      className="w-full flex items-center justify-center overflow-hidden group"
    >
      <Column
        label="Exclusive"
        value={
          !data && !isPending && isError
            ? "Error"
            : isPending
              ? "1,001"
              : data.pointsAndWallet.exclusive_points !== null
                ? kmbtFormatter.format(data.pointsAndWallet.exclusive_points)
                : "N/A"
        }
        subtitle={
          !data && !isPending && isError
            ? "Error"
            : isPending
              ? "$101.1"
              : data.pointsAndWallet.exclusive_points !== null
                ? `$${kmbtFormatter.format(
                    exclusivePointsToUsd(data.pointsAndWallet.exclusive_points),
                  )}`
                : "N/A"
        }
        className="items-end"
        classNameText="text-right"
      />
      <div className="w-px py-px shrink-0 flex items-center justify-center self-stretch">
        <div className="w-full bg-border h-full rounded-full" />
      </div>
      <Column
        label="Regular"
        value={
          !data && !isPending && isError
            ? "Error"
            : isPending
              ? "1,001"
              : data.pointsAndWallet.regular_points !== null
                ? kmbtFormatter.format(data.pointsAndWallet.regular_points)
                : "N/A"
        }
        subtitle={
          !data && !isPending && isError
            ? "Error"
            : isPending
              ? "$101.1"
              : data.pointsAndWallet.regular_points !== null
                ? `$${kmbtFormatter.format(
                    regularPointsToUsd(data.pointsAndWallet.regular_points),
                  )}`
                : "N/A"
        }
        className="items-center"
        classNameText="text-center"
      />
      <div className="w-px py-px shrink-0 flex items-center justify-center self-stretch">
        <div className="w-full bg-border h-full rounded-full" />
      </div>
      <Column
        label="Balance"
        value={balanceValue}
        subtitle={pendingBalanceValue}
        className="items-start"
        classNameText="text-left"
      />
    </div>
  );
}

function Column({
  label,
  value,
  subtitle,
  className,
  classNameText,
}: {
  label: string;
  value: string;
  subtitle: string;
  className?: string;
  classNameText?: string;
}) {
  return (
    <div
      className={cn(
        "shrink min-w-0 max-w-32 flex flex-col items-center px-3 gap-0.75",
        className,
      )}
    >
      <p
        className={cn(
          "max-w-full group-data-pending:text-transparent group-data-pending:bg-muted-more-foreground group-data-pending:animate-pulse group-data-pending:rounded whitespace-nowrap min-w-0 overflow-ellipsis overflow-hidden text-xs text-muted-foreground",
          classNameText,
          "leading-tight",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "max-w-full group-data-pending:text-transparent group-data-pending:bg-muted-foreground group-data-pending:animate-pulse group-data-pending:rounded group-data-error:text-destructive whitespace-nowrap min-w-0 font-semibold overflow-hidden overflow-ellipsis font-mono text-sm",
          classNameText,
          "leading-tight",
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "max-w-full font-mono group-data-pending:text-transparent group-data-pending:bg-muted-more-foreground group-data-pending:animate-pulse group-data-pending:rounded whitespace-nowrap min-w-0 overflow-ellipsis overflow-hidden text-xs text-muted-foreground",
          classNameText,
          "leading-tight",
        )}
      >
        {subtitle}
      </p>
    </div>
  );
}
