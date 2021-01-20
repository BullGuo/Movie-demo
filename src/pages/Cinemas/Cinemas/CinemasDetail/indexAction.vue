<template>
  <div>11111111111</div>
</template>

<script>
export default {
  name: "indexAction",
  created() {
    this.$store.commit("setTabs", false);
  },
  beforeDestroy() {
    this.$store.commit("setTabs", true);
  }
};
</script>

<style scoped></style>
