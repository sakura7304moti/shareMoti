<template>
  <q-page class="">
    <div class="text-h4">名言集</div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ssbu-wordlist',
  setup() {
    const records = [] as DataState[];
    return { records };
  },
});
interface DataState {
  word: string;
  desc: string | null;
}
</script>
