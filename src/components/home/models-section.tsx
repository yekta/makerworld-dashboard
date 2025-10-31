"use client";

import ModelCard from "@/components/model-card";
import { useStats } from "@/components/providers/stats-provider";

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
      {data.models.map((model) => (
        <ModelCard key={model.model_id} model={model} />
      ))}
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-wrap mt-4 md:mt-6 justify-center">
      {children}
    </div>
  );
}
