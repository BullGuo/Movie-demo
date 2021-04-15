<template>
  <router-view />
</template>

<script>
export default {
  name: "indexAction",
  created() {
    this.$store.commit("setTabs", true);
  }
};
</script>

<style scoped></style>
