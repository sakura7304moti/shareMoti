<template>
  <q-table
    :title="tableName"
    :rows="records"
    :columns="columns"
    row-key="word"
    style="width: 800px"
    :style="{ height: tableHeight }"
    separator="cell"
    rows-per-page-label="表示行数"
    no-results-label="見つからなかった..."
    no-data-label="見つからなかった..."
    :pagination="{ rowsPerPage: 0 }"
    :rows-per-page-options="[0]"
    :filter="filter"
  >
    <!--sub 1/3 オプション-->
    <template v-slot:top-right>
      <div class="row q-gutter-md" style="width: 800px">
        <div style="width: 75%" class="row q-gutter-md">
          <q-input
            dense
            debounce="300"
            v-model="filter"
            placeholder="検索"
            style="width: 200px"
            align="left"
          >
            <template v-slot:append>
              <q-spinner
                v-model="isLoading"
                v-if="isLoading"
                color="primary"
                size="md"
              />
              <q-icon name="search" v-if="filter.length == 0" />
              <q-icon name="search" v-else color="primary" />
              <div class="text-caption" v-if="records.length > 0">
                {{ records.length }}
              </div>
            </template>
          </q-input>
          <q-select
            label="種類"
            v-model="filter"
            class="form-model"
            :options="selecter"
            dense
            stack-label
            style="width: 250px"
          />
        </div>
        <div class="row q-gutter-md">
          <div>
            <q-btn
              label="追加"
              icon-right="note_add"
              color="grey-6"
              @click="saveModalShow = true"
              outline
            />
          </div>
          <div>
            <lock-icon
              v-model="detailEditLock"
              @event-change="detailEditLock = $event"
              class="q-pt-sm"
            />
          </div>
        </div>
      </div>
    </template>
    <!-- sub 2/3  ヘッダー-->
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-if="detailEditLock == false"> 編集 </q-th>
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          <div v-if="col.label == '条約'" style="width: 200px">
            {{ col.label }}
          </div>
          <div v-else style="width: 100px">
            {{ col.label }}
          </div>
        </q-th>
      </q-tr>
    </template>
    <!-- sub 3/3  アイテム-->
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-if="detailEditLock == false">
          <a
            href="#"
            @click.prevent="
              console.log(props.row.word);
              onEditClick(props.row);
            "
            ><q-icon name="edit_note" color="secondary" size="md"></q-icon
          ></a>
        </q-td>
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          style="white-space: normal; text-align: left"
        >
          {{ col.value }}
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!--追加画面-->
  <q-dialog v-model="saveModalShow">
    <q-card>
      <q-section>
        <div class="q-pa-md">
          <div class="text-subtitle1 row q-gutter-md">
            <div style="margin-right: auto">新規追加</div>
            <q-btn icon="close" @click="saveModalShow = false" round flat />
          </div>
          <hr />
          <div class="row q-gutter-md" style="height: 150px">
            <div style="height: 150px">
              <q-input
                label="条約名"
                type="textarea"
                v-model="insertCondition.word"
                class="form-model"
                dense
                outlined
                stack-label
                style="width: 250px"
                clearable
              />
            </div>

            <q-select
              label="種類"
              v-model="insertCondition.yaki"
              class="form-model"
              :options="selecter"
              dense
              outlined
              stack-label
              style="width: 250px"
            />
          </div>
          <hr />
          <div class="row q-gutter-md">
            <q-btn
              @click.prevent="
                insertRecord(insertCondition.word, insertCondition.yaki)
              "
              label="追加"
              color="primary"
              outline
              icon="note_add"
              :loading="isSaveLoading"
            />
          </div>

          <div class="text-negative text-caption">
            {{ insertErr }}
          </div>
        </div>
      </q-section>
    </q-card>
  </q-dialog>

  <!--更新ダイアログ-->
  <q-dialog v-model="editModalShow">
    <q-card>
      <q-section>
        <div class="q-pa-md">
          <div class="row q-gutter-md">
            <div class="text-h6" style="margin-right: auto">更新・削除</div>
            <q-btn icon="close" @click="editModalShow = false" round flat />
          </div>

          <hr />
          <!--inputs-->
          <div class="row q-gutter-md" style="height: 150px">
            <q-input
              label="条約"
              type="textarea"
              v-model="updateCondition.word"
              class="form-model"
              dense
              outlined
              stack-label
              style="width: 250px"
              readonly
            />
            <q-select
              label="種類"
              :options="selecter"
              v-model="updateCondition.yaki"
              class="form-model"
              dense
              stack-label
              style="width: 250px"
            />
          </div>
          <!--buttons-->
          <hr />
          <div class="row q-gutter-md">
            <q-btn
              @click.prevent="
                updateRecord(updateCondition.word, updateCondition.yaki)
              "
              label="更新"
              color="primary"
              outline
              icon="note_add"
              style="margin-right: auto"
              :loading="isSaveLoading"
            />
            <div class="text-negative text-caption">
              {{ updateErr }}
            </div>
            <q-btn
              @click.prevent="deleteCheckModalShow = true"
              label="削除"
              color="negative"
              outline
              icon="note_add"
            />
          </div>
        </div>
      </q-section>
    </q-card>
  </q-dialog>

  <!--削除確認-->
  <q-dialog v-model="deleteCheckModalShow">
    <q-card>
      <q-section>
        <div class="q-pa-md">
          <div class="row q-gutter-md">
            <div class="text-h6" style="margin-right: auto">削除確認</div>
            <q-btn
              icon="close"
              @click="deleteCheckModalShow = false"
              round
              flat
            />
          </div>
          <hr />
          <div>次の条約を削除してもいいかな？</div>
          <q-field label="条約" stack-label>{{ updateCondition.word }}</q-field>
          <div class="row q-gutter-md q-pt-sm">
            <q-btn
              @click.prevent="
                deleteRecord(updateCondition.word, updateCondition.yaki)
              "
              label="削除する"
              color="negative"
              outline
              icon="note_add"
              dense
              :loading="isDeleteLoading"
            />
          </div>
        </div>
      </q-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useYakiListModel } from 'src/models/YakiListModels';
import lockIcon from 'src/components/LockIcon.vue';
export default defineComponent({
  name: 'table-yaki-list',
  components: {
    'lock-icon': lockIcon,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: false,
      default: '焼き直し条約',
    },
    height: {
      type: Number,
      required: false,
      default: 700,
    },
  },
  setup(props) {
    const {
      condition,
      saveModalShow,
      editModalShow,
      records,
      search,
      isLoading,
      updateRecord,
      insertCondition,
      isSaveLoading,
      deleteRecord,
      isDeleteLoading,
      detailEditLock,
      updateCondition,
      onEditClick,
      insertErr,
      insertRecord,
      updateErr,
      deleteCheckModalShow,
      selecter,
      columns,
    } = useYakiListModel();
    search();

    watch(editModalShow, () => {
      if (editModalShow.value == false) {
        updateCondition.value.word = '';
      }
    });

    watch(condition.value, () => {
      if (condition.value.yaki && condition.value.yaki != '') {
        condition.value.word = condition.value.yaki;
        condition.value.yaki = '';
      }
    });

    return {
      filter: ref(props.modelValue),
      tableName: ref(props.label),
      tableHeight: ref(props.height + 'px'),
      condition,
      editModalShow,
      records,
      search,
      isLoading,
      updateRecord,
      insertCondition,
      isSaveLoading,
      deleteRecord,
      isDeleteLoading,
      saveModalShow,
      visibleColumns: ref(true),
      detailEditLock,
      updateCondition,
      onEditClick,
      insertErr,
      insertRecord,
      updateErr,
      deleteCheckModalShow,
      selecter,
      columns,
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
/*テーブルのサイズ */
.search-table {
  max-width: 700px;
  word-break: break-word;
  max-height: 600px;
}
.search-table q-markup-table {
  table-layout: fixed; /* テーブルのレイアウト方式を固定に設定 */
  width: 100%; /* テーブルの幅を100%に設定 */
}
.search-table td {
  word-wrap: break-word; /* テキストの自動改行を設定 */
  white-space: normal; /* 空白文字の扱いを設定 */
}
</style>
