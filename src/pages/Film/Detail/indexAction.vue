<template>
  <div style="background-color: #f4f4f4">
    <film-info />
    <actor-list />
    <stage-photo />
  </div>
</template>

<script>
export default {
  name: "indexAction",
  props: {
    id: [Number, String]
  },
  created() {
    this.$store.commit("setTabs", false);
  },
  beforeDestroy() {
    this.$store.commit("setTabs", true);
  },
  components: {
    FilmInfo: () => import("./components/FilmInfo"),
    ActorList: () => import("./components/ActorList"),
    StagePhoto: () => import("./components/StagePhoto")
  }
};
</script>

<style scoped></style>
