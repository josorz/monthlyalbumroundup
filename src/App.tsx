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
  const [topArtists, setTopArtists] = useState("");
  const [recentAlbums, setRecentAlbums] = useState("");
  const code = new URLSearchParams(window.location.search).get("code");
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

    const node = canvasRef.current;

    // Save original transform
    const originalTransform = node.style.transform;

    // Remove scale temporarily
    node.style.transform = "none";

    // Wait for all images inside to load
    const images = node.querySelectorAll("img");
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
      const canvas = await html2canvas(node, {
        useCORS: true,
        allowTaint: false,
        logging: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        scale: 1.33, // optional: high-resolution capture
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "albums.png";
      link.click();
    } catch (err) {
      console.error("Capture failed:", err);
    } finally {
      // Restore original scale
      node.style.transform = originalTransform;
    }
  };

  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4">
        Display your Spotify profile data
      </h1>

      <div className="w-full h-full flex justify-center">
        <div className="flex flex-col md:flex-row max-w-4xl">
          <div className="flex-1 flex flex-col ">
            <div className="">
              <Canvas
                recentAlbums={recentAlbums}
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
