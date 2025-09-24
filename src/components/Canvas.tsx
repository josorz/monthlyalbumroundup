import { CanvasLayout } from "./CanvasLayout";
import { AlbumCard } from "./AlbumCard";

export const Canvas = ({ recentAlbums, topAlbums, topArtists }) => {
  return (
    <CanvasLayout>
      <h1 className="font-bold capitalize text-[80px] text-center mb-[10px]">
        MONTHLY ALBUM ROUNDUP
      </h1>
      {/* <>{JSON.stringify(recentlyPlayed)}</> */}
      <div className="align-center">
        <>
          {recentAlbums ? (
            <div className="grid grid-flow-row-dense grid-cols-5">
              {recentAlbums.map(({ album }) => (
                <AlbumCard album={album} />
              ))}
            </div>
          ) : (
            ""
          )}
        </>
      </div>
      <footer className="h-10 bg-blue-500 font-bold text-3xl text-center mb-[10px]">
        monthlyalbumroundup.vercel.app
      </footer>
    </CanvasLayout>
  );
};
