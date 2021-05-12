<template>
  <div style="height: calc(100% - 44px)">
    <van-pull-refresh
      class="nowplaying"
      v-model="isLoading"
      @refresh="onRefresh"
      @scroll.native="handleScroll"
    >
      <film-list />
      <div
        v-if="
          $store.state.film_list_total &&
            Math.ceil($store.state.film_list_total / 10) <
              $store.state.params.pageNum
        "
        :class="$store.state.film_list.length < 5 ? 'no-more-text' : 'no-more'"
      >
        <span v-if="$store.state.film_list.length < 5">-无更多电影-</span>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: "indexAction",
  data() {
    return {
      isLoading: false
    };
  },
  components: {
    FilmList: () => import("../components/FilmList")
  },
  methods: {
    handleScroll(e) {
      let target = e.target;
      if (target.scrollTop + target.clientHeight == target.scrollHeight) {
        this.$store.commit("setParams", {
          pageNum: this.$store.state.params.pageNum + 1
        });
        this.$store.dispatch("getFilmList");
      }
    },
    async onRefresh() {
      this.$store.commit("setParams", { pageNum: 1 });
      await this.$store.dispatch("getFilmList");
      this.$Toast({ message: "刷新成功", position: "bottom" });
      this.isLoading = false;
    }
  }
};
</script>

<style scoped lang="less">
.nowplaying {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.no-more-text {
  flex-grow: 1;
  background-color: #ededed;
  color: #bdc0c5;
  text-align: center;
  padding-top: 6%;
  font-size: 13px;
}
.no-more {
  background-color: #ededed;
  color: #bdc0c5;
  flex-grow: 1;
  padding-top: 3%;
}
</style>
