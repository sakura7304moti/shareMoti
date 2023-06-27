import { useQuasar } from 'quasar';
import api, { TwitterRequest } from 'src/api/TwitterApi';
import { selectItem } from 'src/types/selectorType';
import { ref } from 'vue';

export function useTwitterModel() {
  //yyyy/mm/dd
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}/${month}/${day}`;

  //val
  const quasar = useQuasar();
  const condition = ref({
    pageNo: 1,
    pageSize: 40,
    hashtag: '',
    startDate: '',
    endDate: formattedDate,
    userName: '',
    minLike: 100,
    maxLike: 0,
  } as ConditionState);

  const fetchedCondition = ref({
    pageNo: 0,
    pageSize: 40,
    hashtag: '',
    startDate: '',
    endDate: formattedDate,
    userName: '',
    minLike: 100,
    maxLike: 0,
  } as ConditionState);

  const dataState = ref({
    totalPages: 0,
    records: [] as TwitterRecord[],
  } as DataState);

  const holoList = ref([] as string[]);

  const dateModalShow = ref(false);

  const selectItems = [
    {
      label: '未指定',
      value: 0,
    },
    {
      label: '100',
      value: 100,
    },
    {
      label: '1000',
      value: 1000,
    },
    {
      label: '5000',
      value: 5000,
    },
    {
      label: '10000',
      value: 10000,
    },
    {
      label: '20000',
      value: 20000,
    },
    {
      label: '50000',
      value: 50000,
    },
  ] as Array<selectItem>;

  //function
  const getHoloList = async function () {
    holoList.value.splice(0);
    await api
      .holoList()
      .then((response) => {
        //console.log('response', response);
        response?.forEach((res) => holoList.value.push(res));
      })
      .catch((e) => {
        console.log(e);
        quasar.notify({
          color: 'red',
          position: 'top',
          message: 'データの取得に失敗しました',
        });
      });
  };

  const dateToString = function (date: string) {
    if (date) {
      return date.replaceAll('/', '-');
    } else {
      return '';
    }
  };

  const isLoading = ref(false);
  //検索条件変わっていたらページを1にする
  const compareCondition = function () {
    if (condition.value.hashtag != fetchedCondition.value.hashtag) {
      condition.value.pageNo = 1;
    }
    if (condition.value.startDate != fetchedCondition.value.startDate) {
      condition.value.pageNo = 1;
    }
    if (condition.value.endDate != fetchedCondition.value.endDate) {
      condition.value.pageNo = 1;
    }
    if (condition.value.userName != fetchedCondition.value.userName) {
      condition.value.pageNo = 1;
    }
    if (condition.value.minLike != fetchedCondition.value.minLike) {
      condition.value.pageNo = 1;
    }
    if (condition.value.maxLike != fetchedCondition.value.maxLike) {
      condition.value.pageNo = 1;
    }
  };
  const search = async function () {
    isLoading.value = true;
    dataState.value.records.splice(0);
    compareCondition(); //検索条件変わったらページ数1にする
    const request = {
      page_no: condition.value.pageNo,
      page_size: condition.value.pageSize,
      hashtag: condition.value.hashtag,
      start_date: dateToString(condition.value.startDate),
      end_date: dateToString(condition.value.endDate),
      user_name: condition.value.userName,
      min_like: condition.value.minLike,
      max_like: condition.value.maxLike,
      displayMenu: false,
    } as TwitterRequest;

    await api
      .search(request)
      .then((response) => {
        if (response) {
          console.log('response', response);

          dataState.value.totalPages = response.totalPages;

          response.records.forEach((rec) => {
            rec.images.forEach((r) => {
              dataState.value.records.push({
                hashtag: rec.hashtag,
                mode: rec.mode,
                url: rec.url,
                date: rec.date,
                image: r,
                userId: rec.userId,
                userName: rec.userName,
                likeCount: rec.likeCount,
              } as TwitterRecord);
            });
          });

          const c: ConditionState = JSON.parse(JSON.stringify(condition.value));
          fetchedCondition.value = {
            hashtag: c.hashtag,
            startDate: c.startDate,
            endDate: c.endDate,
            userName: c.userName,
            minLike: c.minLike,
            maxLike: c.maxLike,
            pageNo: c.pageNo,
            pageSize: c.pageSize,
          };
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

  const imageLinkOpen = function (url: string) {
    window.open(url);
  };

  return {
    condition,
    dataState,
    search,
    isLoading,
    holoList,
    getHoloList,
    dateModalShow,
    selectItems,
    imageLinkOpen,
  };
}
interface ConditionState {
  pageNo: number;
  pageSize: number;
  hashtag: string;
  startDate: string;
  endDate: string;
  userName: string;
  minLike: number | null;
  maxLike: number | null;
}
interface TwitterRecord {
  hashtag: string;
  mode: string;
  url: string;
  date: string;
  image: string;
  userId: string;
  userName: string;
  likeCount: number;
  displayMenu: boolean;
}
interface DataState {
  totalPages: number;
  records: Array<TwitterRecord>;
}
