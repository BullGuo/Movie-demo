<template>
  <div class="cinema-schedule">
    <div class="header-left">
      <van-icon v-if="!showClose" name="arrow-left" @click="goBack" />
      <van-icon v-else name="cross" @click="closeClick" />
    </div>
    <div class="header-title">
      {{ detail.name }}
    </div>
    <div v-if="!showClose">
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
    this.init();
  },
  methods: {
    init() {
      let params = { cinemaId: this.cinemaId, k: 3239016 };
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
          this.detail = { ...res.data.data.cinema };
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
  beforeDestroy() {
    this.$store.commit("setTabs", true);
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
  background-color: #fff;
  padding-top: 44px;
  .header-left {
    padding: 10px 0 0 8px;
    position: fixed;
    top: 0;
    font-size: 24px;
    color: rgb(129, 129, 129);
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
    height: 44px;
    line-height: 44px;
  }
  .fix-header-title {
    position: fixed;
  }
}
</style>
