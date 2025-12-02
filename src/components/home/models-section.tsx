"use client";

import ModelCard from "@/components/model-card";
import { useStats } from "@/components/providers/stats-provider";
import {
  MODEL_ORDER_DEFAULT,
  MODEL_ORDER_KEY,
  MODEL_SORT_DEFAULT,
  MODEL_SORT_KEY,
  TModelOrderEnum,
  TModelSortEnum,
} from "@/lib/constants";
import { parseAsStringEnum, useQueryState } from "nuqs";
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
          Couldn't load model stats :(
        </p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Models models={data.models} />
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="w-full flex flex-wrap justify-center">{children}</div>;
}

function Models({
  models,
}: {
  models: NonNullable<ReturnType<typeof useStats>["data"]>["models"];
}) {
  const [modelSort] = useQueryState(
    MODEL_SORT_KEY,
    parseAsStringEnum(TModelSortEnum.options).withDefault(MODEL_SORT_DEFAULT)
  );
  const [modelOrder] = useQueryState(
    MODEL_ORDER_KEY,
    parseAsStringEnum(TModelOrderEnum.options).withDefault(MODEL_ORDER_DEFAULT)
  );

  const orderedModels = useMemo(() => {
    if (
      (modelSort === null || modelSort === MODEL_SORT_DEFAULT) &&
      (modelOrder === null || modelOrder === MODEL_ORDER_DEFAULT)
    ) {
      return models;
    }

    if (modelSort === "print_24h") {
      return [...models].sort((a, b) => {
        const aPrints = a.stats["delta_0-24h"].prints ?? 0;
        const bPrints = b.stats["delta_0-24h"].prints ?? 0;
        if (modelOrder === "asc") {
          return aPrints - bPrints;
        }
        return bPrints - aPrints;
      });
    }

    if (modelSort === "print_current") {
      return [...models].sort((a, b) => {
        const aPrints = a.stats["current"].prints ?? 0;
        const bPrints = b.stats["current"].prints ?? 0;
        if (modelOrder === "asc") {
          return aPrints - bPrints;
        }
        return bPrints - aPrints;
      });
    }
    return models;
  }, [models, modelSort, modelOrder]);

  return orderedModels.map((model) => (
    <ModelCard key={model.model_id} model={model} />
  ));
}
