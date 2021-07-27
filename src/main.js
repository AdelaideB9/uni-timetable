import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Buefy from "buefy";
import VueOffline from "vue-offline";
import "./registerServiceWorker";
import common from "/common";

Vue.config.productionTip = false;
Vue.use(Buefy, { defaultIconPack: "fas" });
Vue.use(VueOffline);
Vue.prototype.$common = common;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
