import type { RouteRecordRaw } from 'vue-router';

import RoutesPaths from './RoutesPaths';

const routes: RouteRecordRaw[] = [
  //PublicLayout.vue
  {
    path: RoutesPaths.HOME,
    component: () => import('layouts/PublicLayout.vue'),
    meta: { title: 'Public', requireAuth: false },
    children: [
      //HOME
      {
        path: '',
        component: () => import('pages/access/HomePage.vue'),
        meta: { title: 'Home', requireAuth: false },
      },
    ],
  },
  {
    path: RoutesPaths.ACCESS,
    component: () => import('layouts/AccessLayout.vue'),
    children: [
      {
        path: RoutesPaths.LOGIN,
        component: () => import('pages/access/LoginPage.vue'),
        meta: { title: 'Login', requireAuth: false },
      },
    ],
  },
  {
    path: RoutesPaths.WORKAREA,
    component: () => import('layouts/MainLayout.vue'),
    meta: { title: 'Workarea', requireAuth: true },
    children: [
      // {
      //   path: RoutesPaths.SETTINGS,
      //   component: () => import('src/pages/account/SettingsPage.vue'),
      //   meta: { title: 'Settings', requireAuth: true },
      // },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
