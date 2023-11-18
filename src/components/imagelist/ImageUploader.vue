<template>
  <div class="row q-gutter-xs">
    <div>
      <q-btn
        round
        icon="cloud_upload"
        dense
        text-color="primary"
        @click="modalView = true"
      />
    </div>

    <a
      href="#"
      class="q-pt-sm q-pr-md image-list-button-text"
      @click.prevent="modalView = true"
      style="text-decoration: none"
      >画像のアップロード</a
    >
  </div>

  <q-dialog v-model="modalView">
    <q-card class="q-pa-sm" id="image-upload-dialog-card">
      <q-card-section>
        <div class="text-h6 q-pb-md">画像アップロード</div>
        <div class="q-pb-md">
          <q-input
            v-model="condition.title"
            label="タイトル(省略可・後で変更可能)"
            stack-label
            dense
            class="text-subtitle1 text-bold"
          />
          <q-input
            type="textarea"
            v-model="condition.detail"
            label="詳細(省略可・後で変更可能)"
            stack-label
            dense
            class="text-caption"
          />
        </div>

        <div>
          <q-file
            v-model="file"
            :url="uploadUrl"
            label="ここをクリックして画像を選択"
            dense
            :clearable="file.size != null"
            style="width: 300px"
          />
        </div>
        <div class="row q-gutter-xs q-pt-md q-pb-md" v-if="file.size != null">
          <div>
            <q-btn
              text-color="primary"
              round
              icon="cloud_upload"
              @click="fileUpload"
            />
          </div>
          <div class="q-pt-sm text-grey-6 q-pr-md">アップロードする</div>
        </div>

        <!--画像-->
        <div class="image-tweet-card-img" v-if="imgUrl != ''">
          <img :src="imgUrl" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { APIClient } from '../../api/BaseApi';
import api from '../../api/ImageListApi';
import { useQuasar } from 'quasar';
import { watch } from 'vue';
export default defineComponent({
  name: 'image-list-uploader',
  props: {
    uploaded: {
      type: Boolean,
    },
  },
  setup() {
    const modalView = ref(false);
    const client = new APIClient();
    const uploadUrl = ref(client.apiEndpoint() + '/imageList/upload');
    const imgUrl = ref('');
    const file = ref({} as File);

    const condition = ref({
      fileName: '',
      ext: '',
      title: '',
      detail: '',
    } as insertRec);

    const quasar = useQuasar();

    watch(file, () => {
      if (file.value) {
        imgUrl.value = URL.createObjectURL(file.value);
      } else {
        imgUrl.value = '';
      }
    });

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

                    modalView.value = false;
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
    return {
      condition,
      modalView,
      file,
      uploadUrl,
      imgUrl,
      fileUpload,
    };
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
