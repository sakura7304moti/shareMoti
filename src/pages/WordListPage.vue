<template>
  <q-page class="">
    <div class="form-space row q-gutter-md">
      <!--画面左側-->
      <div>
        <div class="q-pb-md text-h6">名言集</div>
        <div class="row q-gutter-md q-pb-md">
          <q-input
            label="名言"
            v-model="condition.word"
            class="form-model"
            dense
            outlined
            stack-label
          />
          <q-input
            label="詳細"
            v-model="condition.desc"
            class="form-model"
            dense
            outlined
            stack-label
          />
          <q-toggle
            label="追加画面を表示"
            v-model="saveModalShow"
            keep-color
            color="green"
          />
        </div>

        <!--botton-->
        <div class="row q-gutter-md q-pt-md">
          <q-btn
            label="検索"
            color="primary"
            dense
            icon="search"
            @click="search"
            :loading="isLoading"
          />
        </div>
      </div>

      <!--画面右側-->
      <div>
        <!--追加画面-->
        <div v-if="saveModalShow" class="edit-form">
          <div class="text-h6">新規追加</div>
          <div class="row q-gutter-md" style="height: 150px">
            <q-input
              label="名言"
              type="textarea"
              v-model="insertCondition.word"
              class="form-model"
              dense
              outlined
              stack-label
              style="width: 250px"
            />
            <q-input
              label="詳細(省略可)"
              type="textarea"
              v-model="insertCondition.desc"
              class="form-model"
              dense
              outlined
              stack-label
              style="width: 250px"
            />
          </div>
          <q-btn
            @click.prevent="save(insertCondition.word, insertCondition.desc)"
            label="追加"
            color="light-green"
          />
        </div>
      </div>
    </div>

    <!--テーブル-->
    <div class="q-pt-md" v-if="records.length > 0">
      <hr />
      <q-toggle
        v-model="visibleColumns"
        val="desc"
        label="詳細を表示"
        keep-color
        color="blue"
      />

      <q-table
        dense
        :rows="records"
        :columns="columns"
        separator="cell"
        :visible-columns="visibleColumns"
        class="search-table"
        :rows-per-page-options="[0]"
      />
    </div>
  </q-page>
</template>
<script lang="ts">
import { QTableProps } from 'quasar';
import { defineComponent, ref } from 'vue';
import { useWordListModel } from 'src/models/WordListModels';
export default defineComponent({
  name: 'word-list',
  setup() {
    const {
      condition,
      saveModalShow,
      records,
      search,
      isLoading,
      save,
      insertCondition,
      isSaveLoading,
      deleteRecord,
      isDeleteLoading,
    } = useWordListModel();
    const columns: QTableProps['columns'] = [
      {
        name: 'word',
        label: '名言',
        field: 'word',
        sortable: true,
        align: 'left',
      },
      {
        name: 'desc',
        label: '詳細',
        field: 'desc',
        sortable: true,
        align: 'left',
      },
    ];
    search();
    return {
      columns,
      condition,
      records,
      search,
      isLoading,
      save,
      insertCondition,
      isSaveLoading,
      deleteRecord,
      isDeleteLoading,
      saveModalShow,
      visibleColumns: ref(['word']),
    };
  },
});
</script>
<style>
/*input 入力の横幅 */
.form-model {
  width: 200px;
  height: 40px;
}
/*上部分の横幅 */
.form-space {
  max-width: 1200px;
  height: 220px;
}
@media (max-width: 1199px) {
  .form-space {
    height: 500px;
  }
}
/*テーブルのサイズ */
.search-table {
  max-width: 800px;
}
/*追加画面の外枠 */
.edit-form {
  padding: 0.5em 1em;
  font-weight: bold;
  color: #60d36f; /*文字色*/
  background: #fff;
  border: solid 3px #60d36f; /*線*/
  border-radius: 10px; /*角の丸み*/
}
</style>
