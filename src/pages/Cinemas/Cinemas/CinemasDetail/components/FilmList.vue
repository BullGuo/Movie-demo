<template>
  <div class="film-list">
    <div class="bg">
      <div
        :style="{
          '--bg': `url('${list[activeIndex] && list[activeIndex].poster}')`
        }"
      />
    </div>
    <div v-if="list.length">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <img
            class="swiper-slide"
            v-for="item of list"
            :src="item.poster"
            alt=""
            :key="item.filmId"
          />
        </div>
      </div>
      <div class="triangle">
        <img src="../img/triangle.png" alt="" />
      </div>
      <van-sticky :offset-top="46">
        <film-detail :detail="list[activeIndex] ? list[activeIndex] : {}" />
      </van-sticky>
      <date-list
        :id="{
          cinemaId: cinemaId,
          filmId: list[activeIndex] ? list[activeIndex].filmId : ''
        }"
        :detail="list[activeIndex] ? list[activeIndex] : {}"
      />
    </div>
    <van-empty v-else description="暂无场次" :image="emptyImg" />
  </div>
</template>

<script>
import "swiper/swiper-bundle.min.css";
import Swiper, { Navigation } from "swiper";
Swiper.use([Navigation]);
export default {
  name: "FilmList",
  props: {
    cinemaId: [String, Number]
  },
  data() {
    return {
      list: [],
      activeIndex: 0,
      filmId: "",
      emptyImg: require("../img/no-warp.png")
    };
  },
  created() {
    console.log(this.$route.query.filmId);
    this.init();
  },
  methods: {
    init() {
      let params = { cinemaId: this.cinemaId, k: 3239016 };
      // 影院电影信息
      this.$axios({
        url: `https://m.maizuo.com/gateway/`,
        params: { ...params },
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"16092348011945091904110593","bc":"510100"}',
          "X-Host": "mall.film-ticket.film.cinema-show-film"
        }
      }).then(res => {
        if (res && res.data.msg == "ok") {
          this.list = [...res.data.data.films];
          let index = 0;
          if (this.$route.query.filmId) {
            index = this.list.findIndex(
              item => item.filmId == this.$route.query.filmId
            );
          }
          this.$nextTick(() => {
            /* eslint-disable no-new */
            new Swiper(".swiper-container", {
              slidesPerView: 4,
              spaceBetween: 12,
              slideToClickedSlide: true, // 点击可切换
              centeredSlides: true,
              initialSlide: index,
              on: {
                slideChange: e => {
                  this.activeIndex = e.activeIndex;
                }
              }
            });
          });
        }
      });
    }
  },
  components: {
    FilmDetail: () => import("./components/FilmDetail"),
    DateList: () => import("./components/DateList")
  }
};
</script>

<style scoped lang="less">
.film-list {
  position: relative;
  .bg {
    height: 160px;
    width: 100%;
    padding: 15px 0;
    overflow: hidden;
    div {
      width: 100%;
      height: 100%;
      background-image: var(--bg);
      filter: blur(30px);
    }
  }
  .swiper-container {
    width: 100%;
    height: 160px;
    padding: 15px 0;
    position: absolute;
    top: 0;
    left: 0;
    .swiper-slide {
      width: 90px !important;
      height: 130px;
      transition: 300ms;
      transform: scale(0.8);
      margin-top: 12px;
    }
  }
  .swiper-slide-active,
  .swiper-slide-duplicate-active {
    transform: scale(1) !important;
    margin-top: 0 !important;
  }
  .triangle {
    text-align: center;
    position: absolute;
    top: 150px;
    left: calc(50% - 5px);
    font-size: 0;
    img {
      width: 20px;
      height: 10px;
    }
  }
  /deep/ .van-empty__image {
    width: 70px;
    height: 70px;
  }
}
</style>
