<template>
  <q-card class="image-tweet-card">
    <q-card-section>
      <!--タイトル-->
      <div class="text-h6 text-bold text-grey-4" v-if="state.title == ''">
        タイトル無し
      </div>
      <div class="text-h6 text-bold" v-else>{{ state.title }}</div>

      <!--画像-->
      <div class="image-tweet-card-img">
        <img :src="downloadUrl" />
      </div>

      <!--詳細-->
      <div class="image-tweet-card-detail">
        {{ state.detail }}
      </div>
      <q-separator />

      <!--ボタン一覧-->
      <div class="row q-gutter-xs q-pt-md">
        <div>
          <q-btn
            round
            dense
            icon="download"
            text-color="primary"
            @click="fileDownload(downloadUrl)"
          />
        </div>
        <a
          :href="downloadUrl"
          class="q-pt-sm q-pr-md image-list-button-text"
          @click.prevent="fileDownload(downloadUrl)"
          style="text-decoration: none"
          >ダウンロード</a
        >
        <div>
          <imageUpdate :data-state="state" :download-url="downloadUrl" />
        </div>
        <div v-if="deleteDisplay">
          <imageDelete :data-state="state" :download-url="downloadUrl" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import { APIClient } from 'src/api/BaseApi';
import { useViewSupport } from 'src/utils/viewSupport';
import ImageUpdate from './ImageUpdate.vue';
import ImageDelete from 'src/components/imagelist/ImageDelete.vue';
export default defineComponent({
  name: 'image-list-tweet',
  props: {
    dataState: {
      type: Object as PropType<DataState>,
      required: true,
    },
    deleteDisplay: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    imageUpdate: ImageUpdate,
    imageDelete: ImageDelete,
  },
  setup(props) {
    const { fileDownload } = useViewSupport();
    const state = ref(props.dataState);
    const deleteView = computed(() => props.deleteDisplay);
    const client = new APIClient();
    const downloadUrl = ref(
      `${client.apiEndpoint()}/imageList/download?fileName=${
        props.dataState.fileName
      }&ext=${props.dataState.ext}`
    );

    return {
      state,
      downloadUrl,
      emptyText: ref('詳細無し'),
      fileDownload,
      deleteView,
    };
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

<style>
/*カード全体 */
.image-tweet-card {
  width: 400px;
  height: 550px;
}
/*画像の表示 */
.image-tweet-card-img {
  margin-bottom: 30px;
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  overflow: hidden;
  position: relative;
}
.image-tweet-card-img img {
  position: absolute;
  width: auto;
  height: auto;
  top: 0%;
  left: 50%;
  max-width: 100%;
  max-height: 100%;
  -webkit-transform: translate(-50%, 0%);
  -moz-transform: translate(-50%, 0%);
  -ms-transform: translate(-50%, 0%);
  transform: translate(-50%, 0%);
}
.image-tweet-card-img:after {
  display: block;
  padding-top: 75%;
  content: '';
}
@media screen and (max-width: 768px) {
  .image-tweet-card-img {
    max-width: 300px;
  }
  .image-tweet-card {
    width: 350px;
  }
}

/*詳細 */
.image-tweet-card-detail {
  height: 100px;
  width: 370px;
  overflow: scroll;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: normal;
}
</style>
