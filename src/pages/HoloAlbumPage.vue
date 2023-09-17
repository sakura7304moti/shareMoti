<template>
  <q-page>
    <div class="text-h5 q-pb-md">ホロライブアルバムまとめ</div>
    <!--動画再生-->
    <div class="row q-gutter-md">
      <div v-if="selectItem.music.musicLink != ''">
        <YouTube
          :src="selectItem.music.musicLink"
          @ready="true"
          ref="youtube"
          :vars="{ autoplay: 1, rel: 0 }"
        />
      </div>
      <div>
        <q-card class="bg-grey-9" v-if="selectItem.album.albumName != ''">
          <q-card-section class="text-white">
            <!--header-->
            <div class="text-h5 row q-gutter-md q-pa-sm q-pb-md">
              <div>
                <img :src="selectItem.album.imageLink" style="height: 64px" />
              </div>
              <div>
                {{ selectItem.album.albumName }}
                <div class="text-subtitle1">
                  {{ selectItem.album.artist }}
                </div>
              </div>
            </div>
            <div v-for="music in selectItem.musicList" :key="music.musicLink">
              <a
                id="holo-album-music-item"
                class="row q-gutter-md q-pt-md text-bold text-white"
                :href="music.musicLink"
                style="text-decoration: none"
                @click.prevent="selectItem.music.musicLink = music.musicLink"
              >
                <q-icon name="play_circle_filled" size="sm" color="white" />
                <div class="text-body2">{{ music.musicName }}</div>
                <div class="text-body2">{{ music.artist }}</div>
              </a>
              <q-separator color="grey-4" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!--表示切替-->
    <div class="q-pt-md">
      <q-pagination
        v-if="!loading.album && !loading.music"
        v-model="pageState.pageNo"
        :max="pageState.totalPages"
        direction-links
        :max-pages="10"
        @click.prevent="selectPage"
        class="q-pl-md"
        outlined
      />
    </div>
    <!--サムネイルリスト-->
    <div id="holo-song-cards">
      <div class="row q-gutter-md">
        <div
          v-for="rec in pageState.records"
          :key="rec.albumName"
          class="q-pa-sm"
        >
          <q-card style="width: 100%; max-width: 250px">
            <q-card-section>
              <a
                :href="rec.playlistLink"
                @click.prevent="
                  selectItem.album = rec;
                  selectAlbum();
                "
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
      v-if="pageState.totalPages != 1 && !loading.album && !loading.music"
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
    </div>
  </q-page>
</template>

<script lang="ts">
import { useHoloSongAlbumModel } from 'src/models/HoloAlbumModels';
import { defineComponent } from 'vue';
import YouTube from 'vue3-youtube';
export default defineComponent({
  name: 'holoalbum-page',
  components: { YouTube },
  setup() {
    const {
      loading,
      selectItem,
      dataState,
      pageState,
      holoMembers,
      getMembers,
      getAlbums,
      getMusics,
      selectPage,
      selectAlbum,
    } = useHoloSongAlbumModel();

    getAlbums();
    getMusics();

    return {
      loading,
      selectItem,
      dataState,
      pageState,
      holoMembers,
      getMembers,
      getAlbums,
      getMusics,
      selectPage,
      selectAlbum,
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
