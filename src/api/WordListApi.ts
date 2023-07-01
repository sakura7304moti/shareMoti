import { APIClient } from './BaseApi';

export class WordListApi extends APIClient{
  //検索
  public search(
    request:WordListRequest
  ):Promise<WordListResponse | null>{
    const url = '/wordList/search';
    const path = this.combineUrl(url);

    return this.httpPost<WordListRequest,WordListResponse>(path,request)
  }

  //追加・更新
  public save(
    request:WordListRequest
  ):Promise<WordListSaveResponse | null>
  {
    const url = '/wordList/save';
    const path = this.combineUrl(url);

    return this.httpPost<WordListRequest,WordListSaveResponse>(path,request)
  }

  //削除
  public delete(
    request:WordListRequest
  ):Promise<WordListDeleteResponse | null>{
    const url = '/wordList/delete';
    const path = this.combineUrl(url);

    return this.httpPost<WordListRequest,WordListDeleteResponse>(path,request)
  }
}

const api  = new WordListApi();
export default api;

/*
 *interfaces
 */
export interface WordListRequest{
  word:string | null;
  desc:string | null;
}

export interface WordListResponse{
  records : Array<WordListRec>
}

interface WordListRec{
  word:string | null;
  desc:string | null;
}

export interface WordListSaveResponse{
  insert:boolean,
  update:boolean
}

export interface WordListDeleteResponse{
  status:boolean
}
