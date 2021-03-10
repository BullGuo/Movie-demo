<template>
  <div class="swiper-container">
    <ul class="swiper-wrapper">
      <slot />
    </ul>
  </div>
</template>
<script>
import "swiper/swiper-bundle.min.css";
import Swiper, { Navigation, Pagination, Autoplay } from "swiper";
Swiper.use([Navigation, Pagination, Autoplay]);
export default {
  name: "DetailSwiper",
  props: ["perview", "myClass"],
  mounted() {
    /* eslint-disable no-new */
    new Swiper("." + this.myClass, {
      slidesPerView: this.perview,
      spaceBetween: 10
    });
  }
};
</script>
<style scoped lang="less">
.swiper-wrapper {
  padding-left: 15px;
}
</style>
