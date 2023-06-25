import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/ssbu/wordList',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/WordListPage.vue') }],
  },
  {
    path: '/twitter',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/TwitterPage.vue') }],
    props: (route) => ({
      pageNo: Number(route.query.p),
      pageSize: Number(route.query.ps),
      hashtag: route.query.h,
      startDate: route.query.sd,
      endDate: route.query.ed,
      userName: route.query.u,
      minLike: Number(route.query.min),
      maxLike: Number(route.query.max),
      fetch: route.query.fetch,
    }),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
