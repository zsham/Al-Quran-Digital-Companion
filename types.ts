
export interface JuzData {
  id: number;
  name: string;
  arabicName: string;
  startSurah: string;
  endSurah: string;
  link: string;
  description: string;
}

export interface InsightState {
  loading: boolean;
  content: string;
  error: string | null;
}

export interface Verse {
  number: number;
  text: string;
  surah: {
    name: string;
    englishName: string;
  };
  numberInSurah: number;
}

export interface ReadingState {
  loading: boolean;
  verses: Verse[];
  error: string | null;
}
