import { APIClient, PageResult } from './BaseApi';

export class TwitterApi extends APIClient {
  public search(
    request: TwitterRequest
  ): Promise<PageResult<TwitterResponse> | null> {
    const url = '/twitter/search';
    const path = this.combineUrl(this.apiEndpoint(), url);

    return this.httpPost<TwitterRequest, PageResult<TwitterResponse>>(
      path,
      request
    );
  }

  public holoList(): Promise<Array<string> | null> {
    const url = '/twitter/hololist';
    const path = this.combineUrl(this.apiEndpoint(), url);

    return this.httpGet<Array<string>>(path);
  }
}

const api = new TwitterApi();
export default api;

/*
 *interfaces
 */
export interface TwitterRequest {
  page_no: number | null;
  page_size: number | null;
  hashtag: string | null;
  start_date: string | null;
  end_date: string | null;
  user_name: string | null;
  min_like: number | null;
  max_like: number | null;
}
export interface TwitterResponse {
  hashtag: string;
  mode: string;
  url: string;
  date: string;
  images: Array<string>;
  userId: string;
  userName: string;
  likeCount: number;
}
