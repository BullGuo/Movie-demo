<template>
  <div class="lazy-img-wrap">
    <img class="target-img" :src="$store.state.film_detail.poster" alt="" />
  </div>
</template>

<script>
export default {
  name: "TopPoster"
};
</script>

<style scoped lang="less">
.lazy-img-wrap {
  width: 100%;
  height: 210px;
  overflow: hidden;
  .target-img {
    width: 100%;
    transform: translateY(-31.5%);
  }
}
</style>
