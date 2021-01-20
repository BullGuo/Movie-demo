<template>
  <div :class="{ 'film-header': true, 'film-header-hide': !showGoBack }">
    <div>
      <img
        src="./img/go-back-icon.png"
        alt=""
        class="go-back"
        @click="goBack"
      />
      <span v-show="showGoBack">{{ $store.state.film_detail.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopHeader",
  props: {
    showGoBack: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    goBack() {
      this.$router.push({ name: "film" });
    }
  }
};
</script>

<style scoped lang="less">
.film-header {
  transition: all 0.3s;
  background: #fff;
  color: #191a1b;
  text-align: center;
  position: fixed;
  width: 100%;
  height: 44px;
  line-height: 44px;
  font-size: 17px;
  z-index: 1;
  .go-back {
    width: 30px;
    position: absolute;
    top: 10px;
    left: 8px;
    color: rgb(135, 135, 135);
  }
}
.film-header-hide {
  background: transparent;
  transition: all 0.3s;
}
</style>
