import { AlbumCard } from "./AlbumCard";
import { ChevronUp, ChevronDown, Trophy, ThumbsUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export const EditList = ({ albums, setAlbums, topArtists }) => {
  const [selected, setSelected] = useState(null);

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
      {topArtists
        ? topArtists.map((artist) => (
            <form
              key={artist.artistId}
              className="w-full flex justify-between items-center p-2 border-b"
              onSubmit={(e) => {
                e.preventDefault();

                const form = e.currentTarget; // the form element
                const select = form.querySelector("select"); // find the <select> inside
                const selectedId = select?.value; // get selected album id
                if (!selectedId) return;

                // find album object (if you want full album, not just id)
                const album = artist.albums.find((a) => a.id === selectedId);
                console.log("albumss");
                console.log(album);
                if (!album) return;

                // check if album already in list
                console.log(albums);
                setAlbums((prev) => {
                  if (prev.some((a) => a.album.id === album.id)) return prev; // already exists
                  return [...prev, { album: album }];
                });
              }}
            >
              <div>
                <p className="font-semibold">{artist.name}</p>
              </div>

              <div className="flex items-center gap-2">
                <select>
                  <option value="">-- Select an album --</option>
                  {artist.albums.map((album) => (
                    <option key={album.id} value={album.id}>
                      {album.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Add
                </button>
              </div>
            </form>
          ))
        : null}

      {albums ? (
        <div className="flex flex-row flex-wrap">
          {albums.map(({ album }, index) => (
            <div className="w-full flex justify-between p-2">
              <div className="flex flex-row">
                <div className="flex flex-col">
                  <button onClick={() => moveUp(index)}>
                    <ChevronUp className="hover:text-red-500" />
                  </button>
                  <button onClick={() => moveDown(index)}>
                    <ChevronDown className="hover:text-red-500" />
                  </button>
                </div>
                <div className="ml-4">
                  <p className="">{album.name}</p>
                  <p className="">{album.artists[0].name}</p>
                </div>
              </div>
              <div className="min-w-fit">
                <button onClick={() => moveToTop(index)}>
                  <Trophy strokeWidth={1} />
                </button>
                <button>
                  <ThumbsUp strokeWidth={1} />
                </button>
                <button
                  className="hover:text-blue"
                  onClick={() => deleteAlbum(index)}
                >
                  <Trash2 strokeWidth={1} className="hover:text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
