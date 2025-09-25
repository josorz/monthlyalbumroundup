type Album = {
  id: string;
  images: Image[];
  name: string;
  artist: Artist;
  like?: boolean;
};

interface AlbumResponse {
  album_type: string;
  total_tracks: number;
  id: string;
  images: Image[];
  name: string;
  artists: Artist[];
  like?: boolean;
}

interface Track {
  album: Album;
  artists: Artist[];
  id: string;
  name: string;
}

interface Artist {
  id: string;
  name: string;
  albums?: Album[];
}

interface Image {
  url: string;
  height: number;
  width: number;
}
