<template>
  <div
    style="background-color: #f4f4f4;height: 100%;overflow: auto"
    @scroll="headerScroll"
  >
    <div v-if="!showStagePhoto">
      <top-header :show-go-back="showGoBack" />
      <top-poster />
      <film-info />
      <actor-list />
      <stage-photo :show-stage-photo.sync="showStagePhoto" />
      <buy-ticket
        v-if="
          $store.state.film_detail.isPresale || $store.state.film_detail.isSale
        "
      />
    </div>
    <stage-photo-detail v-else :show-stage-photo.sync="showStagePhoto" />
  </div>
</template>

<script>
export default {
  name: "indexAction",
  props: {
    id: [Number, String]
  },
  data() {
    return {
      showGoBack: false,
      showStagePhoto: false // 显示剧照详情
    };
  },
  methods: {
    headerScroll(e) {
      if (e.target.scrollTop > 95) {
        this.showGoBack = true;
      } else {
        this.showGoBack = false;
      }
    }
  },
  mounted() {
    this.$store.commit("setTabs", false);
    if (!this.$store.state.film_detail.isSale) {
      this.$store.commit("setTabs", false);
      this.$dialog
        .confirm({
          message: "该影片目前没有排期，到首页看看其他电影吧",
          className: "detail-dialog",
          confirmButtonColor: "#ff5f16"
        })
        .then(() => {
          this.$router.replace({ name: "film" });
          console.log(1111);
        })
        .catch(() => {
          console.log(2222);
        });
    }
  },
  beforeDestroy() {
    this.$store.commit("setTabs", true);
  },
  components: {
    TopHeader: () => import("./components/TopHeader"),
    TopPoster: () => import("./components/TopPoster"),
    FilmInfo: () => import("./components/FilmInfo"),
    ActorList: () => import("./components/ActorList"),
    StagePhoto: () => import("./components/StagePhoto"),
    BuyTicket: () => import("./components/BuyTicket"),
    StagePhotoDetail: () => import("./components/StagePhotoDetail") // 剧照详情
  }
};
</script>

<style lang="less">
.detail-dialog {
  width: 75%;
  border-radius: 0;
  top: 50%;
  .van-dialog__message {
    font-size: 15px;
    line-height: 36px;
    color: #191a1b;
    min-height: 36px;
    padding: 18px 20px 18px;
  }
}
</style>
