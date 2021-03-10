<template>
  <div>
    <!--    <van-sticky>-->
    <van-tabs
      v-model="active"
      swipeable
      animated
      border
      color="#ff5f16"
      line-height="2px"
      line-width="56px"
      title-active-color="#ff5f16"
      v-if="$store.state.is_show_tabs"
    >
      <van-tab title="正在热映" to="/menu/film/nowPlaying" />
      <van-tab title="即将上映" to="/menu/film/comingSoon" />
    </van-tabs>
    <!--    </van-sticky>-->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "indexAction",
  computed: {
    active: {
      get() {
        return this.$route.name == "nowPlaying" ? 0 : 1;
      },
      set(value) {
        return value;
      }
    }
  },
  watch: {
    active: {
      immediate: true,
      handler(val) {
        let params = { type: val == 1 ? 2 : 1, pageNum: 1 };
        this.$store.commit("setParams", params);
        this.$store.commit("setFilmList", {
          films: [],
          film_list_total: 0
        });
        this.$store.dispatch("getFilmList");
      }
    }
  }
};
</script>

<style scoped lang="less">
.no-more {
  height: 10px;
  background-color: #ededed;
  color: #bdc0c5;
}
</style>
