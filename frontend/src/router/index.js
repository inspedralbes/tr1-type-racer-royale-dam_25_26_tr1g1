/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHashHistory } from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import { routes } from "vue-router/auto-routes";

import { useAppStore } from "@/stores/app";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(
    routes.map((route) => {
      if (route.path === "/session") {
        return { ...route, path: "/session/:id" };
      }
      return route;
    })
  ),
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (localStorage.getItem("vuetify:dynamic-reload")) {
      console.error("Dynamic import error, reloading page did not fix it", err);
    } else {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

router.beforeEach((to, from, next) => {
  const appStore = useAppStore();
  const publicPages = ["/"];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !appStore.isAuthenticated) {
    return next("/");
  }

  if (to.path === "/" && appStore.isAuthenticated) {
    return next("/sessions");
  }

  next();
});

export default router;
