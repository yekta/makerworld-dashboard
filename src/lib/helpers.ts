export function timeAgo(timestamp: number) {
  const now = Date.now();
  const secondsAgo = Math.floor((now - timestamp) / 1000);

  if (secondsAgo < 60) {
    return `00m ${Math.floor(secondsAgo).toString().padStart(2, "0")}s`;
  } else if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    const remainingSeconds = secondsAgo % 60;
    return `${minutes.toString().padStart(2, "0")}m ${remainingSeconds
      .toString()
      .padStart(2, "0")}s`;
  } else if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    const remainingMinutes = Math.floor((secondsAgo % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}h ${remainingMinutes
      .toString()
      .padStart(2, "0")}m`;
  } else {
    const days = Math.floor(secondsAgo / 86400);
    const remainingHours = Math.floor((secondsAgo % 86400) / 3600);
    return `${days.toString().padStart(2, "0")}d ${remainingHours
      .toString()
      .padStart(2, "0")}h`;
  }
}
