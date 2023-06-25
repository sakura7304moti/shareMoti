<template>
  <q-page class="">
    <div class="q-pb-md"></div>
    <!--Todo 検索するところ -->
    <!--Todo レコード追加 -->
    <q-table
      dense
      title="名言集"
      :rows="records"
      :columns="columns"
      separator="cell"
    />
  </q-page>
</template>
<script lang="ts">
import { QTableProps } from 'quasar';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ssbu-wordlist',
  setup() {
    const columns: QTableProps['columns'] = [
      {
        name: 'word',
        label: '名言',
        field: 'word',
        sortable: true,
      },
      {
        name: 'desc',
        label: '解説',
        field: 'desc',
        sortable: true,
      },
    ];
    const records = [] as DataState[];
    return { records, columns };
  },
});
interface DataState {
  word: string; //名言
  desc: string | null; //解説(省略可能)
}
</script>
