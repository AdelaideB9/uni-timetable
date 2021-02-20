import Vue from "vue";
import VueRouter from "vue-router";
import Timetable from "../views/Timetable.vue";
import store from "@/store";
import cookie from "cookie";
import common from "/common.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Timetable",
    component: Timetable,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  let cookies = {};
  const cookieFilter = ["ASPSESSIONID", "CS92AA"];
  if (document.cookie) cookies = cookie.parse(document.cookie);

  if (common.objectHasKeys(cookies, cookieFilter))
    store.commit("setLoggedIn", true);
  else store.commit("setLoggedIn", false);

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.isLoggedIn) {
      next({ name: "Login" });
    } else {
      next(); // go to wherever I'm going
    }
  } else {
    next(); // does not require auth, make sure to always call next()!
  }
});

export default router;
