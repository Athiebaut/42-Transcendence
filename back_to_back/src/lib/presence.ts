const lastSeen: Map<number, number> = new Map();

export function setLastSeen(userId: number) {
  lastSeen.set(userId, Date.now());
}

export function isOnline(userId: number, thresholdMs = 60_000) {
  const ts = lastSeen.get(userId);
  if (!ts) return false;
  return Date.now() - ts <= thresholdMs;
}

export function getLastSeen(userId: number) {
  return lastSeen.get(userId) ?? null;
}

export default {
  setLastSeen,
  isOnline,
  getLastSeen,
};
