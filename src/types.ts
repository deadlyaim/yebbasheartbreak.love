export interface Photo {
  id: string;
  url: string;
  caption: string;
  date?: string;
  location?: string;
}

export interface LyricLine {
  id: string;
  time: number; // in seconds from the start of the song
  text: string;
  highlighted?: boolean;
}
