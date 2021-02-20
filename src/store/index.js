import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";
import http from "@/services/http";
import { ToastProgrammatic as Toast } from "buefy";
import qs from "querystring";
import cookie from "cookie";

Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    isLoggedIn: false,
    loading: 0,
    loadingFailed: false
  },
  mutations: {
    setLoggedIn(state, val) {
      if (typeof val == "boolean") state.isLoggedIn = val;
    },
    START_LOADING: state => {
      state.loading++;
      state.loadingFailed = false;
    },
    FINISH_LOADING: state => state.loading--,
    FAIL_LOADING: state => {
      state.loading--;
      state.loadingFailed = true;
    }
  },
  getters: {
    loading: state => state.loading
  },
  actions: {
    async login(state, params) {
      try {
        await http.post(
          ".netlify/functions/login",
          qs.stringify({
            username: params.username,
            password: params.password
          })
        );
        router.push({ name: "Timetable" });
      } catch (err) {
        Toast.open({
          duration: 5000,
          message: err.response.data,
          position: "is-top",
          type: "is-danger"
        });
      }
    },
    async logout() {
      let cookies = cookie.parse(document.cookie);
      const cookieFilter = ["ASPSESSIONID", "CS92AA"];
      for (const val in cookies) {
        if (
          val.indexOf(cookieFilter[0]) > -1 ||
          val.indexOf(cookieFilter[1]) > -1
        )
          document.cookie =
            val + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      }
      router.go();
    }
  },
  modules: {}
});

store.watch(
  state => [state.loading, state.loadingFailed],
  (newVal, oldVal) => {
    if (newVal[0] == 0) {
      if (newVal[1]) return window.progressBar.fail();
      return window.progressBar.done();
    }
    if (oldVal[0] == 0) return window.progressBar.start();
  }
);

export default store;
