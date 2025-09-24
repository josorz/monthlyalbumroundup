export const AlbumCard = ({ album, size = "large" }) => {
  // size can be "large" or "small"
  const isLarge = size === "large";

  return (
    <div
      className={`
        m-1.5 flex flex-col items-center rounded-2xl flex-wrap
      `}
    >
      <img
        src={album.images[1].url}
        alt={album.name}
        crossOrigin="anonymous"
        className={`
          object-cover shadow-sm
          ${isLarge ? "" : "max-h-55"}
        `}
      />
      <div className="mt-2 text-center max-w-full">
        <p
          className={`
            font-bold truncate text-wrap
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
