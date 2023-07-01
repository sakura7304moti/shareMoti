import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useRoute } from 'vue-router';
//API呼び出しのためのクラス
export class APIClient {
  public route = useRoute();
  public apiEndpoint = function () {
    const path = location.origin.replace(':9000', ''); //http:xxx
    return path + ':5000';
  };
  public config = {
    headers: {
      'Content-Type': 'application/json',
    },
  } as AxiosRequestConfig;

  //URL結合
  public combineUrl(endpoint: string): string {
    return this.apiEndpoint() + endpoint;
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
