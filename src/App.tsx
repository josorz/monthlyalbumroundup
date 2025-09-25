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
import { Button } from "./components/Button";
import { Download } from "lucide-react";
import { MissingArtistAlbums } from "./components/MissingArtistAlbums";

function App() {
  const [topArtists, setTopArtists] = useState("");
  const [recentAlbums, setRecentAlbums] = useState(null);
  const [token, setToken] = useState("");
  const code = new URLSearchParams(window.location.search).get("code");
  const canvasRef = useRef<HTMLDivElement>(null);
  const clientId = "3282c62f0e874c96bf95b45ec885b56b";

  useEffect(() => {
    const load = async () => {
      if (!code) {
        return;
      } else {
        try {
          const accessToken = await getAccessToken(clientId, code);
          setToken(accessToken);
          requestSongData();
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    };

    load();
  }, [code]);

  useEffect(() => {
    if (!token) return;
    requestSongData(); // now it will always run with the updated token
  }, [token]);

  const requestSongData = async () => {
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

      const probableArtistsAlbumsMap = await Promise.all(
        probableArtists?.map(async (artist) => {
          const response = await axios.get(
            `https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return {
            artistId: artist.id,
            name: artist.name,
            albums: response.data.items,
          };
        }) || []
      );
      // Merge recent albums (already known)
      const allRecentAlbums = [...recentlyPlayedAlbums, ...albumsFromTopSongs];
      setRecentAlbums(allRecentAlbums);

      // Create a Set of recent album IDs for fast lookup
      const recentAlbumIds = new Set(allRecentAlbums.map((a) => a.id));

      // Filter out albums that are already in recent albums
      const filteredArtistsAlbums = probableArtistsAlbumsMap.map(
        ({ artistId, name, albums }) => ({
          artistId,
          name,
          albums: albums.filter((album) => !recentAlbumIds.has(album.id)),
        })
      );

      // Optional: flatten if you want just a single albums array instead of grouped by artist
      // const flattenedFilteredAlbums = filteredArtistsAlbums.flatMap(a => a.albums);

      // Store grouped structure (artistId → filtered albums)
      setTopArtists(filteredArtistsAlbums);
      return { recentlyPlayed, topArtists, topSongs };
    } catch (err) {
      console.error("Error fetching song data:", err);
    }
  };

  const searchAlbum = async (param: string) => {
    try {
      const { data } = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          param
        )}&type=album&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data?.albums?.items?.[0] ?? null;
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
        backgroundColor: null,
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
    <div className="min-h-screen bg-background bg-emerald-100 bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:60px_60px]">
      {token ? (
        <div>
          <div className="flex justify-center items-center px-5 pt-2">
            {topArtists.length > 0 ? (
              <MissingArtistAlbums
                topArtists={topArtists}
                setTopArtists={setTopArtists}
                setAlbums={setRecentAlbums}
              />
            ) : null}
          </div>
          <div className="flex justify-center px-2">
            <div className="flex flex-col max-w-4xl w-full items-center sm:flex-row md:gap-4">
              <div className="flex-1 flex flex-col items-center">
                <div className="pointer-events-none select-none">
                  <Canvas
                    recentAlbums={recentAlbums}
                    topArtists={topArtists}
                    ref={canvasRef}
                  />
                </div>

                <button onClick={handleCapture} className="rounded-md bg-black">
                  <span className="block -translate-x-1 -translate-y-1 rounded-md border-2 border-black bg-green-600 px-6 py-2 text-xl transition-all hover:translate-x-0 hover:translate-y-0">
                    <div className="flex flex-row gap-2">
                      <Download /> <span>Save Image</span>
                    </div>
                  </span>
                </button>
              </div>
              <div className="flex-1 flex justify-center ">
                <EditList
                  albums={recentAlbums}
                  setAlbums={setRecentAlbums}
                  topArtists={topArtists}
                  setTopArtists={setTopArtists}
                  search={searchAlbum}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen gap-5 max-w-screen p-3">
          <h1 className="text-6xl font-bold sm:text-center">
            Monthly Album Roundup
          </h1>
          <button
            onClick={() => {
              redirectToAuthCodeFlow(clientId);
            }}
            className="rounded-md bg-black"
          >
            <span className="block -translate-x-1 -translate-y-1 rounded-md border-2 border-black bg-green-600 px-6 py-2 text-xl transition-all hover:translate-x-0 hover:translate-y-0">
              Get Spotify Info
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
