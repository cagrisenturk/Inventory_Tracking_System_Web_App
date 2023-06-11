import { createRouter, createWebHashHistory } from "vue-router";
import Dashboard from "./pages/general/Dashboard.vue";
import VueCookies from "vue-cookies";
const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/general/Login.vue"),
    meta: { auth: false },
  },
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
    meta: { auth: true },
  },
  {
    path: "/userHomePage",
    name: "userHomePage",
    component: () => import("./pages/userHomePage/userHomePage.vue"),
    meta: { auth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("./pages/general/Profile.vue"),
    meta: { auth: true },
  },
  {
    path: "/Inventory",
    name: "ınventory",
    component: () => import("./pages/inventories/Inventory/index.vue"),
    meta: { auth: true },
  },
  {
    path: "/Inventory/infoInventory/:inventoryId",
    name: "InfoInventory",
    component: () =>
      import("./pages/inventories/Inventory/info.vue"),
    meta: { auth: true },  
  },
  {
    path: "/User/infoUser/:userId",
    name: "InfoUser",
    component: () =>
      import("./pages/inventories/User/info.vue"),
    meta: { auth: true },  
  },
  {
    path: "/users",
    name: "users",
    component: () => import("./pages/inventories/User/index.vue"),
    meta: { auth: true },
  },
  {
    path: "/error",
    name: "error",
    component: () => import("./pages/Error.vue"),
    meta: { auth: true },
  },
  {
    path: "/notfound",
    name: "notfound",
    component: () => import("./pages/NotFound.vue"),
    meta: { auth: true },
  },
  {
    path: "/access",
    name: "access",
    component: () => import("./pages/Access.vue"),
    meta: { auth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.auth)) {
    if (VueCookies.get("usercode") !== null) {
      next();
    } else {
      next({ name: "login" });
    }
  } else {
    if (VueCookies.get("usercode") !== null) {
      next({ name: "dashboard" });
    } else {
      next();
    }
  }
});

export default router;
