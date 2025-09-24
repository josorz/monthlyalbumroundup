export const AlbumCard = ({ album }) => {
  return (
    <div className="m-1.5 flex flex-col items-center rounded-2xl max-w-55 flex-wrap">
      <img
        src={album.images[0].url}
        alt={album.name}
        className="max-h-55 object-cover shadow-sm"
      />
      <div className="mt-2 text-center max-w-full">
        <p className="font-bold text-3xl   truncate text-wrap">{album.name}</p>
        <p className="text-2xl text-gray-600">{album.artists[0].name}</p>
      </div>
    </div>
  );
};
