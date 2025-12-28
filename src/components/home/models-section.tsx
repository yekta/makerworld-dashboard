"use client";

import {
  useModelOrder,
  useModelSort,
} from "@/components/home/filters-section/hooks";
import ModelCard from "@/components/model-card";
import { useStats } from "@/components/providers/stats-provider";
import { MODEL_ORDER_DEFAULT, MODEL_SORT_DEFAULT } from "@/lib/constants";
import { useMemo } from "react";

const placeholderArray = Array.from({ length: 30 });

export default function ModelsSection() {
  const { data, isPending, isError } = useStats();

  if (!data && isPending) {
    return (
      <Wrapper>
        {placeholderArray.map((_, index) => (
          <ModelCard key={index} isPlaceholder={true} />
        ))}
      </Wrapper>
    );
  }

  if (!data && isError) {
    return (
      <Wrapper>
        <p className="w-full text-center py-2 text-destructive font-semibold">
          {`Couldn't load model stats :(`}
        </p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Models models={data.models} metadata={data.metadata} />
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="w-full flex flex-wrap justify-center">{children}</div>;
}

function Models({
  models,
  metadata,
}: {
  models: NonNullable<ReturnType<typeof useStats>["data"]>["models"];
  metadata: NonNullable<ReturnType<typeof useStats>["data"]>["metadata"];
}) {
  const [modelSort] = useModelSort();
  const [modelOrder] = useModelOrder();

  const orderedModels = useMemo(() => {
    if (
      (modelSort === null || modelSort === MODEL_SORT_DEFAULT) &&
      (modelOrder === null || modelOrder === MODEL_ORDER_DEFAULT)
    ) {
      return models;
    }

    if (modelSort === "created_at") {
      return [...models].sort((a, b) => {
        if (modelOrder === "asc") {
          return (
            new Date(a.model_created_at).getTime() -
            new Date(b.model_created_at).getTime()
          );
        }
        return (
          new Date(b.model_created_at).getTime() -
          new Date(a.model_created_at).getTime()
        );
      });
    }

    const timeframe: keyof (typeof models)[number]["stats"] =
      modelSort === "prints_1h" || modelSort === "boosts_1h"
        ? "delta_0-1h"
        : modelSort === "prints_24h" || modelSort === "boosts_24h"
        ? "delta_0-24h"
        : "current";

    const stat: keyof (typeof models)[number]["stats"][keyof (typeof models)[number]["stats"]] =
      modelSort === "boosts_current" ||
      modelSort === "boosts_1h" ||
      modelSort === "boosts_24h"
        ? "boosts"
        : "prints";

    return [...models].sort((a, b) => {
      const aPrints = a.stats[timeframe][stat] ?? 0;
      const bPrints = b.stats[timeframe][stat] ?? 0;
      if (modelOrder === "asc") {
        return aPrints - bPrints;
      }
      return bPrints - aPrints;
    });
  }, [models, modelSort, modelOrder]);

  return orderedModels.map((model) => (
    <ModelCard key={model.model_id} model={model} metadata={metadata} />
  ));
}
