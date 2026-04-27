export function buildGoogleReviewUrl(placeId?: string | null): string {
  if (!placeId?.trim()) {
    return "";
  }
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
}
