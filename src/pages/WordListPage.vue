<template>
  <q-page class="">
    <div class="row q-gutter-md">
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
            label="追加画面を表示する"
            v-model="saveModalShow"
            keep-color
            color="grey-6"
          />
        </div>

        <!--botton-->
        <div class="row q-gutter-md">
          <q-btn
            label="検索"
            color="primary"
            dense
            icon="search"
            outline
            @click="search"
            :loading="isLoading"
          />
        </div>
      </div>
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
                    label="名言"
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

                <q-input
                  label="詳細(省略可)"
                  type="textarea"
                  v-model="insertCondition.desc"
                  class="form-model"
                  dense
                  outlined
                  stack-label
                  style="width: 250px"
                  clearable
                />
              </div>
              <hr />
              <div class="row q-gutter-md">
                <q-btn
                  @click.prevent="
                    insertRecord(insertCondition.word, insertCondition.desc)
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
    </div>

    <!--テーブル-->
    <div class="q-pt-md q-pb-md search-table" v-if="records.length > 0">
      <div class="row q-gutter-md">
        <q-toggle
          v-model="visibleColumns"
          val="desc"
          label="詳細を表示"
          keep-color
          color="blue"
        />
        <lock-icon
          v-model="detailEditLock"
          @event-change="detailEditLock = $event"
          label="更新・削除"
          class="q-pt-sm"
        />
      </div>
      <q-markup-table separator="cell" class="search-table">
        <thead>
          <th width="50" v-if="!detailEditLock">編集</th>
          <th width="250">名言</th>
          <th v-if="visibleColumns">詳細</th>
        </thead>
        <tbody>
          <tr v-for="rec in records" :key="rec.word">
            <td
              v-if="!detailEditLock"
              :class="{
                'bg-light-blue-1': rec.word == updateCondition.word,
              }"
            >
              <a href="#" @click.prevent="onEditClick(rec)"
                ><q-icon name="edit_note" color="secondary" size="md"></q-icon
              ></a>
            </td>
            <td
              :class="{
                'bg-light-blue-1': rec.word == updateCondition.word,
              }"
            >
              {{ rec.word }}
            </td>
            <td
              v-if="visibleColumns"
              :class="{
                'bg-light-blue-1': rec.word == updateCondition.word,
              }"
            >
              {{ rec.desc }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>

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
                label="名言"
                type="textarea"
                v-model="updateCondition.word"
                class="form-model"
                dense
                outlined
                stack-label
                style="width: 250px"
                clearable
              />
              <q-input
                label="詳細(省略可)"
                type="textarea"
                v-model="updateCondition.desc"
                class="form-model"
                dense
                outlined
                stack-label
                style="width: 250px"
                clearable
              />
            </div>
            <!--buttons-->
            <hr />
            <div class="row q-gutter-md">
              <q-btn
                @click.prevent="
                  updateRecord(updateCondition.word, updateCondition.desc)
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
            <div>次の名言を削除してもいいかな？</div>
            <q-field label="名言" stack-label>{{
              updateCondition.word
            }}</q-field>
            <div class="row q-gutter-md q-pt-sm">
              <q-btn
                @click.prevent="
                  deleteRecord(updateCondition.word, updateCondition.desc)
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
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useWordListModel } from 'src/models/WordListModels';
import lockIcon from 'src/components/LockIcon.vue';
export default defineComponent({
  name: 'word-list',
  components: {
    'lock-icon': lockIcon,
  },
  setup() {
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
    } = useWordListModel();
    search();

    watch(editModalShow, () => {
      if (editModalShow.value == false) {
        updateCondition.value.word = '';
        updateCondition.value.desc = '';
      }
    });

    return {
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
