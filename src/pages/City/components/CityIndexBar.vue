<template>
  <div class="city-list">
    <van-index-bar
      highlight-color="red"
      :sticky-offset-top="97"
      :index-list="indexList"
      class="index-bar"
    >
      <div v-for="(item, key) in dataDetail" :key="key">
        <van-index-anchor :index="key" />
        <van-cell
          v-for="arr in item"
          :title="arr.name"
          :key="arr.cityId"
          @click="cityBarClick(arr)"
        />
      </div>
    </van-index-bar>
  </div>
</template>

<script>
export default {
  name: "CityIndexBar",
  props: {
    dataDetail: Object
  },
  watch: {
    dataDetail: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return;
        this.indexList = [...Object.keys(val)];
      }
    }
  },
  data() {
    return {
      indexList: []
    };
  },
  methods: {
    cityBarClick(value) {
      this.$emit("cityClick", value);
    }
  }
};
</script>

<style scoped lang="less">
.city-list {
  box-sizing: border-box;
  height: calc(100vh - 97px);
  background: #f4f4f4;
  .index-bar {
    height: 100%;
  }
  /deep/ .van-index-bar__sidebar {
    right: -7px;
    top: 55%;
    .van-index-bar__index {
      padding-top: 4px;
    }
  }
}
</style>
