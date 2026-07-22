/**
 * Strict YouTube Video ID Extractor and Normalizer
 * Catches invalid placeholders (e.g. 'rubber123', 'carbon456', 'mfi_test')
 * Accepts valid 11-character YouTube IDs or full URLs
 */
export function extractYouTubeVideoId(input: string | null | undefined): string | null {
  if (!input) return null;
  const value = input.trim();

  // Known invalid / test / placeholder pattern filter
  const blacklist = ['rubber123', 'carbon456', 'mfi_test', 'xyzabc123', 'dqw4w9wgxcq'];
  if (blacklist.some(b => value.toLowerCase().includes(b))) {
    return null;
  }

  const patterns = [
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

export function getYouTubeCanonicalUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
