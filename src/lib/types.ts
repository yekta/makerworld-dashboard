export type TStatResponse = {
  user: TUserStat;
  models: TModel[];
  latestBatch: number;
};

export type TUserStat = {
  prints: number;
  downloads: number;
  boosts: number;
  followers: number;
  following: number;
  likes: number;
  level: number;
};

export type TModel = {
  modelId: number;
  title: string;
  image: string;
  stats: {
    current: {
      prints: number;
      downloads: number;
      boosts: number;
      likes: number;
      comments: number;
    };
    delta_1h: {
      prints: number;
      downloads: number;
      boosts: number;
      likes: number;
      comments: number;
    };
    delta_24h: {
      prints: number;
      downloads: number;
      boosts: number;
      likes: number;
      comments: number;
    };
  };
};
