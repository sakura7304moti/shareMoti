import { useQuasar } from 'quasar';
import api, {
  HaikuListInsertRequest,
  HaikuListSearchRequest,
} from 'src/api/HaikuListApi';
import { ref } from 'vue';

export function useHaikuListModel() {
  const quasar = useQuasar();
  const lockIconCondition = ref(false);
  const displayCondition = ref({
    upper: true,
    insert: false,
    update: false,
    delete: false,
  } as DisplayCondition);
  const condition = ref({
    haikuText: '',
    poster: '',
    detailContain: true,
  } as ConditionState);

  const insertCondition = ref({
    first: '',
    second: '',
    third: '',
    poster: '',
    detail: '',
  } as InsertConditionState);

  const updateSelectedCondition = ref({
    id: -1,
    first: '',
    second: '',
    third: '',
    poster: '',
    detail: '',
  } as UpdateConditionState);

  const updateCondition = ref({
    id: -1,
    first: '',
    second: '',
    third: '',
    poster: '',
    detail: '',
  } as UpdateConditionState);

  const LoadingCondition = ref({
    search: false,
    insert: false,
    update: false,
    delete: false,
  } as LoadingCondition);
  const records = ref([] as DataState[]);

  const sortfn = function (a: DataState, b: DataState) {
    if (a.id > b.id) {
      return 1;
    } else {
      return -1;
    }
  };
  const sortRecords = function () {
    records.value.sort(sortfn);
  };

  /*SELECT */
  const search = async function () {
    LoadingCondition.value.search = true;
    const request = {
      id: -1,
      haikuText: '',
      detail: '',
      poster: condition.value.poster,
    } as HaikuListSearchRequest;
    if (condition.value.detailContain) {
      request.detail = condition.value.haikuText;
    } else {
      request.haikuText = condition.value.haikuText;
    }
    await api.search(request).then((response) => {
      if (response) {
        console.log('response', response);
        records.value.splice(0);
        response.forEach((rec) => {
          records.value.push(rec);
        });
        sortRecords();
      }
    });
    quasar.notify({
      color: 'red',
      position: 'top',
      message: 'データの取得に失敗しました',
    });

    LoadingCondition.value.search = false;
  };
  /*INSERT */
  const insertClick = function (rec: DataState) {
    insertCondition.value = JSON.parse(JSON.stringify(rec));
    displayCondition.value.insert = true;
  };
  const insert = async function () {
    insertCondition.value.valitationErr = '';
    if (insertCondition.value.poster) {
      insertCondition.value.valitationErr = '投稿者名を空にはできないよ!';
    }
    if (insertCondition.value.valitationErr == '') {
      const request = {
        first: insertCondition.value.first.replace(/\n/g, ''),
        second: insertCondition.value.second.replace(/\n/g, ''),
        third: insertCondition.value.third.replace(/\n/g, ''),
        poster: insertCondition.value.poster.replace(/\n/g, ''),
        detail: insertCondition.value.detail.replace(/\n/g, ''),
      } as HaikuListInsertRequest;
      LoadingCondition.value.insert = true;
      await api
        .insert(request)
        .then((response) => {
          if (response) {
            console.log('response', response);
            if (response.success) {
              quasar.notify({
                color: 'blue',
                position: 'top',
                message: '追加完了しました',
              });
              //todoこのあとrecordsにも追加する
            }
          }
        })
        .catch((e) => {
          console.log(e);

          quasar.notify({
            color: 'red',
            position: 'top',
            message: 'データの追加に失敗しました',
          });
        });
      LoadingCondition.value.insert = false;
    }
  };

  /*UPDATE */
  const updateClick = function (rec: DataState) {
    updateSelectedCondition.value = JSON.parse(JSON.stringify(rec)); //編集前の表示用
    updateCondition.value = JSON.parse(JSON.stringify(rec)); //編集中
    displayCondition.value.update = true;
  };

  const update = async function () {
    updateCondition.value.valitationErr = '';
    if (updateCondition.value.poster) {
      updateCondition.value.valitationErr = '投稿者名を空にはできないよ!';
    }
    if (updateCondition.value.valitationErr == '') {
      LoadingCondition.value.update = true;
      await api
        .update({
          id: updateSelectedCondition.value.id,
          first: updateCondition.value.first,
          second: updateCondition.value.second,
          third: updateCondition.value.third,
          detail: updateCondition.value.detail,
          poster: updateCondition.value.poster,
        })
        .then((response) => {
          if (response) {
            console.log('response', response);
            if (response.success) {
              //todo更新後recordsに結果を反映させる
              quasar.notify({
                color: 'blue',
                position: 'top',
                message: '更新完了しました',
              });
            }
          }
        })
        .catch((e) => {
          console.log(e);

          quasar.notify({
            color: 'red',
            position: 'top',
            message: 'データの更新に失敗しました',
          });
        });
      LoadingCondition.value.update = false;
    }
  };

  /*DELETE */
  const deleteRecord = async function () {
    await api
      .delete(updateSelectedCondition.value.id)
      .then((response) => {
        if (response) {
          console.log('response', response);
          if (response.success) {
            const index = records.value.findIndex(
              (it) => it.id == updateSelectedCondition.value.id
            );
            records.value.splice(index, 1);
            quasar.notify({
              color: 'blue',
              position: 'top',
              message: '削除完了しました',
            });
          }
        }
      })
      .catch((e) => {
        console.log(e);

        quasar.notify({
          color: 'red',
          position: 'top',
          message: 'データの削除に失敗しました',
        });
      });
  };
  return {
    lockIconCondition,
    displayCondition,
    condition,
    insertCondition,
    updateCondition,
    updateSelectedCondition,
    records,
    search,
    insertClick,
    insert,
    updateClick,
    update,
    deleteRecord,
  };
}

interface DisplayCondition {
  upper: boolean;
  insert: boolean;
  update: boolean;
  delete: boolean;
}

interface LoadingCondition {
  search: boolean;
  insert: boolean;
  update: boolean;
  delete: boolean;
}

interface ConditionState {
  haikuText: string;
  poster: string;
  detailContain: boolean;
}

interface InsertConditionState {
  first: string;
  second: string;
  third: string;
  poster: string;
  detail: string;
  valitationErr: string;
}

interface UpdateConditionState {
  id: number;
  first: string;
  second: string;
  third: string;
  poster: string;
  detail: string;
  valitationErr: string;
}

interface DataState {
  id: number;
  first: string;
  second: string;
  third: string;
  poster: string;
  detail: string;
  createAt: string;
  updateAt: string;
}
