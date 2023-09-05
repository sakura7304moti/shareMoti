import { APIClient } from './BaseApi';
export class HoloSongApi extends APIClient {
  public search(): Promise<HoloSongResponse | null> {
    const url = '/holoSong/search';
    const path = this.combineUrl(url);

    return this.httpGet<HoloSongResponse>(path);
  }
}

const api = new HoloSongApi();
export default api;
export interface HoloSongResponse {
  records: Array<HoloSongDataState>;
}

interface HoloSongDataState {
  date: string;
  member: string;
  link: string;
  songName: string;
  detail: string;
}
