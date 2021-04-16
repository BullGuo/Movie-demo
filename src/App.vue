<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script type="text/javascript">
export default {
  name: "app",
  data() {
    return {};
  }
};
</script>

<style lang="less">
@import "./common/assets/css/base.css";
</style>
