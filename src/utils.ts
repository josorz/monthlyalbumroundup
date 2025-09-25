import axios from "axios";

// DEFAULT FROM SPOTIFY DOCS
export async function redirectToAuthCodeFlow(clientId: string) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "https://127.0.0.1");
  params.append("scope", "user-read-recently-played user-top-read");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(clientId: string, code: string) {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "https://127.0.0.1");
  params.append("code_verifier", verifier!);

  const { data } = await axios.post(
    "https://accounts.spotify.com/api/token",
    params,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  return data.access_token;
}

function generateCodeVerifier(length: number) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/// CUSTOM FUNCTIONS

function getAlbumsFromList(
  items: any[],
  getAlbum: (item: any) => any,
  getSongId: (item: any) => string
) {
  const albumSongMap = new Map<string, { album: any; songs: Set<string> }>();

  items.forEach((item) => {
    const album = getAlbum(item);
    if (album.album_type !== "album") return;

    if (!albumSongMap.has(album.id)) {
      albumSongMap.set(album.id, { album, songs: new Set() });
    }
    albumSongMap.get(album.id)!.songs.add(getSongId(item));
  });

  return Array.from(albumSongMap.values()).map(({ album, songs }) => ({
    album,
    uniqueSongs: songs.size,
    totalTracks: album.total_tracks,
    ratio: songs.size / album.total_tracks,
  }));
}

const getRecentlyPlayedAlbums = (recentlyPlayed: any[]) =>
  getAlbumsFromList(
    recentlyPlayed,
    (i) => i.track.album,
    (i) => i.track.id
  )
    .sort((a, b) => b.ratio - a.ratio)
    .filter((a) => a.uniqueSongs > 2);

const getAlbumsFromTopActivity = (topSongs: any[], topArtists: any[]) => {
  const artistIDs = new Set(topArtists.map((a) => a.id));

  return getAlbumsFromList(
    topSongs,
    (i) => i.album,
    (i) => i.id
  )
    .sort((a, b) => b.ratio - a.ratio)
    .filter(
      (a) =>
        a.uniqueSongs >= 2 ||
        a.album.artists.some((artist: any) => artistIDs.has(artist.id))
    );
};

export const inferTopAlbums = ({
  recentlyPlayed,
  topArtists,
  topSongs,
}: {
  recentlyPlayed: Album[];
  topArtists: Artist[];
  topSongs: Track[];
}) => {
  // Albums from recently played songs
  const recentlyPlayedAlbums = getRecentlyPlayedAlbums(recentlyPlayed);
  const removeFromSecondList = new Set(
    recentlyPlayedAlbums.map((a) => a.album.id)
  );

  // Albums from top songs
  const albumsFromTopSongs = getAlbumsFromTopActivity(
    topSongs,
    topArtists
  ).filter((a) => !removeFromSecondList.has(a.album.id));

  // Remove artists with albums in those two fields
  const albums: Album[] = [...recentlyPlayedAlbums, ...albumsFromTopSongs]
    .map((item) => ({
      id: item.album.id,
      name: item.album.name,
      images: item.album.images,
      artist: item.album.artists[0],
      like: false,
    }))
    .filter(
      (album, index, self) => index === self.findIndex((a) => a.id === album.id)
    );

  const excludeArtistIds = new Set(albums.map((album) => album.artist.id));

  const probableArtists = topArtists.filter(
    (artist) => !excludeArtistIds.has(artist.id)
  );

  return {
    albums,
    probableArtists,
  };
};
