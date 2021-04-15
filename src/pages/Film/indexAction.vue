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
  data() {
    return {
      lastActive: null // 保留上一次tabs选中项（解决跳转详情时选中项的更改）
    };
  },
  computed: {
    active: {
      get() {
        if (this.$route.name == "detail") {
          return this.lastActive;
        }
        let tabs = this.$route.name == "nowPlaying" ? 0 : 1;
        return tabs;
      },
      set(value) {
        this.lastActive = value;
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
  },
  created() {
    this.$store.commit("setTabs", true);
  }
};
</script>

<style scoped lang="less">
.no-more {
  height: 10px;
  background-color: #ededed;
  color: #bdc0c5;
}
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
