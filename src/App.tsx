import { useEffect, useState, useRef } from "react";
import {
  getAccessToken,
  redirectToAuthCodeFlow,
  inferTopAlbums,
} from "./utils";
import axios from "axios";
import { AlbumCard } from "./components/AlbumCard";
import { EditList } from "./components/EditList";
import { Canvas } from "./components/Canvas";
import html2canvas from "html2canvas-pro";

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState("");
  const [topArtists, setTopArtists] = useState("");
  const [recentAlbums, setRecentAlbums] = useState("");
  const [topAlbums, setTopAlbums] = useState("");
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = "3282c62f0e874c96bf95b45ec885b56b";
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    async function fetchData() {
      if (!code) {
        redirectToAuthCodeFlow(clientId);
      } else {
        try {
          const accessToken = await getAccessToken(clientId, code);
          const profileData = await fetchProfile(accessToken);
          setProfile(profileData);
          requestSongData(accessToken);
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    }

    fetchData();
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

  const requestSongData = async (token: string) => {
    try {
      const [recentlyPlayedRes, topArtistsRes, topSongsRes] = await Promise.all(
        [
          axios.get(
            "https://api.spotify.com/v1/me/player/recently-played?limit=50",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          axios.get(
            "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=15",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          axios.get(
            "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]
      );

      const recentlyPlayed = recentlyPlayedRes.data.items;
      const topArtists = topArtistsRes.data.items;
      const topSongs = topSongsRes.data.items;

      setRecentlyPlayed(recentlyPlayed);
      const { recentlyPlayedAlbums, albumsFromTopSongs, probableArtists } =
        inferTopAlbums({
          recentlyPlayed,
          topArtists,
          topSongs,
        });
      setRecentAlbums([...recentlyPlayedAlbums, ...albumsFromTopSongs]);
      setTopArtists(probableArtists);
      return { recentlyPlayed, topArtists, topSongs };
    } catch (err) {
      console.error("Error fetching song data:", err);
    }
  };

  const handleCapture = async () => {
    if (!canvasRef.current) return;

    // Ensure all images inside the container are loaded
    const images = canvasRef.current.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) resolve();
            else img.onload = () => resolve();
            img.onerror = () => resolve(); // ignore broken images
          })
      )
    );

    try {
      const canvas = await html2canvas(canvasRef.current, {
        useCORS: true, // important for cross-origin images
        allowTaint: false,
        logging: true,
        scrollX: 0,
        scrollY: -window.scrollY, // ensures correct viewport capture
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "albums.png";
      link.click();
    } catch (err) {
      console.error("Capture failed:", err);
    }
  };

  return (
    <div className="">
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

      <div className="w-full h-full flex justify-center">
        <div className="flex flex-col md:flex-row max-w-4xl">
          <div className="flex-1 flex flex-col ">
            <div className="">
              <Canvas
                recentAlbums={recentAlbums}
                topAlbums={topAlbums}
                topArtists={topArtists}
                ref={canvasRef}
              />
            </div>

            <button
              onClick={handleCapture}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save Image
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <EditList
              albums={recentAlbums}
              setAlbums={setRecentAlbums}
              topArtists={topArtists}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
