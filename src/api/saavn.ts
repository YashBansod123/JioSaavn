const BASE_URL = "https://saavn.sumit.co/api";

export type SaavnSong = {
  id: string;
  name: string;
  primaryArtists?: string;
  image?: { quality: string; url: string }[];
  downloadUrl?: { quality: string; url: string }[];
};

export async function searchSongs(query: string, page: number = 1) {
  const url = `${BASE_URL}/search/songs?query=${encodeURIComponent(
    query
  )}&page=${page}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch songs");

  const json = await res.json();

  // ✅ correct response path
  const results = json?.data?.results ?? [];
  const total = json?.data?.total ?? 0;

  return { results: results as SaavnSong[], total };
}

export function getBestImage(song: SaavnSong) {
  if (!song.image || song.image.length === 0) return "";
  return song.image[song.image.length - 1]?.url ?? "";
}

export function getBestAudioUrl(song: SaavnSong) {
  if (!song.downloadUrl || song.downloadUrl.length === 0) return "";
  return song.downloadUrl[song.downloadUrl.length - 1]?.url ?? "";
}
