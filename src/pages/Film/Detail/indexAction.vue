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
      <buy-ticket />
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
      showStagePhoto: false
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
  created() {
    this.$store.commit("setTabs", false);
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
    StagePhotoDetail: () => import("./components/StagePhotoDetail")
  }
};
</script>

<style scoped></style>
