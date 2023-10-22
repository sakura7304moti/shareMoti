import { QTableColumn, useQuasar } from 'quasar';
import api from 'src/api/SsbuListApi';
import { NameListApi } from 'src/api/NameListApi';
import { ref } from 'vue';

export function useSsbuListModel() {
  const { names, ssbuNames, getName, searchName, getSsbuNames } =
    useNameModel();
  const quasar = useQuasar();
  const filter = ref('');
  const selectId = ref(-1);

  const columns = [
    {
      name: 'charName',
      label: 'キャラ名',
      field: 'charName',
      sortable: true,
    },
    {
      name: 'displayFileName',
      label: 'タイトル',
      field: 'displayFileName',
      sortable: true,
    },
    {
      name: 'displayDate',
      label: '日付',
      field: 'displayDate',
      sortable: true,
    },
    {
      name: 'year',
      label: '区分',
      field: 'year',
      sortable: true,
    },
  ] as QTableColumn[];
  const load = ref({
    search: false,
    download: false,
  } as Loading);
  const records = ref([] as DataState[]);
  const dateList = ref([] as string[]);

  const splitName = function (fileName: string) {
    if (fileName.includes('_')) {
      const split = fileName.split('_');
      return split[0];
    } else {
      return '';
    }
  };

  const getDisplayFileName = function (fileName: string) {
    if (fileName.includes('_')) {
      const split = fileName.split('_');
      if (split.length == 2) {
        return split[1];
      } else {
        return fileName;
      }
    } else {
      return fileName;
    }
  };

  const search = async function () {
    load.value.search = true;
    await searchName();

    await api
      .search()
      .then((res) => {
        if (res) {
          console.log('search', res);
          records.value.splice(0);
          res.records.forEach((it) => {
            const displayDate = it.date.replaceAll('_', '');
            let displayFileName = getDisplayFileName(it.fileName);

            /*キャラ名の取得 */
            let charName = '';
            const spName = splitName(it.fileName);
            names.value.forEach((n) => {
              if (n.key == spName) {
                charName = n.val;
              }
            });

            /*キャラ名が空なら表示用ファイル名はそのまま表示させる */
            if (spName == '') {
              displayFileName = it.fileName;
            }

            records.value.push({
              id: it.id,
              charName: charName,
              fileName: it.fileName,
              displayFileName: displayFileName,
              date: it.date,
              displayDate: displayDate,
              year: it.year,
            });
            if (!dateList.value.includes(displayDate)) {
              dateList.value.push(displayDate);
            }
          });
          dateList.value.sort();
          dateList.value.reverse();

          records.value.reverse();
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
    selectId,
    columns,
    load,
    records,
    dateList,
    ssbuNames,
    search,
    getSsbuNames,
  };
}

function useNameModel() {
  const nameApi = new NameListApi();
  const names = ref([] as nameState[]);
  const searchName = async function () {
    names.value.splice(0);

    await nameApi.search({ key: '', val: '' }).then((response) => {
      if (response) {
        console.log('name', response);
        response.records.forEach((it) =>
          names.value.push({ key: it.key ?? '', val: it.val ?? '' })
        );
      }
    });
  };

  const getName = function (name: string) {
    names.value.forEach((it) => {
      if (name == it.key) {
        return it.val;
      }
    });
    return '';
  };

  const ssbuNames = ref([] as string[]);
  const getSsbuNames = async function () {
    ssbuNames.value.splice(0);

    await nameApi.ssbu_names().then((res) => {
      if (res) {
        res.forEach((it) => ssbuNames.value.push(it));
      }
    });
  };

  return {
    //あだな一覧とスマブラのキャラ名の一覧を取得
    names,
    searchName,
    getSsbuNames,
    ssbuNames,
    getName,
  };
}

interface nameState {
  key: string;
  val: string;
}

interface Loading {
  search: boolean;
  download: boolean;
}

interface DataState {
  id: number;
  charName: string;
  fileName: string;
  displayFileName: string;
  date: string;
  displayDate: string;
  year: string;
}
