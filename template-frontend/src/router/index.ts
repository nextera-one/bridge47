import { defineRouter } from '#q-app/wrappers';
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

import SessionUtil from '../util/SessionUtil';
import RoutesPaths from './RoutesPaths';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */ const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;
const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,

  // Leave this as is and make changes in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  history: createHistory(process.env.VUE_ROUTER_BASE),
});
export default defineRouter(function (/* { store, ssrContext } */) {
  router.beforeEach((to, from, next) => {
    const isAuthenticated = SessionUtil.isLoggedIn();
    // Determine whether this route requires auth (default true)
    const requireAuth = to.meta?.requireAuth !== false;
    if (requireAuth) {
      // Protected route: must be logged in
      if (!isAuthenticated) {
        return next(RoutesPaths.LOGIN);
      }
      return next();
    } else {
      // Public route: redirect authenticated users to workarea
      // if (isAuthenticated) {
      //   return next(RoutesPaths.WORKAREA);
      // }
      return next();
    }
  });

  return router;
});
export { router };
