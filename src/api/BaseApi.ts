import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
//API呼び出しのためのクラス
export class APIClient {
  public apiEndpoint = 'http://192.168.11.40:5000';
  public localEndpoint = 'http://127.0.0.1:5000/';
  public config = {
    headers: {
      'Content-Type': 'application/json',
    },
  } as AxiosRequestConfig;

  //URL結合
  public combineUrl(url: string, endpoint: string): string {
    return url + endpoint;
  }
  //http post
  public async httpPost<T, U>(url: string, request: T): Promise<U | null> {
    try {
      const res: AxiosResponse<string> = await axios.post<
        T,
        AxiosResponse<string>
      >(url, request, this.config);

      const r = JSON.parse(res.data);
      return r;
    } catch {
      return null;
    }
  }

  //http get
  public async httpGet<T>(url: string): Promise<T | null> {
    try {
      const res: AxiosResponse<string> = await axios.get<
        T,
        AxiosResponse<string>
      >(url);

      const r = JSON.parse(res.data);
      return r;
    } catch {
      return null;
    }
  }
}

export interface PageResult<T> {
  records: Array<T>;
  totalPages: number;
}
