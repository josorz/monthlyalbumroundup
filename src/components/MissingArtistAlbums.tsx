import { Plus, X } from "lucide-react";

export const MissingArtistAlbums = ({
  topArtists,
  setTopArtists,
  setAlbums,
}) => {
  const deleteArtist = (index) => {
    const newArtists = topArtists.filter((_, i) => i !== index); // Remove album
    setTopArtists(newArtists);
  };

  return (
    <div className="rounded-md bg-black my-2 w:full sm:w-4xl">
      <div className="block -translate-x-1 -translate-y-1 rounded-md border-2 border-black bg-green-200">
        <h2 className="text-lg text-center pt-1 font-semibold">
          Add albums from your top artists
        </h2>
        {topArtists.map((artist, index) => (
          <form
            key={artist.artistId}
            className="flex w-full flex-1 justify-between items-center p-2 border-1 border-black"
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

              form.reset();
              select = "";
            }}
          >
            <div className="w-full sm:flex sm:flex-row">
              <div className="min-w-40 text-wrap">
                <label className="font-semibold truncate sm:w-2">
                  {artist.name}
                </label>
              </div>
              <select className="flex pl-2 truncate w-full" defaultValue="">
                <option value="" disabled></option>
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
  );
};
