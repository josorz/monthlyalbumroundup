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
  params.append(
    "scope",
    "user-read-private user-read-email user-read-recently-played"
  );
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

export const inferTopAlbums = async ({
  recentlyPlayed,
  topArtists,
  topSongs,
}) => {
  // Albums from recently played songs
  let albums = new Map();
  let songs = new Map();
  let albumSongMap = new Map();

  recentlyPlayed.forEach((item) => {
    const album = item.track.album;
    const albumId = album.id;
    const songId = item.track.id;

    if (album.album_type === "album") {
      if (!albumSongMap.has(albumId)) {
        albumSongMap.set(albumId, {
          album: album, // keep full album object
          songs: new Set(), // keep unique song IDs
        });
      }

      albumSongMap.get(albumId).songs.add(songId);
    }
  });

  // Convert Map to array
  let sortedAlbums = Array.from(albumSongMap.values())
    .map(({ album, songs }) => ({
      album,
      uniqueSongs: songs.size,
      totalTracks: album.total_tracks,
      ratio: songs.size / album.total_tracks,
    }))
    .sort((a, b) => b.ratio - a.ratio)
    .filter((song) => song.uniqueSongs > 2);

  // Print results
  sortedAlbums.forEach(({ album, uniqueSongs, totalTracks, ratio }) => {
    console.log(
      `${album.name} → ${uniqueSongs}/${totalTracks} (${(ratio * 100).toFixed(
        1
      )}%)`
    );
  });

  return sortedAlbums;
};
