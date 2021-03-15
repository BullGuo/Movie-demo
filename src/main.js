import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vant from "vant";
import "vant/lib/index.css";
import { Toast } from "vant";
import axios from "axios";
import "./common/utils/rem";

Vue.config.productionTip = false;
Vue.use(Vant);
Vue.use(Toast);
Vue.prototype.$Toast = Toast;
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
