<template>
  <q-page class="">
    <div class="row q-gutter-md">
      <img src="../assets/obachan.jpg" height="130" />
      <div class="balloon2-left">
        <p>よく来たわね<br />ゆっくりしていきなさい</p>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: {},
  setup() {
    return {};
  },
});
</script>
<style>
.balloon2-left {
  position: relative;
  display: inline-block;
  margin: 1.5em 0 1.5em 15px;
  padding: 7px 10px;
  min-width: 120px;
  max-width: 100%;
  color: #555;
  font-size: 16px;
  background: #fff;
  border: solid 3px #555;
  box-sizing: border-box;
}

.balloon2-left:before {
  content: '';
  position: absolute;
  top: 50%;
  left: -24px;
  margin-top: -12px;
  border: 12px solid transparent;
  border-right: 12px solid #fff;
  z-index: 2;
}

.balloon2-left:after {
  content: '';
  position: absolute;
  top: 50%;
  left: -30px;
  margin-top: -14px;
  border: 14px solid transparent;
  border-right: 14px solid #555;
  z-index: 1;
}

.balloon2-left p {
  margin: 0;
  padding: 0;
}
</style>
