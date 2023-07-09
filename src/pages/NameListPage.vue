<template>
  <q-page class="">
    <div class="row q-gutter-md">
      <!--画面左側-->
      <div>
        <div class="q-pb-md text-h6">あだ名一覧</div>
        <div class="row q-gutter-md q-pb-md">
          <q-input
            label="あだ名"
            v-model="condition.key"
            class="form-model"
            dense
            outlined
            stack-label
          />
          <q-select
            label="キャラ名"
            v-model="condition.val"
            :options="searchSsbuNames"
            clearable
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
              <div class="row q-gutter-md">
                <div>
                  <q-input
                    label="あだ名"
                    v-model="insertCondition.key"
                    class="form-model"
                    dense
                    outlined
                    stack-label
                    style="width: 250px"
                    clearable
                  />
                </div>

                <q-select
                  label="キャラ名"
                  v-model="insertCondition.val"
                  class="form-model"
                  :options="ssbuNames"
                  dense
                  outlined
                  stack-label
                  style="width: 250px"
                />
              </div>
              <ul v-if="saveDisplayList.length > 0">
                <div class="text-h6">登録済みのあだ名</div>
                <li v-for="n in saveDisplayList" :key="n.key">{{ n.key }}</li>
              </ul>
              <hr />
              <div class="row q-gutter-md">
                <q-btn
                  @click.prevent="
                    insertRecord(insertCondition.key, insertCondition.val)
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
          label="キャラ名を表示"
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
          <th width="250">あだ名</th>
          <th v-if="visibleColumns">キャラ名</th>
        </thead>
        <tbody>
          <tr v-for="rec in records" :key="rec.key">
            <td
              v-if="!detailEditLock"
              :class="{
                'bg-light-blue-1':
                  rec.val == updateCondition.val &&
                  rec.key == updateCondition.key,
              }"
            >
              <a href="#" @click.prevent="onEditClick(rec)"
                ><q-icon name="edit_note" color="secondary" size="md"></q-icon
              ></a>
            </td>
            <td
              :class="{
                'bg-light-blue-1': rec.key == updateCondition.key,
              }"
            >
              {{ rec.key }}
            </td>
            <td
              v-if="visibleColumns"
              :class="{
                'bg-light-blue-1': rec.key == updateCondition.key,
              }"
            >
              {{ rec.val }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      <div class="q-pt-sm text-weight-light" style="">
        count:{{ records.length }}
      </div>
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
            <div class="row q-gutter-md">
              <q-input
                label="あだ名"
                v-model="updateCondition.key"
                class="form-model"
                dense
                outlined
                stack-label
                style="width: 250px"
              />
              <q-input
                label="キャラ名"
                v-model="updateCondition.val"
                class="form-model"
                dense
                outlined
                stack-label
                style="width: 250px"
                readonly
              />
            </div>
            <ul
              v-if="
                records.filter((it) => it.val == updateCondition.val).length > 0
              "
            >
              <div class="text-h6">登録済みのあだ名</div>
              <li
                v-for="n in records.filter(
                  (it) => it.val == updateCondition.val
                )"
                :key="n.key"
              >
                {{ n.key }}
              </li>
            </ul>
            <!--buttons-->
            <hr />
            <div class="row q-gutter-md">
              <q-btn
                @click.prevent="
                  updateRecord(updateCondition.key, updateCondition.val)
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
            <div>次のあだ名を削除してもいいかな？</div>
            <q-field label="あだ名" stack-label>{{
              updateCondition.key
            }}</q-field>
            <div class="row q-gutter-md q-pt-sm">
              <q-btn
                @click.prevent="
                  deleteRecord(updateCondition.key, updateCondition.val)
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
import { computed, defineComponent, ref, watch } from 'vue';
import { useNameListModel } from 'src/models/NameListModels';
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
      //initNameList,
      saveDisplayList,
      ssbuNames,
      ssbuList,
      searchSsbuNames,
      editSsbuNames,
      updateBeforeCondition,
    } = useNameListModel();
    //initNameList();
    search();
    ssbuList();

    //追加画面閉じたら初期化
    watch(editModalShow, () => {
      if (editModalShow.value == false) {
        updateCondition.value.key = '';
        updateCondition.value.val = '';
      }
    });

    //編集画面閉じたら初期化
    watch(saveModalShow, () => {
      if (saveModalShow.value == false) {
        insertCondition.value.key = '';
        insertCondition.value.val = '';
        saveDisplayList.value.splice(0);
      }
    });

    watch(condition.value, () => {
      if (condition.value.key == '') {
        search();
      }
    });

    //追加画面のセレクト選択後登録済みのあだ名表示
    watch(insertCondition.value, () => {
      if (insertCondition.value.val != '') {
        saveDisplayList.value = records.value.filter(
          (it) => it.val == insertCondition.value.val
        );
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
      ssbuNames,
      searchSsbuNames,
      editSsbuNames,
      saveDisplayList,
      updateBeforeCondition,
    };
  },
});
</script>
<style>
/*input 入力の横幅 */
.form-model {
  width: 300px;
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
/*箇条書き */
ul {
  background: #fcfcfc; /*背景色*/
  padding: 0.5em 0.5em 0.5em 2em; /*ボックス内の余白*/
  border: solid 3px gray; /*線の種類 太さ 色*/
}

li {
  line-height: 1.5; /*文の行高*/
  padding: 0.5em 0; /*前後の文との余白*/
}
</style>
