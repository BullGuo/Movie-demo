<template>
  <div class="stage-photo-detail">
    <div class="film-header">
      <img
        src="./img/go-back-icon.png"
        alt=""
        class="go-back"
        @click="goBack"
      />
      <span>剧照（{{ $store.state.film_detail.photos.length }}）</span>
    </div>
    <ul class="detail-ul">
      <li v-for="(item, index) in $store.state.film_detail.photos" :key="index">
        <img class="detail-img" :src="item" alt="" @click="previewImg(index)" />
      </li>
    </ul>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
export default {
  name: "StagePhotoDetail",
  props: {
    showStagePhoto: Boolean
  },
  methods: {
    goBack() {
      this.$emit("update:showStagePhoto", false);
    },
    previewImg(index) {
      ImagePreview({
        images: this.$store.state.film_detail.photos,
        startPosition: index,
        closeable: true,
        closeIconPosition: "top-left"
      });
    }
  }
};
</script>

<style scoped lang="less">
.stage-photo-detail {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .film-header {
    transition: all 0.3s;
    background: #fff;
    color: #191a1b;
    text-align: center;
    position: fixed;
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 17px;
    z-index: 1;
    .go-back {
      width: 30px;
      position: absolute;
      top: 6px;
      left: 5px;
      color: rgb(135, 135, 135);
    }
  }
  .detail-ul {
    margin-top: 44px;
    .detail-img {
      width: 123px;
      height: 123px;
      float: left;
      margin: 0 1.5px 1.5px 0;
    }
  }
}
</style>
