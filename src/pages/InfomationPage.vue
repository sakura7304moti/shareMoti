<template>
  <q-page class="">
    <div id="page-main">
      <div class="text-h5 q-pb-md">共有URLまとめ</div>
      <!--ネタ要素満載-->
      <div class="row q-gutter-md">
        <!--与謝野晶子による焼き直し劇場-->
        <div class="neta-talk" style="padding-right: 100px">
          <div class="row q-gutter-md q-pb-md">
            <div>
              <img
                src="../assets/yosao.png"
                height="130"
                width="140"
                id="oba-profile"
              />
              <div class="profile-name">未来から来た与謝野晶子</div>
            </div>
            <balloon-left :text="yosamessage" style="height: 120px" />
          </div>
          <div class="row q-gutter-md">
            <div>
              <img src="../assets/obachan.jpg" height="130" id="oba-profile" />
              <div class="profile-name">韓国のおばあちゃん</div>
            </div>
            <balloon-left :text="obamessage" style="height: 120px" />
          </div>
        </div>

        <!--ガノンヤーキー川柳-->
        <div class="haiku-box-big">
          <div style="font-family: HinaMincho-Regular; font-size: 36px">
            2023年交通安全川柳<br /><b>最優秀作品</b>
          </div>
          <div
            style="
              writing-mode: vertical-rl;
              font-family: haiku;
              font-size: 32px;
              margin-left: auto;
            "
          >
            <div style="margin-right: 100px">安全は</div>
            <div style="margin-right: 20px">規則を守って</div>
            <div style="margin-right: 20px">ガノンヤーキー</div>
          </div>
          <audio
            controls
            autoplay
            :volume="0.5"
            preload="auto"
            loop
            class="q-pt-md"
          >
            <source src="../songs/watamote.mp3" type="audio/mp3" />
          </audio>
        </div>
      </div>

      <!--リンクまとめ-->
      <hr />
      <div id="info-links" class="q-pb-md q-pt-md">
        <div id="notion-urls">
          <a
            class="row q-gutter-xs info-link-row"
            href="https://brindle-spring-0d6.notion.site/URL-2998ca28318d430cbdd7d5b7ad034ccf?pvs=4"
            target="_blank"
            rel="noopener"
          >
            <div>
              <img src="../assets/notion_icon.png" class="info-icon" />
            </div>
            <div class="text-subtitle1">Notion</div>
          </a>
        </div>
        <div id="google-urls" class="q-pt-sm">
          <a
            class="row q-gutter-xs info-link-row"
            href="https://drive.google.com/drive/folders/1XSRGqBx5FeJaOSJj9UtF3e2M7S3Z3PsG?usp=sharing"
            target="_blank"
            rel="noopener"
          >
            <div>
              <img src="../assets/google_drive_icon.png" class="info-icon" />
            </div>
            <div class="text-subtitle1">Googleドライブ</div>
          </a>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import balloonLeft from 'src/components/balloonLeft.vue';
export default defineComponent({
  name: 'InfoPage',
  components: { balloonLeft },
  setup() {
    return {
      yosamessage: `もう帰るのかい？
ちょっとそこで立ってなさい
`,
      obamessage: `いやだああああぁぁぁ
`,
    };
  },
});
</script>
<style>
/*image */
.info-icon {
  height: 30px;
}
/*link a tag */
.info-link-row {
  transition: color 0.3s;
  text-decoration: none;
}

.info-link-row:hover {
  text-decoration: underline;
}
/*pfofile */
#oba-profile {
  border-radius: 50%; /* 角丸半径を50%にする(=円形にする) */
  border: 3px solid #b4b4b4; /* 枠線を付加 */
}
.profile-name {
  text-align: center;
  font-weight: lighter;
  font-size: 1rem;
}
/*fonts */
@font-face {
  font-family: 'haiku';
  src: url(../fonts/haiku2.ttf) format('truetype');
}
@font-face {
  font-family: 'HinaMincho-Regular';
  src: url(../fonts/HinaMincho-Regular.ttf) format('truetype');
}
/*haiku-box-big */
.haiku-box-big {
  width: 400px;
  margin: 2em 0;
  position: relative;
  padding: 0.5em 1.5em;
  border-top: solid 2px black;
  border-bottom: solid 2px black;
}
.haiku-box-big:before,
.haiku-box-big:after {
  content: '';
  position: absolute;
  top: -10px;
  width: 2px;
  height: -webkit-calc(100% + 20px);
  height: calc(100% + 20px);
  background-color: black;
}
.haiku-box-big:before {
  left: 10px;
}
.haiku-box-big:after {
  right: 10px;
}
.haiku-box-big div {
  margin: 0;
  padding: 0;
}
</style>
