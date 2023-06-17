<template>
  <q-page class="" style="background-image: url(../assets/obahome.jpg)">
    <div class="row q-gutter-md">
      <div>
        <img src="../assets/obachan.jpg" height="130" id="oba-profile" />
        <div class="profile-name">韓国のおばあちゃん</div>
      </div>
      <balloon-left :text="obamessage" style="height: 120px" />
    </div>
    <div class="row q-gutter-sm">
      <q-icon name="warning" color="grey" size="md" />
      <div class="text-subtitle1">まだ開発中</div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import balloonLeft from 'src/components/balloonLeft.vue';
export default defineComponent({
  name: 'IndexPage',
  components: { balloonLeft },
  setup() {
    return {
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
  border: 3px solid #95e2b5; /* 枠線を付加 */
}
.profile-name {
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
}
</style>
