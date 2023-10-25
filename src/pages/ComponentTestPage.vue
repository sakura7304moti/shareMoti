<template>
  <q-page class="">
    <div class="q-pb-md text-h5">Component Test Page</div>
    <custom-table v-model="filter" :height="pageHeight" />
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import NameListTable from 'components/tables/NameListTable.vue';
export default defineComponent({
  name: 'component-test',
  components: {
    'custom-table': NameListTable,
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
