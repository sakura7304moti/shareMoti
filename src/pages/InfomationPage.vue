<template>
  <q-page class="">
    <div class="text-h5 q-pb-md">共有URLまとめ</div>
    <!--neta-->
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
    <!--Links-->
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
</style>
