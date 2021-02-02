<template>
  <div class="service-info">
    <div class="services">
      <div class="detail" v-for="(item, index) in serviceDetail" :key="index">
        <div class="left">{{ item.name }}</div>
        <div class="right">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ServiceInfo",
  props: {
    serviceDetail: Array
  }
};
</script>

<style scoped lang="less">
.service-info {
  position: fixed;
  top: 90px;
  left: 0;
  z-index: -1;
  background-color: #fff;
  .services {
    padding: 0 30px;
    .detail {
      margin-top: 20px;
      color: #797d82;
      display: flex;
      .left {
        min-width: 70px;
        color: #ffb232;
        font-size: 10px;
        margin: 0 2.5px;
        padding: 0 6px;
        border: 1px solid #ffb232;
        border-radius: 1px;
        text-align: center;
        height: 100%;
      }
      .right {
        margin-left: 5px;
        line-height: 15px;
      }
    }
  }
}
</style>
