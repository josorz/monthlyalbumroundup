import { CanvasLayout } from "./CanvasLayout";
import { AlbumCard } from "./AlbumCard";

export const Canvas = ({ recentAlbums, topArtists, ref }) => {
  const albumsArray = Array.isArray(recentAlbums) ? recentAlbums : [];

  const topRow = albumsArray.slice(0, 3);
  const bottomRow = albumsArray.slice(3);
  return (
    <CanvasLayout ref={ref}>
      <h1 className="font-bold capitalize text-[150px] leading-none text-center mb-2">
        MONTHLY ALBUM ROUNDUP
      </h1>
      <h2 className="font-semibold capitalize text-[36px] leading-none text-center mb-7">
        September 2025
      </h2>
      <main>
        <div className="">
          {/* Top row: bigger cards, dynamic width */}
          <div className="flex justify-center">
            <div className="grid grid-flow-row-dense grid-cols-3">
              {topRow.map(({ album }) => (
                <div key={album.id} className="">
                  <AlbumCard album={album} />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom rows: normal cards, 5 per row */}
          <div className="grid grid-flow-row-dense grid-cols-5">
            {bottomRow.map(({ album }) => (
              <div key={album.id}>
                <AlbumCard album={album} size="small" />
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="h-10 font-bold text-3xl text-center mb-[10px]">
        monthlyalbumroundup.vercel.app
      </footer>
    </CanvasLayout>
  );
};
