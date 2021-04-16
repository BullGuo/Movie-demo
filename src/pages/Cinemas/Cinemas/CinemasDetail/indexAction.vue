<template>
  <div class="cinema-schedule" @scroll="headerScroll">
    <div class="header-left">
      <van-icon v-if="!showClose" name="arrow-left" @click="goBack" />
      <van-icon v-else name="cross" @click="closeClick" />
    </div>
    <van-sticky>
      <div class="header-title">
        {{ detail.name }}
      </div>
    </van-sticky>
    <div v-show="!showClose">
      <cinema-wrap :show-close.sync="showClose" :detail="detail" />
      <film-list :cinema-id="cinemaId" />
    </div>
    <transition name="fade">
      <service-info v-if="showClose" :service-detail="detail.services" />
    </transition>
  </div>
</template>

<script>
export default {
  name: "indexAction",
  props: {
    cinemaId: [String, Number]
  },
  data() {
    return {
      showClose: false,
      detail: {}
    };
  },
  created() {
    this.$store.commit("setTabs", false);
  },
  mounted() {
    this.init();
  },
  methods: {
    headerScroll(e) {
      this.$bus.$emit("fixTab", e.target.scrollTop >= 300 ? true : false);
    },
    init() {
      let params = { cinemaId: this.cinemaId, k: 3239016 };
      // 影院信息
      this.$axios({
        url: `https://m.maizuo.com/gateway/`,
        params: { ...params },
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"16092348011945091904110593","bc":"510100"}',
          "X-Host": "mall.film-ticket.cinema.info"
        }
      }).then(res => {
        if (res && res.data.msg == "ok") {
          if (res.data.data.cinema) {
            this.detail = { ...res.data.data.cinema };
          }
        }
      });
    },
    goBack() {
      history.go(-1);
    },
    closeClick() {
      this.showClose = false;
    }
  },
  components: {
    CinemaWrap: () => import("./components/CinemaWrap"),
    FilmList: () => import("./components/FilmList"),
    ServiceInfo: () => import("./components/ServiceInfo")
  }
};
</script>

<style scoped lang="less">
.fade-enter-active {
  transition: all 0.5s;
}
.fade-enter {
  transform: translateY(-180px);
}
.cinema-schedule {
  padding-top: 44px;
  overflow: auto;
  .header-left {
    padding: 10px 0 0 8px;
    position: fixed;
    top: 0;
    font-size: 24px;
    color: rgb(129, 129, 129);
    background-color: #fff;
    z-index: 300;
  }
  .header-title {
    font-size: 17px;
    text-align: center;
    color: #191a1b;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    padding: 0 15px;
    height: 46px;
    line-height: 46px;
    background-color: #fff;
  }
  .fix-header-title {
    position: fixed;
  }
}
</style>
