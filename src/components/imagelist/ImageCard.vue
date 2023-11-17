<template>
  <q-card class="image-tweet-card">
    <q-card-section>
      <div class="text-h6 text-bold text-grey-4" v-if="state.title == ''">
        タイトル無し
      </div>
      <div class="text-h6 text-bold" v-else>{{ state.title }}</div>
      <q-separator />
      <img :src="downloadUrl" style="width: 100%" />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { APIClient } from 'src/api/BaseApi';
export default defineComponent({
  name: 'image-list-tweet',
  props: {
    dataState: {
      type: Object as PropType<DataState>,
      required: true,
    },
  },
  setup(props) {
    const state = ref(props.dataState);
    const client = new APIClient();
    const downloadUrl = ref(
      `${client.apiEndpoint()}/imageList/download?fileName=${
        props.dataState.fileName
      }&ext=${props.dataState.ext}`
    );

    return { state, downloadUrl };
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
.image-tweet-card {
  width: 300px;
  height: 300px;
}
</style>
