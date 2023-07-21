<template>
  <q-page class="">
    <div class="row q-gutter-md">
      <!--画面左側-->
      <div>
        <div class="q-pb-md text-h6">焼き直し条約</div>
        <div class="row q-gutter-md" style="padding-bottom: 8px">
          <q-field dense>
            <q-input
              v-model="condition.word"
              class="form-model"
              dense
              stack-label
              outlined
              v-on:keydown.enter="search"
            />
            <q-btn
              color="primary"
              dense
              icon="search"
              @click="search"
              :loading="isLoading"
            />
          </q-field>

          <q-btn
            label="追加"
            icon-right="note_add"
            color="grey-6"
            @click="saveModalShow = true"
            outline
            dense
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
    </div>

    <!--テーブル-->
    <div class="q-pb-md search-table" v-if="records.length > 0">
      <div class="row q-gutter-md search-table">
        <q-toggle
          v-model="visibleColumns"
          val="desc"
          label="種類"
          keep-color
          color="blue"
          dense
          class="q-pt-sm"
        />
        <lock-icon
          v-model="detailEditLock"
          @event-change="detailEditLock = $event"
          class="q-pt-sm"
        />
      </div>

      <q-markup-table separator="cell" class="search-table">
        <thead>
          <th width="50" v-if="!detailEditLock">編集</th>
          <th width="250">条約</th>
          <th v-if="visibleColumns">種類</th>
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
              {{ rec.yaki }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      <div class="q-pt-sm text-weight-light">count:{{ records.length }}</div>
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
            <q-field label="条約" stack-label>{{
              updateCondition.word
            }}</q-field>
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
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useYakiListModel } from 'src/models/YakiListModels';
import lockIcon from 'src/components/LockIcon.vue';
export default defineComponent({
  name: 'yaki-list',
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
      selecter,
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
