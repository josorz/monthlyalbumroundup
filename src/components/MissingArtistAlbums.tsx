import { Plus, X } from "lucide-react";

export const MissingArtistAlbums = ({
  topArtists,
  setTopArtists,
  albums,
  setAlbums,
}: {
  topArtists: Artist[] | null;
  setTopArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
  albums: Album[];
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
}) => {
  const deleteArtist = (index: number) => {
    if (!topArtists) return;
    const newArtists = topArtists.filter((_, i) => i !== index); // Remove album
    setTopArtists(newArtists);
  };

  return (
    <div className="rounded-md bg-black my-2 w:full sm:w-4xl">
      <div className="block -translate-x-1 -translate-y-1 rounded-md border-2 border-black bg-green-200">
        <h2 className="text-xl text-center pt-1 font-semibold">
          Add albums from your top artists
        </h2>
        {topArtists
          ? topArtists.map((artist, index) => (
              <form
                key={artist.id}
                className="flex w-full flex-1 justify-between items-center p-2 border-1 border-black"
                onSubmit={(e) => {
                  e.preventDefault();

                  const form = e.currentTarget; // the form element
                  let select = form.querySelector<HTMLSelectElement>("select"); // find the <select> inside
                  const selectedId = select?.value; // get selected album id
                  if (!selectedId) return;

                  // find album object (if you want full album, not just id)
                  if (!artist.albums) return;
                  const album = artist.albums.find((a) => a.id === selectedId);
                  if (!album) return;

                  if (!albums.some((a) => a.id === album.id)) {
                    setAlbums([...albums, album]);
                  }

                  form.reset();
                }}
              >
                <div className="w-full sm:flex sm:flex-row">
                  <div className="min-w-40 text-wrap">
                    <label className="truncate sm:w-2">{artist.name}</label>
                  </div>
                  <select className="flex pl-2 truncate w-full" defaultValue="">
                    <option value="" disabled></option>
                    {artist.albums
                      ? artist.albums.map((album) => (
                          <option key={album.id} value={album.id}>
                            Add "{album.name}"
                          </option>
                        ))
                      : null}
                  </select>
                </div>

                <div className="flex flex-col-reverse sm:flex-row">
                  <button
                    type="submit"
                    className="p-0.5 text-black hover:text-green-500"
                  >
                    <Plus />
                  </button>
                  <button
                    onClick={() => {
                      deleteArtist(index);
                    }}
                    className="p-0.5 text-black hover:text-red-500"
                  >
                    <X />
                  </button>
                </div>
              </form>
            ))
          : null}
      </div>
    </div>
  );
};
