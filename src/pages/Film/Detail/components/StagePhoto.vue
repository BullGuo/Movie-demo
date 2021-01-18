<template>
  <div class="photos">
    <div class="photos-title-bar" @click="photosAllClick">
      <span class="photos-title-text">剧照</span>
      <span class="photos-to-all"
        >全部({{ $store.state.film_detail.photos.length }})<van-icon
          name="arrow"
          style="vertical-align: middle;"
        />
      </span>
    </div>
    <detail-swiper
      perview="3"
      class="actorswiper"
      myclass="actorswiper"
      style="height: 140px"
    >
      <li
        class="swiper-slide"
        v-for="(data, index) in $store.state.film_detail.photos"
        :key="index"
        style="width: 150px;min-width: 150px"
      >
        <div class="swiper-photos">
          <img class="swiper-photos-photo" :src="data" />
        </div>
      </li>
    </detail-swiper>
  </div>
</template>

<script>
export default {
  name: "StagePhoto",
  methods: {
    photosAllClick() {
      console.log(11111111111111);
    }
  },
  components: {
    DetailSwiper: () => import("./components/DetailSwiper")
  }
};
</script>

<style scoped lang="less">
.photos {
  margin: 10px 0 60px;
  background-color: #fff;
  .photos-title-bar {
    padding: 15px;
    height: 62px;
    width: 100%;
    box-sizing: border-box;
    span {
      display: inline-block;
      height: 22.5px;
      line-height: 22px;
    }
    .photos-title-text {
      font-size: 16px;
      text-align: left;
      color: #191a1b;
    }
    .photos-to-all {
      font-size: 13px;
      color: #797d82;
      float: right;
    }
  }
  .photos-name {
    display: block;
    text-align: center;
    padding-top: 10px;
    font-size: 12px;
    color: #191a1b;
    width: 85px;
    height: 18px;
  }
  .photos-role {
    display: block;
    text-align: center;
    font-size: 10px;
    color: #797d82;
  }
  .swiper-photos {
    width: 150px;
    height: 100px;
    .swiper-photos-photo {
      width: 100%;
    }
  }
}
</style>
