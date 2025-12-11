export type LeaderboardEntry = {
  rank: number;
  name: string;
  badge: string;
  points: number;
  winRate: string;
  streak: string;
  gradient: string;
};

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "HonkMaster", badge: "HM", points: 1245, winRate: "78%", streak: "+5", gradient: "from-amber-300 to-yellow-200" },
  { rank: 2, name: "GooseValkyrie", badge: "GV", points: 1188, winRate: "74%", streak: "+2", gradient: "from-sky-300 to-indigo-200" },
  { rank: 3, name: "NoisyNova", badge: "NN", points: 1110, winRate: "69%", streak: "+1", gradient: "from-emerald-300 to-teal-200" },
  { rank: 4, name: "PixelOie", badge: "PO", points: 1042, winRate: "66%", streak: "+3", gradient: "from-rose-300 to-pink-200" },
  { rank: 5, name: "LagoonMage", badge: "LM", points: 1004, winRate: "63%", streak: "-1", gradient: "from-violet-300 to-purple-200" },
  { rank: 6, name: "FeatherRush", badge: "FR", points: 984, winRate: "62%", streak: "+4", gradient: "from-orange-300 to-amber-200" },
  { rank: 7, name: "TidalSonic", badge: "TS", points: 942, winRate: "58%", streak: "-2", gradient: "from-blue-300 to-sky-200" },
  { rank: 8, name: "OieFurtive", badge: "OF", points: 931, winRate: "61%", streak: "+1", gradient: "from-cyan-300 to-teal-200" },
  { rank: 9, name: "ArcadeWaddle", badge: "AW", points: 905, winRate: "55%", streak: "+2", gradient: "from-lime-300 to-green-200" },
  { rank: 10, name: "StardustQuack", badge: "SQ", points: 876, winRate: "57%", streak: "+3", gradient: "from-fuchsia-300 to-rose-200" },
];

export type LeagueTier = {
  nameKey: string;
  thresholdKey: string;
  rewardKey: string;
  color: string;
};

export const leagueTiers: LeagueTier[] = [
  {
    nameKey: "dashboard.league.mytho.name",
    thresholdKey: "dashboard.league.mytho.threshold",
    rewardKey: "dashboard.league.mytho.reward",
    color: "from-amber-500/30 to-orange-400/20",
  },
  {
    nameKey: "dashboard.league.saphir.name",
    thresholdKey: "dashboard.league.saphir.threshold",
    rewardKey: "dashboard.league.saphir.reward",
    color: "from-sky-500/30 to-indigo-500/20",
  },
  {
    nameKey: "dashboard.league.roseau.name",
    thresholdKey: "dashboard.league.roseau.threshold",
    rewardKey: "dashboard.league.roseau.reward",
    color: "from-emerald-500/30 to-lime-500/20",
  },
];

export type ActivityItem = {
  icon: string;
  textKey: string;
};

export const activityFeed: ActivityItem[] = [
  { icon: "🎯", textKey: "dashboard.activity.item1" },
  { icon: "🔥", textKey: "dashboard.activity.item2" },
  { icon: "⚡", textKey: "dashboard.activity.item3" },
  { icon: "🛡️", textKey: "dashboard.activity.item4" },
];

export type CampfireStat = {
  icon: string;
  labelKey: string;
  valueKey: string;
  hintKey: string;
};

export const campfireStats: CampfireStat[] = [
  {
    icon: "🔥",
    labelKey: "dashboard.stats.ladder.label",
    valueKey: "dashboard.stats.ladder.value",
    hintKey: "dashboard.stats.ladder.hint",
  },
  {
    icon: "🪶",
    labelKey: "dashboard.stats.feathers.label",
    valueKey: "dashboard.stats.feathers.value",
    hintKey: "dashboard.stats.feathers.hint",
  },
  {
    icon: "🌕",
    labelKey: "dashboard.stats.season.label",
    valueKey: "dashboard.stats.season.value",
    hintKey: "dashboard.stats.season.hint",
  },
  {
    icon: "🛶",
    labelKey: "dashboard.stats.duos.label",
    valueKey: "dashboard.stats.duos.value",
    hintKey: "dashboard.stats.duos.hint",
  },
];

export type HighlightNote = {
  icon: string;
  titleKey: string;
  textKey: string;
  badgeKey: string;
};

export const highlightNotes: HighlightNote[] = [
  {
    icon: "📜",
    titleKey: "dashboard.highlight.bard.title",
    textKey: "dashboard.highlight.bard.text",
    badgeKey: "dashboard.highlight.bard.badge",
  },
  {
    icon: "🧭",
    titleKey: "dashboard.highlight.market.title",
    textKey: "dashboard.highlight.market.text",
    badgeKey: "dashboard.highlight.market.badge",
  },
  {
    icon: "🌿",
    titleKey: "dashboard.highlight.mayor.title",
    textKey: "dashboard.highlight.mayor.text",
    badgeKey: "dashboard.highlight.mayor.badge",
  },
];
