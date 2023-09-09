<template>
  <q-page class="">
    <div class="q-pb-md q-pa-md">
      <!--1/5 タイトル-->
      <div class="text-h5 q-pb-md">ホロライブ歌みたまとめ</div>
      <div id="holo-page-loading" v-if="isLoading" class="row q-gutter-md">
        <q-spinner color="primary" size="3em" />
        <div class="text-subtitle1 text-primary">検索中...</div>
      </div>

      <div class="q-pa-md row q-gutter-md" v-if="pageState.selectLink != ''">
        <YouTube
          :src="pageState.selectLink"
          @ready="true"
          ref="youtube"
          :vars="{ autoplay: 1, rel: 0 }"
        />
      </div>

      <!--2/5 表示切り替え-->
      <div>
        <div class="row q-gutter-md q-pb-md" v-if="pageState.totalPages != 1">
          <div>
            <q-radio
              v-model="displayMode"
              val="gallery"
              label="サムネイル"
              dense
              class="q-pr-xs"
            />
            <q-radio v-model="displayMode" val="table" label="テーブル" dense />
          </div>
          <q-pagination
            v-if="!isLoading && displayMode == 'gallery'"
            v-model="pageState.pageNo"
            :max="pageState.totalPages"
            direction-links
            :max-pages="10"
            @click.prevent="selectPage"
            class="q-pl-md"
            outlined
          />
          <a
            href="#"
            @click.prevent.stop="searchOptionShow = true"
            v-if="!isLoading && displayMode == 'gallery'"
            ><q-icon name="view_list" color="primary" size="md"
          /></a>
        </div>
      </div>

      <!--3/5　サムネリスト-->
      <div
        id="holo-song-cards"
        style="min-height: 780px"
        v-if="displayMode == 'gallery'"
      >
        <div class="row q-gutter-md">
          <div v-for="rec in pageState.records" :key="rec.link" class="q-pa-sm">
            <q-card style="width: 100%; max-width: 250px">
              <q-card-section>
                <a
                  :href="rec.link"
                  @click.prevent="pageState.selectLink = rec.link"
                  ><img
                    :src="rec.imageLink"
                    style="width: 100%; max-width: 250px"
                /></a>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <div
        class="row q-gutter-md q-pt-md"
        v-if="
          pageState.totalPages != 1 && !isLoading && displayMode == 'gallery'
        "
      >
        <q-pagination
          v-model="pageState.pageNo"
          :max="pageState.totalPages"
          direction-links
          :max-pages="10"
          @click.prevent="selectPage"
          class="q-pb-md"
          outlined
        />
        <a href="#" @click.prevent.stop="searchOptionShow = true"
          ><q-icon name="view_list" color="primary" size="md"
        /></a>
      </div>
    </div>

    <!--4/5  テーブル-->
    <div class="q-pa-md">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="link"
        :filter="filter"
        v-if="!isLoading && displayMode == 'table'"
        rows-per-page-label="表示行数"
        no-results-label="見つからなかった..."
      >
        <!--sub 1/3 検索-->
        <template v-slot:top-right>
          <div class="q-pr-md no-shadow">
            <q-btn
              icon="queue_music"
              dense
              @click="songModalShow = true"
              round
            />
          </div>

          <q-select
            v-model="songInput"
            style="width: 200px"
            dense
            use-input
            stack-label
            label="曲名"
            class="q-pr-md"
            :options="songOptions"
            @filter="filterFn"
          />

          <q-select
            v-model="selectedMember"
            style="width: 200px"
            dense
            stack-label
            label="メンバー"
            class="q-pr-md"
            :options="holoMembers"
          />

          <div class="q-pl-md"></div>

          <q-input dense debounce="300" v-model="filter" placeholder="検索">
            <template v-slot:append>
              <q-icon name="search" v-if="filter.length == 0" />
              <q-icon name="search" v-else color="primary" />
            </template>
          </q-input>
        </template>
        <!-- sub 2/3  ヘッダー-->
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <!-- sub 3/3  アイテム-->
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <div class="no-shadow">
                <q-btn
                  size="md"
                  @click="pageState.selectLink = props.row.link"
                  icon="play_circle_filled"
                  text-color="primary"
                  flat
                />
              </div>
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <!--5/5  モーダル一覧-->
    <!-- sub 1/2  詳細なモーダル-->
    <q-dialog v-model="searchOptionShow">
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-h5">ページ選択</div>
          <hr />
          <q-pagination
            v-model="pageState.pageNo"
            :max="pageState.totalPages"
            @click.prevent="selectPage"
            class="q-pb-md"
            outlined
            style="width: 300px"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- sub 2/2  曲一覧-->
    <q-dialog v-model="songModalShow">
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-h6">曲一覧</div>
          <div class="q-pa-md">
            <ul v-for="song in songList" :key="song">
              <a
                href="#"
                class="holo-song-songitem text-subtitle1"
                @click.prevent="
                  filter = song;
                  songModalShow = false;
                "
              >
                <li class="holo-song-songli">
                  {{ song }}
                </li>
              </a>
            </ul>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { useHoloSongModel } from 'src/models/HoloSongModels';
import { defineComponent, ref, watch } from 'vue';
import YouTube from 'vue3-youtube';
export default defineComponent({
  name: 'holosong-page',
  components: { YouTube },
  setup() {
    const {
      records,
      pageState,
      isLoading,
      searchOptionShow,
      rows,
      columns,
      displayMode,
      holoMembers,
      songList,
      select,
      selectPage,
    } = useHoloSongModel();
    select();

    const selectedMember = ref('');
    const filter = ref('');

    watch(selectedMember, () => {
      if (selectedMember.value != '') {
        filter.value = selectedMember.value;
        selectedMember.value = '';
      }
    });

    const songOptions = ref([] as string[]);
    songList.value.forEach((it) => songOptions.value.push(it));

    const filterFn = (val: string, update: any) => {
      update(() => {
        const needle = val.toLowerCase();
        songOptions.value = songList.value.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    };

    const songInput = ref('');

    watch(songInput, () => {
      if (songInput.value != '') {
        filter.value = songInput.value;
        songInput.value = '';
      }
    });

    return {
      filter,
      selectedMember,
      records,
      pageState,
      isLoading,
      searchOptionShow,
      rows,
      columns,
      displayMode,
      holoMembers,
      songList,
      selectPage,
      songOptions,
      filterFn,
      songInput,
      songModalShow: ref(false),
    };
  },
});
</script>
<style>
.holo-song-songitem {
  text-decoration: none;
  color: black;
}
.holo-song-songli:hover {
  background: #bedcf5;
}
.holo-song-songli {
  position: relative;
  list-style-type: none !important; /*ポチ消す*/
  padding: 0.5em 0.5em 0.5em 0.5em;
  margin-bottom: 5px;
  line-height: 1.5;
  background: #dbebf8;
  vertical-align: middle;
  color: #505050;
  border-radius: 15px 0px 0px 15px; /*左側の角丸く*/
}
.holo-song-songli:before {
  display: inline-block;
  vertical-align: middle;
  /*以下白丸つくる*/
  content: '';
  width: 1em;
  height: 1em;
  background: #fff;
  border-radius: 50%;
  margin-right: 8px;
}
</style>
