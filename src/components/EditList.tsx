import { AlbumCard } from "./AlbumCard";
import {
  ChevronUp,
  ChevronDown,
  Trophy,
  ThumbsUp,
  Trash2,
  Plus,
  Cross,
  X,
  ArrowUpToLine,
} from "lucide-react";
import { useEffect, useState } from "react";

export const EditList = ({
  albums,
  setAlbums,
  topArtists,
  setTopArtists,
  search,
}) => {
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

  const deleteArtist = (index) => {
    const newArtists = topArtists.filter((_, i) => i !== index); // Remove album
    setTopArtists(newArtists);
  };

  return (
    <div className="flex flex-col m-4 w-full">
      {topArtists.length > 0 ? (
        <div className="rounded-md bg-black my-2">
          <div className="block -translate-x-1 -translate-y-1 rounded-md border-2 border-black bg-green-200">
            <h2 className="text-md font-normal p-1">
              Top artists with no top/recent songs:
            </h2>
            {topArtists.map((artist, index) => (
              <form
                key={artist.artistId}
                className="flex w-full flex-1 justify-between items-center p-2"
                onSubmit={(e) => {
                  e.preventDefault();

                  const form = e.currentTarget; // the form element
                  const select = form.querySelector("select"); // find the <select> inside
                  const selectedId = select?.value; // get selected album id
                  if (!selectedId) return;

                  // find album object (if you want full album, not just id)
                  const album = artist.albums.find((a) => a.id === selectedId);
                  if (!album) return;

                  // check if album already in list
                  setAlbums((prev) => {
                    if (prev.some((a) => a.album.id === album.id)) return prev; // already exists
                    return [...prev, { album: album }];
                  });
                }}
              >
                <div className="w-full sm:flex sm:flex-row">
                  <div className="flex-1">
                    <label className="font-semibold w-full truncate sm:w-2">
                      {artist.name}
                    </label>
                  </div>
                  <select className="pl-2 w-full truncate flex-2 md:max-w-50">
                    <option value="" disabled selected></option>
                    {artist.albums.map((album) => (
                      <option key={album.id} value={album.id}>
                        Add "{album.name}"
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col-reverse sm:flex-row">
                  <button type="submit" className="p-0.5 text-black ">
                    <Plus />
                  </button>
                  <button
                    onClick={(e) => {
                      deleteArtist(index);
                    }}
                    className="p-0.5 text-black "
                  >
                    <X />
                  </button>
                </div>
              </form>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-md bg-black my-2">
        <div className="block -translate-x-1 -translate-y-1 rounded-md border-2 border-black bg-green-200 h-full sm:h-150 sm:overflow-y-auto">
          <h2 className="text-2xl text-center m-3 font-semibold">
            Edit Album List
          </h2>
          <hr className="border-black pb-3" />
          {albums ? (
            <div className="flex flex-row flex-wrap">
              {albums.map(({ album }, index) => (
                <div className="w-full flex justify-between p-2 items-center">
                  <div className="flex flex-row">
                    <div className="flex flex-col">
                      <button onClick={() => moveUp(index)}>
                        <ChevronUp className="hover:text-green-500" />
                      </button>
                      <button onClick={() => moveDown(index)}>
                        <ChevronDown className="hover:text-green-500" />
                      </button>
                    </div>
                    <div className="ml-2 pr-1">
                      <p className="text-md">{album.name}</p>
                      <p className="text-xs">{album.artists[0].name}</p>
                    </div>
                  </div>
                  <div className="min-w-fit">
                    <button
                      className="hover:text-green-500"
                      onClick={() => moveToTop(index)}
                    >
                      <ArrowUpToLine strokeWidth={1} />
                    </button>
                    <button>
                      <ThumbsUp strokeWidth={1} />
                    </button>
                    <button onClick={() => deleteAlbum(index)}>
                      <Trash2 strokeWidth={1} className="hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="rounded-md bg-black">
        <div className="block -translate-x-1 -translate-y-1 rounded-md border-2 border-black bg-green-200 px-2 py-2">
          <form
            className="w-full"
            onSubmit={async (e) => {
              e.preventDefault();

              const form = e.currentTarget;
              const input = form.querySelector("input");
              const searchParam = input?.value;
              if (!searchParam) return;

              const album = await search(searchParam);
              if (!album) return;

              setAlbums((prev) => {
                if (prev.some((a) => a.album.id === album.id)) return prev;
                return [...prev, { album }];
              });

              form.reset();
            }}
          >
            <label className="block px-2 pb-2 text-xl text-center font-semibold">
              Add to list
            </label>
            <div className="flex w-full gap-2">
              <input
                type="text"
                placeholder="Search album"
                className="flex-1 border px-2 py-1 w-full"
              />
              <button type="submit" className="px-1 text-black">
                <Plus />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
