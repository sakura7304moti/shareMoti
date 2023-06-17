<template>
  <q-page class="">
    <div class="row q-gutter-md">
      <img src="../assets/obachan.jpg" height="130" />
      <balloon-left :text="obamessage" />
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
ゆっくりしていきなさい`,
    };
  },
});
</script>
