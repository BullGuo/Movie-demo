<template>
  <div>
    <van-tabbar
      v-model="getActive"
      active-color="#ff5f16"
      v-if="$store.state.is_show_tabs"
    >
      <van-tabbar-item replace to="/menu/film" icon="bar-chart-o"
        >电影
      </van-tabbar-item>
      <van-tabbar-item replace icon="tv-o" to="/menu/cinemas"
        >影院</van-tabbar-item
      >
      <van-tabbar-item replace icon="contact" to="/menu/my_center"
        >我的</van-tabbar-item
      >
    </van-tabbar>
    <transition name="router-transition" mode="out-in">
      <router-view
        :style="
          'height:' +
            ($store.state.is_show_tabs ? 'calc(100vh - 50px)' : '100vh')
        "
    /></transition>
  </div>
</template>

<script>
export default {
  name: "indexAction",
  computed: {
    getActive: {
      get() {
        let name = this.$route.name;
        return name == "nowPlaying"
          ? 0
          : name == "comingSoon"
          ? 0
          : name == "cinemas"
          ? 1
          : 2;
      },
      set(value) {
        return value;
      }
    }
  },
  created() {
    let city = this.$store.state.cityInfo;
    if (!city.cityId && !city.name) {
      this.$router.push({ name: "city" });
    }
  }
};
</script>

<style scoped lang="less">
.router-transition-enter-active {
  transition: all 0.5s;
}
.router-transition-leave-active {
  transition: all 0.5s;
}
.router-transition-enter,
.router-transition-leave-to {
  transform: translateY(30px);
  opacity: 0;
}
</style>
