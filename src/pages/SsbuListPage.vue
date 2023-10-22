<template>
  <q-page class="">
    <div class="q-pb-md text-h5">スマブラクリップ集</div>

    <div class="ssbu-container">
      <div class="ssbu-left-content">
        <q-video
          v-if="playUrl != ''"
          :src="playUrl"
          style="width: 569px; height: 320px"
        />
        <div v-else>
          <div class="video-container">
            <div class="video-placeholder">
              <!-- 動画再生ボタンアイコン（例: フォントアイコンを使用） -->
              <i class="play-icon">▶️</i>
              <div class="text-white">動画はここで再生されるよ</div>
            </div>
            <!-- ここに実際の動画要素を追加する -->
          </div>
        </div>
      </div>
      <div class="ssbu-right-content">
        <q-table
          :rows="records"
          :columns="columns"
          row-id="id"
          separator="cell"
          rows-per-page-label="表示行数"
          no-results-label="見つからなかった..."
          no-data-label="見つからなかった..."
          :pagination="{ rowsPerPage: 0 }"
          :rows-per-page-options="[0]"
          :filter="filter"
          style="width: 900px"
          class="ssbu-table-scrollable-container"
        >
          <!--sub 1/3 オプション-->
          <template v-slot:top-left>
            <div class="row q-gutter-md" style="width: 700px">
              <div>
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
                      v-model="load.search"
                      v-if="load.search"
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
              </div>
              <div>
                <q-select
                  v-model="filter"
                  :options="ssbuNames"
                  dense
                  stack-label
                  label="キャラ名"
                  transition-show="jump-up"
                  transition-hide="jump-up"
                  style="width: 300px"
                />
              </div>
              <div>
                <q-select
                  v-model="filter"
                  :options="dateList"
                  dense
                  stack-label
                  label="日付"
                  transition-show="jump-up"
                  transition-hide="jump-up"
                  style="width: 150px"
                />
              </div>
            </div>
          </template>

          <!-- sub 2/3  ヘッダー-->
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th>再生</q-th>
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <!-- sub 3/3  アイテム-->
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td>
                <q-btn
                  icon="play_arrow"
                  :href="
                    api.apiEndpoint() + '/ssbu/download?id=' + props.row.id
                  "
                  @click.prevent="
                    console.log('play', props.row);
                    playUrl =
                      api.apiEndpoint() + '/ssbu/download?id=' + props.row.id;
                    playName = props.row.fileName;
                  "
                />
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
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useSsbuListModel } from 'src/models/SsbuListModels';
import api from 'src/api/SsbuListApi';
export default defineComponent({
  name: 'ssbu-list',
  setup() {
    const {
      filter,
      selectId,
      columns,
      load,
      records,
      dateList,
      ssbuNames,
      search,
      getSsbuNames,
    } = useSsbuListModel();
    getSsbuNames();
    search();

    return {
      filter,
      selectId,
      columns,
      load,
      records,
      dateList,
      ssbuNames,
      search,
      api,
      playUrl: ref(''),
      playName: ref(''),
    };
  },
});
</script>
<style>
/*動画とテーブルのstyle */
.ssbu-container {
  display: flex;
  flex-wrap: wrap;
}

.ssbu-left-content {
  width: 570px;
}

.ssbu-right-content {
  width: 900px;
}

@media screen and (max-width: 1470px) {
  .ssbu-container {
    flex-direction: column; /* ページの横幅が1470px未満の場合、縦に配置 */
  }

  .ssbu-left-content,
  .ssbu-right-content {
    width: 100%; /* ページの横幅が1470px未満の場合、フル幅になる */
  }
}

/*テーブルのstyle */
.ssbu-table-scrollable-container {
  height: 80vh; /* ページの高さの80%に設定 */
  overflow-y: auto; /* 縦方向にスクロール可能にする */
}

/*? */
.video-container {
  width: 569px;
  height: 320px;
  position: relative;
  overflow: hidden; /* オーバーフローしたコンテンツを非表示にする */
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000; /* ボタンアイコンの背景色 */
  opacity: 0.7; /* 不透明度を設定して動画の一部を透過させる */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.play-icon {
  font-size: 40px;
  color: #fff; /* ボタンアイコンの色 */
  cursor: pointer;
}
</style>
