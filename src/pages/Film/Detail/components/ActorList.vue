<template>
  <div class="actors">
    <div class="actors-title-bar">
      <span class="actors-title-text">演职人员</span>
    </div>
    <detail-swiper
      perview="4"
      class="actorswiper"
      my-class="actorswiper"
      v-if="$store.state.film_detail.actors"
    >
      <li
        class="swiper-slide"
        v-for="(data, index) in $store.state.film_detail.actors"
        :key="index"
      >
        <div class="actors-img">
          <img class="img-item" :src="data.avatarAddress" />
        </div>
        <span class="actors-name">{{ data.name }}</span>
        <span class="actors-role">{{ data.role }}</span>
      </li>
    </detail-swiper>
    <p v-else class="empty-text">暂无演职人员</p>
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
  .actorswiper {
    height: 140px;
    .swiper-slide {
      width: 85px !important;
      .actors-img {
        width: 85px;
        height: 85px;
        position: relative;
        overflow-y: hidden;
        .img-item {
          width: 100%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
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
  }
  .empty-text {
    height: 140px;
    color: #bdc0c5;
    text-align: center;
    line-height: 70px;
    font-size: 14px;
  }
}
</style>
