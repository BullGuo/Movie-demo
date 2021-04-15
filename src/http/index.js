import LoginUtil from "../common/utils/LoginUtil";
import axios from "axios";
import Vue from "vue";
import router from "../router";
import { Toast } from "vant";
import { AccountStatusEnum } from "@/common/enum/AccountStatusEnum";

Vue.use(Toast);

// 请求拦截器
axios.interceptors.request.use(
  function(config) {
    let devUrl = config.url.indexOf("192.168.50.35:3002");
    let masterUrl = config.url.indexOf("47.94.152.106:3002");
    if (devUrl != -1 || masterUrl != -1) {
      let new_data = config.data;
      if (!(new_data instanceof FormData)) {
        new_data = new FormData();
        for (let key in config.data) {
          if (typeof config.data[key] != "undefined") {
            new_data.append(
              key,
              typeof config.data[key] == "object"
                ? JSON.stringify(config.data[key])
                : config.data[key]
            );
          }
        }
      }
      new_data.append("token", LoginUtil.getToken());
      config.data = new_data;
    }
    return config;
  },
  function(error) {
    Toast.fail({
      message: `网络异常，请稍后重试`,
      duration: 4000
    });
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  function(response) {
    const res = response.data;
    let { url } = response.config;
    if (
      res.code &&
      res.code == AccountStatusEnum.TOKEN_OVERDUE &&
      url.indexOf("isCollect") == -1
    ) {
      Toast.fail({
        message: res.message + "请登录",
        forbidClick: true,
        duration: 1000
      });
      LoginUtil.setToken("", new Date(0));
      setTimeout(() => {
        Toast.loading({
          message: "加载中",
          forbidClick: true,
          duration: 1500
        });
      }, 1000);
      setTimeout(() => {
        router.push({ name: "login" });
      }, 2500);
    }
    return response;
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
