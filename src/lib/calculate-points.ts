const pointToUsdRatio = 0.066;
const pointsPerBoost = 15;
const pointsPerDownload = 0.48;
const printDownloadMultiplier = 2;

export function calculatePoints({
  prints,
  downloads,
  boosts,
}: {
  prints: number;
  downloads: number;
  boosts: number;
}) {
  const adjustedDownloads = prints * printDownloadMultiplier + downloads;
  const points =
    boosts * pointsPerBoost + adjustedDownloads * pointsPerDownload;
  return points;
}

export function calculateUsdFromPoints(points: number) {
  return points * pointToUsdRatio;
}
