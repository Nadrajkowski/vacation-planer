export function extractEmbedUrl(mapsUrl: string): string | null {
  if (!mapsUrl) return null;

  // Standard URL with coordinates: @lat,lng
  const coordMatch = mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch) {
    return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed&zoom=15`;
  }

  // /place/NAME/ pattern
  const placeMatch = mapsUrl.match(/\/place\/([^/@?]+)/);
  if (placeMatch) {
    const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
  }

  // ?q= parameter
  const qMatch = mapsUrl.match(/[?&]q=([^&]+)/);
  if (qMatch) {
    return `https://maps.google.com/maps?q=${qMatch[1]}&output=embed`;
  }

  return null;
}
