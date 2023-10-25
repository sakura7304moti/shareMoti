<template>
  <q-page class="">
    <custom-table v-model="filter" />
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import HaikuList from 'components/HaikuList.vue';
export default defineComponent({
  name: 'component-test',
  components: {
    'custom-table': HaikuList,
  },
  setup() {
    const pageHeight = ref(document.documentElement.scrollHeight * 0.85);
    return {
      filter: ref(''),
      pageHeight,
    };
  },
});
</script>
