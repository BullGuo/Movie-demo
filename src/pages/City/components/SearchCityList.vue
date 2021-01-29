<template>
  <div class="search-city-list">
    <div
      class="search-city-item"
      v-for="item of searchList"
      :key="item.cityId"
      @click="cityClick(item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchCityList",
  props: {
    searchList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    cityClick(value) {
      this.$emit("cityClick", value);
    }
  }
};
</script>

<style scoped lang="less">
.search-city-list {
  position: fixed;
  top: 97px;
  width: 100%;
  height: 100vh;
  overflow: auto;
  .search-city-item {
    height: 44px;
    line-height: 44px;
    font-size: 13px;
    color: #191a1b;
    background: #fff;
    padding-left: 15px;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #ededed;
      transform: scaleY(0.5);
    }
  }
}
</style>
