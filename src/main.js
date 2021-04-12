import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vant from "vant";
import "vant/lib/index.css";
import { Toast } from "vant";
import axios from "axios";
import "./common/utils/rem";
import { EventBus } from "../src/common/utils/EventBus";
import moment from "moment";
import VueTouch from "vue-touch";

Vue.config.productionTip = false;
Vue.use(Vant);
Vue.use(Toast);
Vue.use(VueTouch, { name: "v-touch" });
Vue.prototype.$Toast = Toast;
Vue.prototype.$axios = axios;
Vue.prototype.$moment = moment;
Vue.prototype.$bus = new EventBus();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
