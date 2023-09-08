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
      <div v-if="!isLoading">
        <div class="row q-gutter-md" v-if="pageState.totalPages != 1">
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
      <div id="holo-song-cards" style="min-height: 780px">
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
      <div class="row q-gutter-md q-pt-md" v-if="pageState.totalPages != 1">
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
  </q-page>
</template>

<script lang="ts">
import { useHoloSongModel } from 'src/models/HoloSongModels';
import { defineComponent } from 'vue';
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
      select,
      selectPage,
    } = useHoloSongModel();
    select();

    return {
      records,
      pageState,
      isLoading,
      searchOptionShow,
      selectPage,
    };
  },
});
</script>
