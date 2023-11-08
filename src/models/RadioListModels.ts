import { QTableColumn, useQuasar } from 'quasar';
import api from 'src/api/RadioListApi';
import { ref } from 'vue';

export function useRadioListModel() {
  const quasar = useQuasar();
  const filter = ref('');
  const selectId = ref(-1);
  const columns = [
    {
      name: 'fileName',
      label: 'ファイル名',
      field: 'fileName',
      sortable: true,
    },
    {
      name: 'date',
      label: '日付',
      field: 'date',
      sortable: true,
    },
  ] as QTableColumn[];
  const load = ref({
    search: false,
    download: false,
  } as Loading);
  const records = ref([] as DataState[]);
  const dateList = ref([] as string[]);

  const search = async function () {
    load.value.search = true;
    await api
      .search()
      .then((response) => {
        if (response) {
          console.log('search', response);
          records.value.splice(0);
          dateList.value.splice(0);

          response.records.forEach((it) => {
            records.value.push(it);
            if (!dateList.value.includes(it.date.split(' ')[0])) {
              dateList.value.push(it.date.split(' ')[0]);
            }
          });

          records.value.sort((a, b) => (a.date > b.date ? -1 : 1));
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

  return {
    filter,
    columns,
    load,
    records,
    search,
    selectId,
    dateList,
  };
}
interface DataState {
  id: number;
  fileName: string;
  date: string;
}
interface Loading {
  search: boolean;
  download: boolean;
}
