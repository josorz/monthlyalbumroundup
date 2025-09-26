import {
  ChevronUp,
  ChevronDown,
  ThumbsUp,
  Trash2,
  Plus,
  ArrowUpToLine,
} from "lucide-react";

type SearchFn = (query: string) => Promise<Album | null>;

export const EditList = ({
  albums,
  setAlbums,
  search,
}: {
  albums: Album[] | null;
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
  search: SearchFn;
}) => {
  const moveUp = (index: number) => {
    if (!albums) return;
    if (index === 0) return; // Already at the top
    const newAlbums = [...albums];
    [newAlbums[index - 1], newAlbums[index]] = [
      newAlbums[index],
      newAlbums[index - 1],
    ];
    setAlbums(newAlbums);
  };

  const moveDown = (index: number) => {
    if (!albums) return;
    if (index === albums.length - 1) return; // Already at the bottom
    const newAlbums = [...albums];
    [newAlbums[index], newAlbums[index + 1]] = [
      newAlbums[index + 1],
      newAlbums[index],
    ];
    setAlbums(newAlbums);
  };

  const moveToTop = (index: number) => {
    if (!albums) return;
    if (index === 0) return;
    const newAlbums = [...albums];
    const [albumToMove] = newAlbums.splice(index, 1); // Remove the album
    newAlbums.unshift(albumToMove); // Add it to the start
    setAlbums(newAlbums);
  };

  const toggleLike = (index: number) => {
    if (!albums) return;
    const newAlbums = [...albums];
    const album = newAlbums[index];

    album.like = !album.like;

    setAlbums(newAlbums);

    console.log(album);
  };

  const deleteAlbum = (index: number) => {
    if (!albums) return;
    const newAlbums = albums.filter((_, i) => i !== index); // Remove album
    setAlbums(newAlbums);
  };

  return (
    <div className="flex flex-col m-2 w-full">
      <div className="rounded-md bg-black my-1">
        <div className="block -translate-x-1 -translate-y-1 rounded-md border-2 border-black bg-green-200 h-full sm:h-150 sm:overflow-y-auto">
          <h2 className="text-3xl text-center m-2 font-semibold">Album List</h2>
          {albums ? (
            <div className="flex flex-row flex-wrap border-black border-1">
              {albums.map((album, index) => (
                <div className="w-full flex justify-between p-2 items-center border-black border-1">
                  <div className="flex flex-col">
                    <button onClick={() => moveUp(index)}>
                      <ChevronUp className="hover:text-green-500" />
                    </button>
                    <button onClick={() => moveDown(index)}>
                      <ChevronDown className="hover:text-green-500" />
                    </button>
                  </div>
                  <div className="flex-1 ml-2 pr-1">
                    <p className="leading-none text-lg font-semibold">
                      {album.name}
                    </p>
                    <p className="text-md">{album.artist.name}</p>
                  </div>
                  <div className="min-w-fit">
                    <button
                      className="hover:text-green-500"
                      onClick={() => moveToTop(index)}
                    >
                      <ArrowUpToLine strokeWidth={1} />
                    </button>
                    <button
                      className={`hover:text-green-500 ${
                        album?.like ? "text-green-500" : ""
                      }`}
                      onClick={() => toggleLike(index)}
                    >
                      <ThumbsUp strokeWidth={album?.like ? 2 : 1} />
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
      <div className="rounded-md bg-black mt-3">
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
                if (!prev) return [album];
                if (prev.some((a) => a?.id === album.id)) return prev;
                return [...prev, album];
              });

              form.reset();
            }}
          >
            <label className="block px-2 pb-2 text-xl text-center font-semibold">
              Missing Albums? Add to list
            </label>
            <div className="flex w-full gap-2">
              <input
                type="text"
                placeholder="Search album"
                className="flex-1 border px-2 py-1 w-full"
              />
              <button
                type="submit"
                className="px-1 text-black hover:text-green-500"
              >
                <Plus />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
