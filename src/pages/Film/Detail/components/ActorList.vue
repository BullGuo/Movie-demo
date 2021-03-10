<template>
  <div class="actors">
    <div class="actors-title-bar">
      <span class="actors-title-text">演职人员</span>
    </div>
    <detail-swiper
      perview="4"
      class="actorswiper"
      my-class="actorswiper"
      style="height: 140px"
    >
      <li
        class="swiper-slide"
        v-for="(data, index) in $store.state.film_detail.actors"
        :key="index"
        style="width: 85px !important;"
      >
        <div style="width: 85px;height: 85px;position: relative;">
          <img
            style="width: 100%;position: absolute; transform: translateY(-25%)"
            :src="data.avatarAddress"
          />
        </div>
        <span class="actors-name">{{ data.name }}</span>
        <span class="actors-role">{{ data.role }}</span>
      </li>
    </detail-swiper>
  </div>
</template>

<script>
export default {
  name: "ActorList",
  components: {
    DetailSwiper: () => import("./components/DetailSwiper")
  }
};
</script>

<style scoped lang="less">
.actors {
  margin: 10px 0;
  background-color: #fff;
  .actors-title-bar {
    padding: 15px;
    .actors-title-text {
      font-size: 16px;
      text-align: left;
      color: #191a1b;
    }
  }
  .actors-name {
    display: block;
    text-align: center;
    padding-top: 10px;
    font-size: 12px;
    color: #191a1b;
    width: 85px;
    height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: content-box;
  }
  .actors-role {
    display: block;
    text-align: center;
    font-size: 10px;
    color: #797d82;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
