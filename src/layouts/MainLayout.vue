<template>
  <q-layout>
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
          <a @click.prevent="router.replace('/')" class="text-white"
            >韓国のおばあちゃんち</a
          >
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" class="q-pa-md bg-grey-4" bordered>
      <q-list>
        <template v-for="(menuItem, index) in menuList" :key="index">
          <q-item
            clickable
            :active="menuItem.label === 'Outbox'"
            v-ripple
            @click="router.replace(menuItem.link)"
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" :color="menuItem.iconColor" />
            </q-item-section>
            <q-item-section class="text-h6">
              {{ menuItem.label }}
            </q-item-section>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </q-item>
          <q-separator
            :key="'sep' + index"
            v-if="menuItem.separator"
            color="grey"
          />
        </template>
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
    const menuList = [
      {
        label: '名言集',
        iconColor: 'primary',
        icon: 'chat',
        link: '/wordList',
        separator: false,
      },
      {
        label: 'あだ名一覧',
        icon: 'content_paste',
        iconColor: 'secondary',
        link: '/nameList',
        separator: false,
      },
      {
        label: '焼き直し条約',
        icon: 'chat',
        iconColor: 'negative',
        link: '/yaki',
        separator: false,
      },
      {
        label: '俳句王決定戦',
        icon: 'chat',
        iconColor: 'green',
        link: '/haiku',
        separator: false,
      },
      {
        label: '共有URLまとめ',
        icon: 'info',
        iconColor: 'grey-6',
        link: '/info',
        separator: true,
      },
      {
        label: 'Twitter',
        icon: 'image',
        iconColor: 'primary',
        link: '/twitter',
        separator: false,
      },
    ] as MenuItem[];
    const router = useRouter();
    return {
      leftDrawerOpen,
      menuList,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      router,
    };
  },
});
interface MenuItem {
  icon: string;
  iconColor: string;
  label: string;
  separator: boolean;
  link: string;
}
</script>
