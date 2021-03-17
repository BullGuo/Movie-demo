<template>
  <div class="notice-msg">
    <van-swipe style="height: 200px;overflow-y: hidden" vertical>
      <van-swipe-item style="height: 200px;">1</van-swipe-item>
      <van-swipe-item style="height: 200px;">2</van-swipe-item>
      <van-swipe-item style="height: 200px;">3</van-swipe-item>
      <van-swipe-item style="height: 200px;">4</van-swipe-item>
    </van-swipe>
    <!--    <div class="swiper-container">-->
    <!--      <div class="swiper-wrapper">-->
    <!--        <div class="swiper-slide">1</div>-->
    <!--        <div class="swiper-slide">2</div>-->
    <!--        <div class="swiper-slide">3</div>-->
    <!--        <div class="swiper-slide">4</div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
// import Swiper from "swiper";
export default {
  name: "NoticeMsg",
  mounted() {
    /* eslint-disable no-new */
    // new Swiper(".swiper-container", {
    //   direction: "vertical",
    //   centeredSlides: true,
    //   autoplay: {
    //     delay: 1000,
    //     disableOnInteraction: true
    //   }
    // slidesPerView: this.perview,
    // spaceBetween: 10
    // });
  }
};
</script>

<style scoped lang="less">
.notice-msg {
  /*height: 40px;*/
  /*overflow-y: hidden;*/
  height: 200px;
  color: #e68e1a;
  background-color: #fbf4d8;
  .swiper-container {
    height: 100%;
    .swiper-slide {
      height: 100%;
      line-height: 40px;
    }
  }
}
</style>
