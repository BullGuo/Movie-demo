<template>
  <div class="recommend-city">
    <div class="gps-city">
      <div class="city-index-title">GPS定位你所在城市</div>
      <ul class="city-index-detail">
        <div class="city-item-detail">
          {{ cityName ? cityName : "--" }}
        </div>
      </ul>
    </div>
    <div class="hot-city">
      <div class="city-index-title">热门城市</div>
      <ul class="city-index-detail">
        <li
          class="city-item-detail"
          v-for="item of hotList"
          :key="item.cityId"
          @click="hotCityClick(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecommendCity",
  props: {
    hotList: {
      type: Array,
      default: () => []
    },
    cityName: {
      type: String,
      default: ""
    }
  },
  methods: {
    hotCityClick(data) {
      this.$emit("cityClick", data);
    }
  }
};
</script>

<style scoped lang="less">
.recommend-city {
  margin-top: 97px;
  background: #fff;
  padding: 15px 0 0 15px;
  .city-index-title {
    color: #797d82;
    font-size: 13px;
    margin-bottom: 10px;
  }
  .city-index-detail {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    flex-wrap: wrap;
    .city-item-detail {
      margin: 0 7.5px 15px;
      height: 30px;
      box-sizing: border-box;
      text-align: center;
      width: 100px;
      line-height: 30px;
      font-size: 14px;
      color: #191a1b;
      border-radius: 3px;
      background: #f4f4f4;
    }
  }
}
</style>
