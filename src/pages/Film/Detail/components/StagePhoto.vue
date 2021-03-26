<template>
  <div class="photos">
    <div class="photos-title-bar">
      <span class="photos-title-text">剧照</span>
      <span
        class="photos-to-all"
        @click="photosAllClick"
        v-if="$store.state.film_detail.photos"
        >全部({{
          $store.state.film_detail.photos &&
            $store.state.film_detail.photos.length
        }})<van-icon name="arrow" class="photos-to-all-icon" />
      </span>
    </div>
    <detail-swiper
      perview="2.4"
      class="photoswiper"
      my-class="photoswiper"
      v-if="$store.state.film_detail.photos"
    >
      <li
        class="swiper-slide"
        v-for="(data, index) in $store.state.film_detail.photos"
        :key="index"
        @click="previewImg(index)"
      >
        <div class="swiper-photos">
          <img class="swiper-photos-photo" :src="data" />
        </div>
      </li>
    </detail-swiper>
    <div v-else class="empty-text">暂无电影剧照</div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
export default {
  name: "StagePhoto",
  props: {
    showStagePhoto: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isPreviewImg: false // 是否预览图片
    };
  },
  methods: {
    photosAllClick() {
      this.$emit("update:showStagePhoto", true);
    },
    previewImg(index) {
      this.isPreviewImg = true;
      ImagePreview({
        images: this.$store.state.film_detail.photos,
        startPosition: index,
        closeable: true,
        closeIconPosition: "top-left",
        onClose() {
          this.isPreviewImg = false;
        }
      });
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
      .photos-to-all-icon {
        position: relative;
        top: 2px;
      }
    }
  }
  .photoswiper {
    padding-bottom: 15px;
    .swiper-slide {
      width: 150px !important;
      overflow-y: hidden;
      .swiper-photos {
        width: 150px;
        height: 100px;
        position: relative;
        .swiper-photos-photo {
          width: 100%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
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
