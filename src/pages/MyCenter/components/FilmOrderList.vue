<template>
  <div>
    <van-tabs v-model="active">
      <van-tab title="待观看" name="notWatch" />
      <van-tab title="已观看" name="haveWatch" />
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: "FilmOrderList",
  data() {
    return {
      active: "notWatch"
    };
  }
};
</script>

<style scoped></style>
