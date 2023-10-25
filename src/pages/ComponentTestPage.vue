<template>
  <q-page class="">
    <div class="q-pb-md text-h5">Component Test Page</div>
    <word-list-table v-model="filter" :height="pageHeight" />
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import WordListTable from 'components/tables/WordListTable.vue';
export default defineComponent({
  name: 'component-test',
  components: {
    'word-list-table': WordListTable,
  },
  setup() {
    const pageHeight = ref(document.documentElement.scrollHeight * 0.75);
    return {
      filter: ref(''),
      pageHeight,
    };
  },
});
</script>
