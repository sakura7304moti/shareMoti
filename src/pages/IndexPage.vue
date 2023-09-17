<template>
  <q-page class="">
    <!--あいさつ-->
    <div class="row q-gutter-md q-pt-md">
      <div>
        <img src="../assets/obachan.jpg" height="130" id="oba-profile" />
        <div class="profile-name">韓国のおばあちゃん</div>
      </div>
      <balloon-left :text="obamessage" style="height: 120px" />
    </div>

    <!--ページリンク一覧-->
    <div class="q-pt-md">
      <div class="text-h4">おばあちゃんちの部屋</div>
      <!--Main-->
      <div class="row q-gutter-md">
        <!--名言集-->
        <q-card class="index-page-card">
          <img
            src="../assets/turizao.jpg"
            style="cursor: pointer"
            @click="router.replace('/wordList')"
          />

          <q-card-section>
            <div class="text-h6">名言集</div>
            <q-card-section class="q-pt-none">
              心に響く名言が集められている
            </q-card-section>
          </q-card-section>
        </q-card>

        <!--あだ名一覧-->
        <q-card class="index-page-card">
          <img
            src="../assets/god_tamori.jpg"
            style="cursor: pointer"
            @click="router.replace('/nameList')"
          />

          <q-card-section>
            <div class="text-h6">あだ名一覧</div>
            <q-card-section class="q-pt-none">
              この木なんの木、平澤フェニックス(迫真)
            </q-card-section>
          </q-card-section>
        </q-card>

        <!--焼き直し条約-->
        <q-card class="index-page-card">
          <img
            src="../assets/yaki_doi.jpg"
            style="cursor: pointer"
            @click="router.replace('/yaki')"
          />

          <q-card-section>
            <div class="text-h6">焼き直し条約</div>
            <q-card-section class="q-pt-none">
              焼き直しフェニックス降臨！
            </q-card-section>
          </q-card-section>
        </q-card>

        <!--俳句-->
        <q-card class="index-page-card">
          <img
            src="../assets/yoshi.jpg"
            style="cursor: pointer"
            @click="router.replace('/haiku')"
          />

          <q-card-section>
            <div class="text-h6">俳句王決定戦</div>
            <q-card-section class="q-pt-none">
              最優秀賞には賞金10万たかしポイントをプレゼント！
            </q-card-section>
          </q-card-section>
        </q-card>

        <!--学校-->
        <q-card class="index-page-card">
          <img
            src="../assets/panda.jpg"
            style="cursor: pointer"
            @click="router.replace('/school')"
          />

          <q-card-section>
            <div class="text-h6">学校一覧</div>
            <q-card-section class="q-pt-none">
              オープンキャンパスの申し込みはこちらから
            </q-card-section>
          </q-card-section>
        </q-card>

        <!--共有リンクまとめ-->
        <q-card class="index-page-card">
          <img
            src="../assets/matlix_cleanup.png"
            style="cursor: pointer"
            @click="router.replace('/info')"
          />

          <q-card-section>
            <div class="text-h6">共有URLまとめ</div>
            <q-card-section class="q-pt-none">
              外部サービスのリンクまとめたよ
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>

      <!--Scraper-->
      <div class="text-h4 q-pt-lg">おまけ</div>
      <div class="row q-gutter-md">
        <!--Twitter-->
        <q-card class="index-page-card">
          <img
            src="../assets/aqua.jpg"
            style="cursor: pointer"
            @click="router.replace('/twitter')"
          />

          <q-card-section>
            <div class="text-h6">twitter</div>
            <q-card-section class="q-pt-none">
              twitterの画像をスクレイピングしたよ
            </q-card-section>
          </q-card-section>
        </q-card>
        <!--YouTube-->
        <q-card class="index-page-card">
          <img
            src="../assets/shion.jpg"
            style="cursor: pointer"
            @click="router.replace('/holosong')"
          />

          <q-card-section>
            <div class="text-h6">YouTube</div>
            <q-card-section class="q-pt-none">
              YouTubeの歌ってみたをまとめたよ
            </q-card-section>
          </q-card-section>
        </q-card>

        <!--Album-->
        <q-card class="index-page-card">
          <img
            src="../assets/koyori.jpg"
            style="cursor: pointer"
            @click="router.replace('/holoalbum')"
          />

          <q-card-section>
            <div class="text-h6">Album</div>
            <q-card-section class="q-pt-none">
              ホロライブのアルバムをまとめたよ
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import balloonLeft from 'src/components/balloonLeft.vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'IndexPage',
  components: { balloonLeft },
  setup() {
    const router = useRouter();
    return {
      router,
      obamessage: `よく来たわね
ゆっくりしていきなさい
`,
    };
  },
});
</script>
<style>
#oba-profile {
  border-radius: 50%; /* 角丸半径を50%にする(=円形にする) */
  border: 3px solid #b4b4b4; /* 枠線を付加 */
}
.profile-name {
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
}
.index-page-card {
  width: 100%;
  max-width: 250px;
}
</style>
