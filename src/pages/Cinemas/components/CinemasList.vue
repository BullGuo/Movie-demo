<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    class="cinemas-list"
  >
    <cinemas-list-item
      v-for="item in list"
      :key="item.cinemaId"
      :detail="item"
    />
  </van-list>
</template>

<script>
export default {
  name: "CinemasList",
  data() {
    return {
      list: [],
      loading: false,
      finished: false
    };
  },
  watch: {
    getParams: {
      deep: true,
      immediate: true,
      handler() {
        this.init();
      }
    }
  },
  computed: {
    getParams() {
      return this.$store.state.cinemas_params;
    }
  },
  methods: {
    init() {
      let store = this.$store.state.cityInfo;
      let params = {
        ...this.getParams,
        ...{ cityId: store.cityID || store.cityId }
      };
      this.getCinemasList(params);
    },
    getCinemasList(params) {
      this.$axios({
        url: `https://m.maizuo.com/gateway?k=3631575`,
        params: { ...params },
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"16092348011945091904110593","bc":"110100"}',
          "X-Host": "mall.film-ticket.cinema.list"
        }
      }).then(res => {
        if (res && res.data.msg == "ok") {
          this.list = [...res.data.data.cinemas];
          this.finished = true;
        }
      });
    }
  },
  components: {
    CinemasListItem: () => import("./components/CinemasListItem")
  }
};
</script>

<style scoped lang="less">
.cinemas-list {
  width: 100%;
  height: calc(100vh - 142px);
  padding-top: 92px;
}
</style>
