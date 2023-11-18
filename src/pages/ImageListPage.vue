<template>
  <q-page class="">
    <div class="row q-gutter-md">
      <div class="text-h6">国立美術館</div>
      <!--ヘッダー-->
      <div class="row q-gutter-xs">
        <div>
          <uploader :uploaded="uploaded" @research="reSearch" />
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
        <imageCard
          :dataState="rec"
          :deleteDisplay="deleteLock"
          @deleted="reSearch"
        />
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import api from 'src/api/ImageListApi';
import ImageUploader from 'src/components/imagelist/ImageUploader.vue';
import ImageCard from 'src/components/imagelist/ImageCard.vue';
import { useViewSupport } from 'src/utils/viewSupport';
export default defineComponent({
  name: 'image-list-page',
  components: {
    uploader: ImageUploader,
    imageCard: ImageCard,
  },
  setup() {
    const { displayDate } = useViewSupport();
    const records = ref([] as DataState[]);
    const uploaded = ref(false);
    const deleteLock = ref(false);
    const search = async function () {
      records.value.splice(0);

      await api.search().then((res) => {
        if (res) {
          console.log('search', res);
          res.records.forEach((it) =>
            records.value.push({
              id: it.id,
              fileName: it.fileName,
              ext: it.ext,
              title: it.title,
              detail: it.detail,
              createAt: displayDate(it.createAt),
              updateAt: displayDate(it.updateAt),
            })
          );
          records.value.reverse(); //とりあえず追加順
        }
      });
    };
    search();

    const reSearch = function () {
      search();
      console.log('research called');
    };

    return { records, uploaded, search, deleteLock, reSearch };
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
