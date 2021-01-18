import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    film_list: [],
    film_list_total: 0,
    params: {
      cityId: 510100,
      pageNum: 1,
      type: 1
    },
    film_detail: {},
    is_show_tabs: true
  },
  mutations: {
    setFilmList(state, data) {
      if (!data.films.length && !data.total) {
        state.film_list = [];
        state.film_list_total = 0;
        return;
      }
      state.film_list = [...state.film_list, ...data.films];
      let arr = state.film_list;
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i].filmId == arr[j].filmId) {
            arr.splice(j, 1);
            j--;
          }
        }
      }
      state.film_list_total = data.total;
    },
    setFilmDetail(state, data) {
      state.film_detail = { ...data };
    },
    setParams(state, data) {
      state.params = { ...state.params, ...data };
    },
    setTabs(state, data) {
      state.is_show_tabs = data;
    }
  },
  actions: {
    getFilmList(store) {
      if (
        store.state.film_list_total &&
        Math.ceil(store.state.film_list_total / 10) < store.state.params.pageNum
      )
        return;
      return axios({
        url: `https://m.maizuo.com/gateway?cityId=510100&pageNum=${store.state
          .params.pageNum++}&pageSize=10&type=${
          store.state.params.type
        }&k=9323250`,
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"16092348011945091904110593","bc":"510100"}',
          "X-Host": "mall.film-ticket.film.list"
        }
      }).then(res => {
        if (res && res.data.msg == "ok") {
          store.commit("setFilmList", res.data.data);
        }
      });
    },
    getFilmDetail(store, id) {
      if (
        store.state.film_list_total &&
        Math.ceil(store.state.film_list_total / 10) < store.state.params.pageNum
      )
        return;
      return axios({
        url: `https://m.maizuo.com/gateway?filmId=${id}&k=371006`,
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"16092348011945091904110593","bc":"110100"}',
          "X-Host": "mall.film-ticket.film.info"
        }
      }).then(res => {
        if (res && res.data.msg == "ok") {
          store.commit("setFilmDetail", res.data.data.film);
        }
      });
    }
  },
  modules: {}
});
