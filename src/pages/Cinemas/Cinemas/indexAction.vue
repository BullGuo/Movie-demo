<template>
  <div>
    <div v-if="$store.state.is_show_tabs">
      <cinemas-top-filter />
      <cinemas-list />
    </div>
  </div>
</template>

<script>
export default {
  name: "indexAction",
  components: {
    CinemasTopFilter: () => import("../components/CinemasTopFilter"),
    CinemasList: () => import("../components/CinemasList")
  }
};
</script>

<style scoped lang="less"></style>
