<template>
  <q-page class="">
    <div class="q-pb-md">
      <!--1/3 タイトル-->
      <div class="text-h5">ホロライブ歌みたまとめ</div>
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

      <!--2/3表示条件-->
      <div>
        <div class="row q-gutter-md" v-if="pageState.totalPages != 1">
          <q-pagination
            v-if="!isLoading && displayMode == 'gallery'"
            v-model="pageState.pageNo"
            :max="pageState.totalPages"
            direction-links
            :max-pages="10"
            @click.prevent="selectPage"
            class="q-pb-md"
            outlined
          />
          <a
            href="#"
            @click.prevent.stop="searchOptionShow = true"
            v-if="!isLoading && displayMode == 'gallery'"
            ><q-icon name="view_list" color="primary" size="md"
          /></a>
          <div class="q-pl-lg">
            <q-radio v-model="displayMode" val="gallery" label="サムネイル" />
            <q-radio v-model="displayMode" val="table" label="テーブル" />
          </div>
        </div>

        <!--詳細なモーダル-->
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
      </div>

      <!--3/3　サムネイルリスト-->
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

    <!--テーブル-->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="link"
      :filter="filter"
      v-if="!isLoading && displayMode == 'table'"
    >
      <!--検索-->
      <template v-slot:top-right>
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
        <q-input dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <!--ヘッダー-->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <!--アイテム-->
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-th auto-width>
            <div class="q-pa-xs">
              <q-btn
                size="sm"
                color="negative"
                @click="pageState.selectLink = props.row.link"
                icon="play_arrow"
              />
            </div>
          </q-th>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
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
      quasar,
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
    };
  },
});
</script>
