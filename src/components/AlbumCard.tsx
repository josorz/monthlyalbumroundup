import { ThumbsUp } from "lucide-react";

export const AlbumCard = ({
  album,
  size = "large",
}: {
  album: Album;
  size: string;
}) => {
  // size can be "large" or "small"
  const isLarge = size === "large";

  return (
    <div
      className={`
    m-1.5 flex flex-col items-center rounded-2xl flex-wrap
  `}
    >
      <div className="relative">
        <img
          src={album.images?.[1].url}
          alt={album.name}
          crossOrigin="anonymous"
          className={`
        object-cover shadow-sm
        ${isLarge ? "" : "max-h-55"}
      `}
        />
        {album.like ? (
          <ThumbsUp
            className="absolute -top-3 -right-3  text-black"
            size={36}
            fill="#2b7fff"
            strokeWidth={1}
          />
        ) : null}
      </div>

      <div className="mt-2 text-center max-w-full">
        <p
          className={`
        font-bold truncate text-wrap leading-none text-neutral-100 
        ${isLarge ? "text-3xl text-shadow-lg" : "text-lg text-shadow-md"}
      `}
        >
          {album.name}
        </p>
        <p
          className={
            isLarge
              ? "text-wrap text-2xl text-neutral-300 text-shadow-sm"
              : "text-wrap text-sm text-neutral-300 text-shadow-sm"
          }
        >
          {album.artist.name}
        </p>
      </div>
    </div>
  );
};
