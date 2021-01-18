<template>
  <div>
    <van-tabbar
      v-model="active"
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
    <router-view
      :style="
        'height:' + ($store.state.is_show_tabs ? 'calc(100vh - 50px)' : '100vh')
      "
    />
  </div>
</template>

<script>
export default {
  name: "indexAction",
  data() {
    return {
      active: 0
    };
  }
};
</script>

<style scoped></style>
