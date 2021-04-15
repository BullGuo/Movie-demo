<template>
  <div class="collect">
    <movie-nav-bar nav-bar-title="我的收藏" />
    <movie-list :url="$api.movieCollectList" />
  </div>
</template>

<script>
export default {
  name: "indexAction",
  created() {
    this.$store.commit("setTabs", false);
  },
  components: {
    movieList: () => import("../components/movieList")
  }
};
</script>

<style scoped lang="less">
.collect {
  background-color: #f4f4f4;
}
</style>
