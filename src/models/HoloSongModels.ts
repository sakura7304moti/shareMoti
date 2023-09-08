import { useQuasar } from 'quasar';
import api from 'src/api/HoloSongApi';
import { ref } from 'vue';

export function useHoloSongModel() {
  const { getVideoId, getImageLink } = subModel();

  const quasar = useQuasar();
  const records = ref([] as DataState[]);
  const pageState = ref({
    selectLink: '',
    pageNo: 1,
    totalPages: 1,
    pageSize: 20,
    records: [] as DataState[],
  } as PageState);

  const isLoading = ref(false);
  const searchOptionShow = ref(false);

  const select = async function () {
    isLoading.value = true;
    records.value.splice(0);
    await api
      .search()
      .then((response) => {
        if (response) {
          //レコードのリスト
          response.records.forEach((it) => {
            if (it.link.includes('you') && !it.detail.includes('非公開')) {
              const addRec = {
                date: it.date,
                member: it.member,
                link: it.link,
                songName: it.songName,
                detail: it.detail,
                imageLink: getImageLink(it.link),
                videoId: getVideoId(it.link),
              } as DataState;
              records.value.push(addRec);
            }
          });
          records.value.reverse();
          console.log('add list', records.value.length);

          //ページング用オブジェクトを準備
          pageState.value.totalPages = Math.ceil(
            records.value.length / pageState.value.pageSize
          );
          selectPage();

          //リスト
          const arr = [...new Set(records.value.map((it) => it.member))];
          console.log(arr);
        }
      })
      .catch((e) => {
        console.log(e);
        quasar.notify({
          color: 'red',
          position: 'top',
          message: 'データの取得に失敗しました',
        });
      });
    isLoading.value = false;
  };

  const selectPage = function () {
    pageState.value.records.splice(0);
    //1ページ目 -> 0 ~ 19
    //2ページ目 -> 20 ~ 39
    //3ページ目 -> 40 ~ 59
    const startIndex =
      Math.max(pageState.value.pageNo - 1, -1) * pageState.value.pageSize;
    const lastIndex = Math.min(
      startIndex + pageState.value.pageSize - 1,
      records.value.length
    );
    records.value.slice(startIndex, lastIndex).forEach((rec) => {
      pageState.value.records.push(rec);
    });
    console.log('data', pageState.value);
  };

  return {
    quasar,
    records,
    pageState,
    isLoading,
    searchOptionShow,
    select,
    selectPage,
  };
}

function subModel() {
  const getVideoId = function (url: string) {
    const v = url.split('v=')[1];
    if (v != undefined) {
      return v;
    } else {
      const s = url.split('/')[url.split('/').length - 1];
      return s;
    }
  };

  const getImageLink = function (url: string) {
    const baseUrl = 'https://img.youtube.com/vi/query/maxresdefault.jpg';
    return baseUrl.replace('query', getVideoId(url));
  };
  return {
    getVideoId,
    getImageLink,
  };
}
interface DataState {
  date: string;
  member: string;
  link: string;
  songName: string;
  detail: string;
  imageLink: string;
  videoId: string;
}
interface PageState {
  selectLink: string;
  pageNo: number;
  totalPages: number;
  pageSize: number;
  records: DataState[];
}
