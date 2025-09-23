import { useEffect, useState } from "react";
import {
  getAccessToken,
  redirectToAuthCodeFlow,
  inferTopAlbums,
} from "./utils";
import axios from "axios";

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState("");
  const [topSongs, setTopSongs] = useState("");
  const [topArtists, setTopArtists] = useState("");
  const [recentAlbums, setRecentAlbums] = useState("");

  useEffect(() => {
    const clientId = "3282c62f0e874c96bf95b45ec885b56b";
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // async function fetchData() {
    //   const now = new Date();
    //   const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    //   const unixTimeFirstDayofMonth = firstDay.getTime();
    //   console.log(unixTimeFirstDayofMonth);
    //   if (!code) {
    //     redirectToAuthCodeFlow(clientId);
    //   } else {
    //     try {
    //       const accessToken = await getAccessToken(clientId, code);
    //       const profileData = await fetchProfile(accessToken);
    //       setProfile(profileData);
    //       console.log("one done");
    //     } catch (err) {
    //       console.error("Error fetching profile:", err);
    //     }
    //   }
    // }
  }, []);

  useEffect(() => {
    const requestSongData = async () => {
      try {
        const [recentlyPlayedRes, topArtistsRes, topSongsRes] =
          await Promise.all([
            axios.get("/src/test1.json"),
            axios.get("/src/test3.json"),
            axios.get("/src/test2.json"),
          ]);

        const recentlyPlayed = recentlyPlayedRes.data.items;
        const topArtists = topArtistsRes.data.items;
        const topSongs = topSongsRes.data.items;

        setRecentlyPlayed(recentlyPlayed);
        console.log(recentlyPlayed, topArtists, topSongs);
        const albums = await inferTopAlbums({
          recentlyPlayed,
          topArtists,
          topSongs,
        });
        setRecentAlbums(albums);
        return { recentlyPlayed, topArtists, topSongs };
      } catch (err) {
        console.error("Error fetching song data:", err);
      }
    };

    requestSongData();
    // then  all unique songs
  }, []);

  async function fetchProfile(token: string): Promise<UserProfile> {
    const { data } = await axios.get<UserProfile>(
      "https://api.spotify.com/v1/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  }

  async function fetchSongs(token: string): Promise<any> {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const unixTimeFirstDayofMonth = firstDay.getTime();
    console.log(unixTimeFirstDayofMonth);

    const { data } = await axios.get<any>(
      `https://api.spotify.com/v1/me/player/recently-played?limit=50&after=${unixTimeFirstDayofMonth}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Display your Spotify profile data
      </h1>

      {profile ? (
        <section id="profile" className="space-y-2">
          <h2 className="text-lg font-semibold">
            Logged in as <span>{profile.display_name}</span>
          </h2>
          {profile.images?.length > 0 && (
            <img
              src={profile.images[0].url}
              alt="Avatar"
              className="w-24 h-24 rounded-full"
            />
          )}
          <ul className="list-disc list-inside">
            <li>User ID: {profile.id}</li>
            <li>Email: {profile.email}</li>
            <li>
              Spotify URI:{" "}
              <a
                href={profile.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {profile.uri}
              </a>
            </li>
            <li>
              Link:{" "}
              <a
                href={profile.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {profile.href}
              </a>
            </li>
            <li>Profile Image URL: {profile.images?.[0]?.url}</li>
          </ul>
        </section>
      ) : (
        <p>Loading profile...</p>
      )}
      {/* <>{JSON.stringify(recentlyPlayed)}</> */}
      <>
        <h1>Recently Played Albums (sure)</h1>
      </>
      <>
        {recentAlbums ? (
          <div className="flex flex-row flex-wrap">
            {recentAlbums.map(({ album }) => (
              <div className="w-24 h-full m-3">
                <br />
                <br />
                <img src={album.images[1].url} />
                <div>
                  <b>{album.name}</b>
                </div>
                <div>{album.artists[0].name}</div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </>
      <h1>Top Songs</h1>
      <>
        {topSongs ? (
          <div className="flex flex-row flex-wrap">
            {topSongs.map((track) => (
              <div className="w-24 h-full m-3">
                <br />
                <br />
                <img src={track.album.images[1].url} />
                <div>{track.name}</div>
                <div>{track.album.artists[0].name}</div>
                <div>
                  {track.album.name} - {track.album.album_type}
                </div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </>
      <h1>Top Artists</h1>
      <>
        {topSongs ? (
          <div className="flex flex-row flex-wrap">
            {topArtists.map((artist) => (
              <div className="w-24 h-full m-3">
                <br />
                <br />
                <img src={artist.images[1].url} />
                <div>{artist.name}</div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </>
    </div>
  );
}

export default App;
