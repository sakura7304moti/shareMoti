import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  /*おばあちゃんち */
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/wordList',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/WordListPage.vue') }],
  },
  {
    path: '/nameList',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/NameListPage.vue') }],
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
  {
    path: '/info',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/InfomationPage.vue') },
    ],
  },
  /*Scraper */
  {
    path: '/scraper/',
    component: () => import('layouts/ScraperLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ScraperIndexPage.vue') },
    ],
  },
  {
    path: '/scraper/twitter',
    component: () => import('layouts/ScraperLayout.vue'),
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
  {
    path: '/scraper/hololewd',
    component: () => import('layouts/ScraperLayout.vue'),
    children: [{ path: '', component: () => import('pages/HololewdPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
