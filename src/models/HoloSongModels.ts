import { useQuasar } from 'quasar';
import api from 'src/api/HoloSongApi';
import { ref } from 'vue';

export function useHoloSongModel() {
  const quasar = useQuasar();
  const records = ref([] as DataState[]);

  const select = async function () {
    records.value.splice(0);
    await api
      .search()
      .then((response) => {
        if (response) {
          console.log('select', response);
          response.records.forEach((it) => {
            if (it.link.includes('you') && !it.detail.includes('非公開')) {
              records.value.push(it);
            }
          });
          console.log('datastate', records.value);
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
  return {
    quasar,
    records,
    select,
  };
}
interface DataState {
  date: string;
  member: string;
  link: string;
  songName: string;
  detail: string;
}
