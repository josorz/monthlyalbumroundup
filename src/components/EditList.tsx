import { AlbumCard } from "./AlbumCard";

export const EditList = ({ albums, setAlbums, topArtists }) => {
  const moveUp = (index) => {
    if (index === 0) return; // Already at the top
    const newAlbums = [...albums];
    [newAlbums[index - 1], newAlbums[index]] = [
      newAlbums[index],
      newAlbums[index - 1],
    ];
    setAlbums(newAlbums);
  };

  const moveDown = (index) => {
    if (index === albums.length - 1) return; // Already at the bottom
    const newAlbums = [...albums];
    [newAlbums[index], newAlbums[index + 1]] = [
      newAlbums[index + 1],
      newAlbums[index],
    ];
    setAlbums(newAlbums);
  };

  const moveToTop = (index) => {
    if (index === 0) return;
    const newAlbums = [...albums];
    const [albumToMove] = newAlbums.splice(index, 1); // Remove the album
    newAlbums.unshift(albumToMove); // Add it to the start
    setAlbums(newAlbums);
  };

  const deleteAlbum = (index) => {
    const newAlbums = albums.filter((_, i) => i !== index); // Remove album
    setAlbums(newAlbums);
  };

  return (
    <div className="m-4 h-xl bg-green-400 overflow-y-auto md:w-xl">
      {albums ? (
        <div className="flex flex-row flex-wrap">
          {albums.map(({ album }, index) => (
            <div className="w-full flex justify-between p-2">
              <div className="flex flex-row">
                <div className="flex flex-col">
                  <button onClick={() => moveUp(index)}>UP</button>
                  <button onClick={() => moveDown(index)}>DOWN</button>
                </div>
                <div className="ml-4">
                  <p className="">{album.name}</p>
                  <p className="">{album.artists[0].name}</p>
                </div>
              </div>
              <div className="">
                <button onClick={() => moveToTop(index)}>Top</button>
                <button>Like</button>
                <button onClick={() => deleteAlbum(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {topArtists ? (
        <div className="flex flex-row flex-wrap">
          <div className="">
            You probably listened to an album by this artist:
          </div>
          {topArtists.map((artist) => (
            <div className="w-full flex justify-between p-2">
              <div className="">
                <p className="">{artist.name}</p>
              </div>
              <div className="">
                <button>Top</button>
                <button>Like</button>
                <button>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
