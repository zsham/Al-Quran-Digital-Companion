
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
