const pointToUsdRatio = 0.066;
const pointsPerBoost = 15;
const pointsPerDownload = 0.48;
const printDownloadMultiplier = 2;

const giftCardPointCost = 490;
const giftCardUsdValue = 40;

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

export function exclusivePointsToUsd(points: number) {
  return points * pointToUsdRatio;
}

export function regularPointsToUsd(points: number) {
  return (points / giftCardPointCost) * giftCardUsdValue;
}
