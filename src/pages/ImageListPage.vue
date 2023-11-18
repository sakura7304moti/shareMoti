<template>
  <q-page class="">
    <div class="row q-gutter-md">
      <div class="text-h6">国立美術館</div>
      <!--ヘッダー-->
      <div class="row q-gutter-xs">
        <div>
          <uploader :uploaded="uploaded" />
        </div>
        <div>
          <q-btn round dense icon="loop" textColor="black" @click="search" />
        </div>
        <a
          href="#"
          class="q-pt-sm image-list-button-text q-pr-md"
          @click.prevent="search"
          style="text-decoration: none"
          >再検索</a
        >
        <div>
          <q-toggle v-model="deleteLock" icon="delete" color="negative" />
        </div>
        <a
          href="#"
          class="q-pt-sm image-list-button-text q-pr-md"
          @click.prevent="deleteLock = !deleteLock"
          style="text-decoration: none"
          >削除アイコン表示</a
        >
      </div>
    </div>

    <!--カード一覧-->
    <div style="display: flex; width: 100%; flex-wrap: wrap">
      <div v-for="rec in records" :key="rec.id" class="q-pa-md">
        <imageCard :dataState="rec" :deleteDisplay="deleteLock" />
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
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
    const uploaded = ref(false);
    const deleteLock = ref(false);
    const search = async function () {
      records.value.splice(0);

      await api.search().then((res) => {
        if (res) {
          console.log('search', res);
          res.records.forEach((it) => records.value.push(it));
          records.value.reverse(); //とりあえず追加順
        }
      });
    };
    search();

    watch(uploaded, () => {
      if (uploaded.value) {
        search();
        uploaded.value = false;
      }
    });
    return { records, uploaded, search, deleteLock };
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
<style lang="scss">
.image-list-button-text {
  color: $grey-6;
}
</style>
