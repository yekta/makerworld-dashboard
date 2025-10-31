import { appLocale } from "@/lib/constants";

export function timeAgo(timestamp: number) {
  const now = Date.now();
  const secondsAgo = Math.floor((now - timestamp) / 1000);

  if (secondsAgo < 60) {
    return `${Math.floor(secondsAgo)}s`;
  } else if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    const remainingSeconds = secondsAgo % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    const remainingMinutes = Math.floor((secondsAgo % 3600) / 60);
    return `${hours}h ${remainingMinutes}m`;
  } else {
    const days = Math.floor(secondsAgo / 86400);
    const remainingHours = Math.floor((secondsAgo % 86400) / 3600);
    return `${days}d ${remainingHours}h`;
  }
}
