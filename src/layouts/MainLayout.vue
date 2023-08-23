<template>
  <q-layout>
    <!--ヘッダー-->
    <q-header elevated class="bg-dark">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <a
            @click.prevent="router.replace('/')"
            class="text-white"
            style="cursor: pointer"
            >韓国のおばあちゃんち<q-tooltip
              :delay="1000"
              anchor="center right"
              self="center left"
              :offset="[10, 10]"
              >リビングに帰る</q-tooltip
            ></a
          >
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!--サイドメニュー-->
    <q-drawer v-model="leftDrawerOpen" class="q-pa-md bg-grey-4" bordered>
      <q-list>
        <q-item-section>
          <div class="text-h6">Main</div>
          <!--名言集-->
          <q-item clickable v-ripple @click="router.replace('/wordList')">
            <div class="menu-icon-image">
              <img src="../assets/ichiro2.jpg" width="48" />
            </div>
            <q-item-section class="text-h6"> 名言集 </q-item-section>
          </q-item>

          <!--あだ名一覧-->
          <q-item clickable v-ripple @click="router.replace('/nameList')">
            <div class="menu-icon-image">
              <img src="../assets/ichiro.png" width="48" />
            </div>
            <q-item-section class="text-h6"> あだ名一覧 </q-item-section>
          </q-item>

          <!--焼き直し条約-->
          <q-item clickable v-ripple @click="router.replace('/yaki')">
            <div class="menu-icon-image">
              <img src="../assets/yaki_kururu.jpg" width="48" />
            </div>
            <q-item-section class="text-h6"> 焼き直し条約 </q-item-section>
          </q-item>

          <!--俳句王決定戦-->
          <q-item clickable v-ripple @click="router.replace('/haiku')">
            <div class="menu-icon-image">
              <img src="../assets/senno_rikyu_icon.png" width="48" />
            </div>
            <q-item-section class="text-h6"> 俳句王決定戦 </q-item-section>
          </q-item>
        </q-item-section>

        <q-separator />
        <q-item-section>
          <div class="text-h6">Scraper</div>
          <!--Twitter-->
          <q-item clickable v-ripple @click="router.replace('/twitter')">
            <div class="menu-icon-image">
              <img src="../assets/Logo_of_Twitter.jpg" width="48" />
            </div>

            <q-item-section class="text-h6"> twitter </q-item-section>
          </q-item>
        </q-item-section>

        <q-separator />

        <q-item-section>
          <div class="text-h6">Other</div>
          <!--共有URLまとめ-->
          <q-item clickable v-ripple @click="router.replace('/info')">
            <div class="menu-icon-image">
              <img src="../assets/google_drive_icon.png" width="48" />
            </div>
            <q-item-section class="text-h6"> 共有URLまとめ </q-item-section>
          </q-item>

          <!--ホーム-->
          <q-item clickable v-ripple @click="router.replace('/')">
            <div class="menu-icon-image">
              <img
                src="../assets/obachan.jpg"
                width="48"
                style="
                  border-radius: 50%; /* 角丸半径を50%にする(=円形にする) */
                  border: 1px solid #b4b4b4; /* 枠線を付加 */
                "
              />
            </div>
            <q-item-section class="text-h6"> リビングに戻る </q-item-section>
          </q-item>
        </q-item-section>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view class="q-pa-md" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      router,
    };
  },
});
</script>
<style>
.menu-icon-image {
  width: 52px;
}
</style>
