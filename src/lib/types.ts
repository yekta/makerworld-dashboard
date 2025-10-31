export type TStatResponse = {
  user: TUser;
  models: TModel[];
  latest_batch: number;
};

export type TUser = {
  stats: { current: TUserStat; delta_1h: TUserStat; delta_24h: TUserStat };
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
  model_id: number;
  title: string;
  image: string;
  stats: {
    current: TModelStat;
    delta_1h: TModelStat;
    delta_24h: TModelStat;
  };
};

export type TModelStat = {
  prints: number;
  downloads: number;
  boosts: number;
  likes: number;
  comments: number;
};
