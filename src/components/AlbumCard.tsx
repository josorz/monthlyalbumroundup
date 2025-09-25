import { ThumbsUp } from "lucide-react";

export const AlbumCard = ({ album, size = "large", like }) => {
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
          src={album.images[1].url}
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
        font-bold truncate text-wrap leading-none
        ${isLarge ? "text-3xl" : "text-lg"}
      `}
        >
          {album.name}
        </p>
        <p
          className={
            isLarge
              ? "text-wrap text-2xl text-gray-600"
              : "text-wrap text-sm text-gray-600"
          }
        >
          {album.artists[0].name}
        </p>
      </div>
    </div>
  );
};
