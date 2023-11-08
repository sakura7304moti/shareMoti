import { useQuasar } from 'quasar';
import api from 'src/api/ImageListApi';
import { ref } from 'vue';
export function useImageListModel() {
  /*プロパティ */
  const quasar = useQuasar();
  const filter = ref('');
  const records = ref([] as DataState[]);
  const insertRecord = ref({
    id: -1,
    fileName: '',
    title: '',
    detail: '',
    createAt: '',
    updateAt: '',
  } as DataState);
  const load = ref({
    search: false,
    insert: false,
    update: false,
    delete: false,
  } as Loading);

  const modal = ref({
    search: false,
    insert: false,
    update: false,
    delete: false,
  } as Loading);

  /*検索 */
  const search = async function () {
    load.value.search = true;
    records.value.splice(0);
    await api
      .search()
      .then((response) => {
        if (response) {
          console.log('search', response);
          response.forEach((it) => records.value.push(it));
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
    load.value.search = false;
  };

  /* 追加*/
  const insert = async function () {
    load.value.insert = true;
    await api
      .insert({
        fileName: insertRecord.value.fileName,
        title: insertRecord.value.title,
        detail: insertRecord.value.detail,
      })
      .then((response) => {
        if (response) {
          if (response.success) {
            quasar.notify({
              color: 'primary',
              position: 'top',
              message: '追加完了！',
            });
          }
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
  };
  return {};
}

export interface DataState {
  id: number;
  fileName: string;
  title: string;
  detail: string;
  createAt: string;
  updateAt: string;
}

interface Loading {
  search: boolean;
  insert: boolean;
  update: boolean;
  delete: boolean;
}
