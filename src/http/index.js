import LoginUtil from "../common/utils/LoginUtil";
import axios from "axios";
import Vue from "vue";
import router from "../router";
import { Toast } from "vant";
import { AccountStatusEnum } from "@/common/enum/AccountStatusEnum";

Vue.use(Toast);

// 响应拦截器
axios.interceptors.response.use(
  function(response) {
    const res = response.data;
    if (res.code && res.code == AccountStatusEnum.TOKEN_OVERDUE) {
      Toast.fail({
        message: res.message,
        forbidClick: true
      });
      LoginUtil.setToken("");
      router.push({ name: "login" });
    }
    return res;
  },
  function(error) {
    Toast.fail({
      message: `网络异常，请稍后重试`,
      duration: 4000
    });
    return Promise.reject(error);
  }
);

function http_init(Vue) {
  window.axios = axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return axios;
      }
    },
    $axios: {
      get() {
        return axios;
      }
    }
  });
}
export default http_init;
