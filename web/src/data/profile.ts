export type StatCardConfig = {
  labelKey: string;
  value: string;
  infoKey: string;
  infoVars?: Record<string, string>;
};

export const statCards: StatCardConfig[] = [
  { labelKey: "profile.stats.games.label", value: "24", infoKey: "profile.stats.games.info", infoVars: { delta: "+8" } },
  { labelKey: "profile.stats.winrate.label", value: "63%", infoKey: "profile.stats.winrate.info", infoVars: { streak: "3" } },
  { labelKey: "profile.stats.goals.label", value: "7.4", infoKey: "profile.stats.goals.info" },
  { labelKey: "profile.stats.playtime.label", value: "3 h 18", infoKey: "profile.stats.playtime.info" },
];

export type RecentMatch = {
  opponent: string;
  score: string;
  modeKey: string;
  resultKey: string;
};

export const recentMatches: RecentMatch[] = [
  { opponent: "GooseValkyrie", score: "10 - 7", modeKey: "profile.match.mode.ranked", resultKey: "profile.match.result.win" },
  { opponent: "LittleGoose", score: "8 - 10", modeKey: "profile.match.mode.friendly", resultKey: "profile.match.result.loss" },
  { opponent: "OieBourrue", score: "9 - 9", modeKey: "profile.match.mode.chaos", resultKey: "profile.match.result.draw" },
  { opponent: "NoisyMallard", score: "10 - 4", modeKey: "profile.match.mode.ranked", resultKey: "profile.match.result.win" },
];

export type FriendActionVariant = "primary" | "secondary" | "muted";

export type FriendStatusEntry = {
  badge: string;
  name: string;
  statusKey: string;
  statusVars?: Record<string, string>;
  actionKey: string;
  actionVariant: FriendActionVariant;
};

export const friendStatus: FriendStatusEntry[] = [
  {
    badge: "GV",
    name: "GooseValkyrie",
    statusKey: "profile.friends.status.playing",
    statusVars: { village: "#248" },
    actionKey: "profile.friends.action.join",
    actionVariant: "primary",
  },
  {
    badge: "LG",
    name: "LittleGoose",
    statusKey: "profile.friends.status.lobby",
    actionKey: "profile.friends.action.invite",
    actionVariant: "secondary",
  },
  {
    badge: "OB",
    name: "OieBourrue",
    statusKey: "profile.friends.status.offline",
    actionKey: "profile.friends.action.sleep",
    actionVariant: "muted",
  },
];
