<template>
  <div class="film-orders">
    <movie-nav-bar nav-bar-title="我的电影" :has-margin="false" />
    <film-order-list />
  </div>
</template>

<script>
export default {
  name: "indexAction",
  components: {
    FilmOrderList: () => import("../components/FilmOrderList")
  }
};
</script>

<style scoped lang="less">
.film-orders {
  background-color: #f4f4f4;
}
</style>
