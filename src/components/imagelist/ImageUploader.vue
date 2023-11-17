<template>
  <q-btn
    round
    icon="cloud_upload"
    dense
    text-color="primary"
    @click="modalView = true"
  />
  <q-dialog v-model="modalView">
    <q-card class="q-pa-sm" id="image-upload-dialog-card">
      <q-card-section>
        <div class="text-h6 q-pb-md">画像アップロード</div>
        <div class="q-pb-md">
          <q-input
            v-model="condition.title"
            label="タイトル(省略可)"
            stack-label
            dense
          />
          <q-input
            type="textarea"
            v-model="condition.detail"
            label="詳細(省略可)"
            stack-label
            dense
          />
        </div>

        <div class="row q-gutter-md">
          <div>
            <q-file
              v-model="file"
              :url="uploadUrl"
              label="画像を選んでね"
              stack-label
              dense
              style="max-width: 300px"
            />
          </div>
          <div>
            <q-btn
              text-color="primary"
              round
              icon="upload"
              @click="fileUpload"
              :disable="file.size == null"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { APIClient } from '../../api/BaseApi';
import api from '../../api/ImageListApi';
import { useQuasar } from 'quasar';
export default defineComponent({
  name: 'image-list-uploader',
  setup() {
    const modalView = ref(false);
    const client = new APIClient();
    const uploadUrl = ref(client.apiEndpoint() + '/imageList/upload');
    const file = ref({} as File);
    const condition = ref({
      fileName: '',
      ext: '',
      title: '',
      detail: '',
    } as insertRec);

    const quasar = useQuasar();

    const fileUpload = async function () {
      if (file.value) {
        await api.upload(file.value).then(async (res) => {
          if (res) {
            console.log('upload', res);
            condition.value.fileName = res.fileName.split('.')[0];
            condition.value.ext = res.fileName.split('.')[1];
            //この後insertの処理を書く
            console.log('request', condition.value);
            await api
              .insert({
                fileName: condition.value.fileName,
                ext: condition.value.ext,
                title: condition.value.title,
                detail: condition.value.detail,
              })
              .then((res) => {
                if (res) {
                  console.log('insert', res);
                  if (res.success) {
                    quasar.notify({
                      color: 'primary',
                      position: 'top',
                      message: '画像追加したわよ！',
                    });
                    api.search().then((res) => console.log(res));
                    condition.value.fileName = '';
                    condition.value.ext = '';
                    condition.value.title = '';
                    condition.value.detail = '';
                  } else {
                    quasar.notify({
                      color: 'red',
                      position: 'top',
                      message: 'アップロード失敗した...',
                    });
                  }
                }
              })
              .catch((e) => {
                console.log(e);

                quasar.notify({
                  color: 'red',
                  position: 'top',
                  message: 'アップロード失敗した...',
                });
              });
          }
        });
      }
    };
    return { condition, modalView, file, uploadUrl, fileUpload };
  },
});
interface insertRec {
  fileName: string;
  ext: string;
  title: string;
  detail: string;
}
</script>
<style>
#image-upload-dialog-card {
  min-width: 500px;
  max-width: 1000px;
  min-height: 500px;
  max-height: 700px;
}
</style>
