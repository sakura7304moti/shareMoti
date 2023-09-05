<template>
  <q-page class="">
    <div class="q-pb-md">
      <div class="text-h5">ホロライブ歌みたまとめ</div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useHoloSongModel } from 'src/models/HoloSongModels';
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'holosong-page',
  setup() {
    const { quasar, records, select } = useHoloSongModel();
    select();

    return {
      records,
    };
  },
});
</script>
