<template>
  <van-nav-bar
    :title="navBarTitle"
    left-arrow
    fixed
    placeholder
    @click-left="onClickLeft"
    class="nav-bar"
  />
</template>

<script>
export default {
  name: "MovieNavBar",
  props: {
    navBarTitle: {
      type: String,
      default: ""
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang="less">
.nav-bar {
  margin-bottom: 10px;
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
</style>
