import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";
import http from "@/services/http";
import { ToastProgrammatic as Toast } from "buefy";
import qs from "querystring";
import cookie from "cookie";
import _ from "lodash";

Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    isLoggedIn: false,
    loading: 0,
    loadingFailed: false,
    timetable: {}
  },
  mutations: {
    setLoggedIn(state, val) {
      if (typeof val == "boolean") state.isLoggedIn = val;
    },
    setTimetable(state, val) {
      state.timetable = val;
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
    loading: state => state.loading,
    timetable: state => todayUTC => {
      let result = [];
      for (var i = 0; i < 5; i++) {
        // Skip weekends
        while (!(todayUTC.getDay() % 6)) {
          todayUTC.setDate(todayUTC.getDate() + 1);
        }

        var today = todayUTC.toISOString().slice(0, 10);
        result.push(state.timetable[today] || []);

        todayUTC.setDate(todayUTC.getDate() + 1);
      }
      return result;
    }
  },
  actions: {
    async getTimetable(state) {
      try {
        let res = await http.get("api/timetable");
        state.commit("setTimetable", _.groupBy(res.data, "date"));
      } catch (err) {
        state.commit("logout");
      }
    },
    async login(_state, params) {
      try {
        await http.post(
          "api/login",
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
      const cookieFilter = ["connect.sid", "b47ab3a02bf2798d4506d9bb5a377bde"];
      for (const val in cookies) {
        if (val.includes(cookieFilter[0]) || val.includes(cookieFilter[1]))
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
