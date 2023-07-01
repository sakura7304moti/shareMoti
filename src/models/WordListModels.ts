import { useQuasar } from 'quasar';
import api from 'src/api/WordListApi';
import { ref } from 'vue';

export function useWordListModel() {
  const quasar = useQuasar();
  const saveModalShow = ref(false);
  const condition = ref({
    word: '',
    desc: '',
  } as ConditionState);

  const records = ref([] as DataState[]);

  //function
  const isLoading = ref(false);
  const search = async function () {
    isLoading.value = true;
    const request = {
      word: condition.value.word,
      desc: condition.value.desc,
    } as ConditionState;

    await api
      .search(request)
      .then((response) => {
        if (response) {
          console.log('response', response);

          records.value.splice(0);
          response.records.forEach((rec) =>
            records.value.push({
              word: rec.word ?? '',
              desc: rec.desc ?? '',
            })
          );
        }
      })
      .catch((e) => {
        console.log(e);
        /*
        quasar.notify({
          color: 'red',
          position: 'top',
          message: 'データの取得に失敗しました',
        });*/
      });
    isLoading.value = false;
  };

  const isSaveLoading = ref(false);
  const insertCondition = ref({
    word: '',
    desc: '',
  } as ConditionState);
  const save = async function (word: string, desc: string) {
    if (word != '' || desc != '') {
      isSaveLoading.value = true;
      const request = {
        word: word,
        desc: desc,
      } as ConditionState;
      await api
        .save(request)
        .then((response) => {
          if (response) {
            console.log('response', response);

            //追加した場合
            if (response.insert) {
              /*
            quasar.notify({
              color: 'blue',
              position: 'top',
              message: '追加完了しました',
            });*/
              records.value.push({
                word: word,
                desc: desc,
              });
              saveModalShow.value = false;
            }

            //更新した場合
            if (response.update) {
              /*
            quasar.notify({
              color: 'blue',
              position: 'top',
              message: '更新完了しました',
            });*/
              const index = records.value.findIndex((it) => it.word == word);
              records.value[index] = {
                word: word,
                desc: desc,
              };
              saveModalShow.value = false;
            }
          }
        })
        .catch((e) => {
          console.log(e);
          /*
          quasar.notify({
            color: 'red',
            position: 'top',
            message: 'データの取得に失敗しました',
          });*/
        });
      isSaveLoading.value = false;
    }
  };

  const isDeleteLoading = ref(false);
  const deleteRecord = async function (word: string, desc: string) {
    isDeleteLoading.value = true;
    const request = {
      word: word,
      desc: desc,
    } as ConditionState;

    await api
      .delete(request)
      .then((response) => {
        if (response) {
          console.log('response', response);

          //削除成功した場合
          if (response.status) {
            /*
            quasar.notify({
              color: 'blue',
              position: 'top',
              message: '削除完了しました',
            });*/
            const index = records.value.findIndex((it) => it.word == word);
            records.value.splice(index, 1);
          } else {
            /*
            quasar.notify({
              color: 'red',
              position: 'top',
              message: 'データの削除に失敗しました',
            });*/
          }
        }
      })
      .catch((e) => {
        console.log(e);
        /*
        quasar.notify({
          color: 'red',
          position: 'top',
          message: 'データの取得に失敗しました',
        });*/
      });
    isDeleteLoading.value = false;
  };

  return {
    condition,
    saveModalShow,
    records,
    search,
    isLoading,
    insertCondition,
    save,
    isSaveLoading,
    deleteRecord,
    isDeleteLoading,
  };
}

interface ConditionState {
  word: string;
  desc: string;
}

interface DataState {
  word: string;
  desc: string;
}
