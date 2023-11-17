<template>
  <q-page class="">
    <div class="text-h6">コラ画像コンテスト</div>
    <q-card style="width: 500px; height: 100px" class="q-pb-md">
      <q-card-section>
        <div class="text-subtitle1">画像アップロード</div>
        <div class="row q-gutter-md">
          <div>
            <uploader />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div v-for="rec in records" :key="rec.id" class="q-pa-md">
      <imageCard :dataState="rec" />
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { APIClient } from 'src/api/BaseApi';
import api from 'src/api/ImageListApi';
import ImageUploader from 'src/components/imagelist/ImageUploader.vue';
import ImageCard from 'src/components/imagelist/ImageCard.vue';
export default defineComponent({
  name: 'image-list-page',
  components: {
    uploader: ImageUploader,
    imageCard: ImageCard,
  },
  setup() {
    const records = ref([] as DataState[]);
    const search = async function () {
      records.value.splice(0);

      await api.search().then((res) => {
        if (res) {
          console.log('search', res);
          res.records.forEach((it) => records.value.push(it));
        }
      });
    };
    search();
    return { records };
  },
});
interface DataState {
  id: number;
  fileName: string;
  ext: string;
  title: string;
  detail: string;
  createAt: string;
  updateAt: string;
}
</script>
