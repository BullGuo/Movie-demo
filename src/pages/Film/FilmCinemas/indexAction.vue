<template>
  <div class="film-cinemas">
    <van-nav-bar
      :title="filmDetail.name"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
      @click-right="onClickRight"
      class="nav-bar"
    >
      <template #right>
        <img src="../../Cinemas/img/search.png" alt="" class="header-right" />
      </template>
    </van-nav-bar>
    <top-tabs :cinemas-list="cinemasList" :id="id" />
  </div>
</template>

<script>
export default {
  name: "indexAction",
  props: {
    id: {
      type: [Number, String]
    }
  },
  data() {
    return {
      filmDetail: {},
      cinemasList: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$store.commit("setTabs", false);
      // 电影详情
      this.$axios({
        url: "https://m.maizuo.com/gateway",
        params: { filmId: this.id, k: 363677 },
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"16092348011945091904110593"}',
          "X-Host": "mall.film-ticket.film.info"
        }
      }).then(res => {
        if (res && res.statusText == "OK") {
          this.filmDetail = { ...res.data.data.film };
        }
      });
      let cityInfo = this.$store.state.cityInfo;
      // 有此电影的影院列表
      this.$axios({
        url: "https://m.maizuo.com/gateway",
        params: {
          filmId: this.id,
          cityId: cityInfo.cityId || cityInfo.cityID,
          k: 2378458
        },
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"16092348011945091904110593"}',
          "X-Host": "mall.film-ticket.cinema.film-show-cinema"
        }
      }).then(res => {
        if (res && res.statusText == "OK") {
          this.cinemasList = [...res.data.data.showCinemas];
        }
      });
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    onClickRight() {
      this.$router.push({ name: "search" });
    }
  },
  components: {
    TopTabs: () => import("./components/TopTabs")
  }
};
</script>

<style scoped lang="less">
.film-cinemas {
  .nav-bar {
    .header-right {
      width: 18px;
      height: 18px;
      vertical-align: middle;
    }
  }
  /deep/ .van-nav-bar .van-icon {
    color: #404345;
    font-size: 22px;
  }
  /deep/ .van-nav-bar__title {
    font-size: 17px;
  }
  /deep/ .van-nav-bar__text {
    color: #404345;
    font-size: 16px;
  }
}
</style>
