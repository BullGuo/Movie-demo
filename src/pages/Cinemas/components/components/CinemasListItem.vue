<template>
  <div class="cinemas-list-item" @click="goCinemasDetail">
    <div class="item-left">
      <span class="name">{{ detail.name }}</span>
      <img
        src="../../img/is-visted.png"
        alt=""
        class="is-visted"
        v-if="detail.isVisited"
      />
      <span class="location">{{ detail.address }}</span>
    </div>
    <div class="item-right">
      <span
        class="price"
        v-if="!detail.ticketTypes"
        :style="'visibility:' + (detail.lowPrice ? 'visible' : 'hidden')"
      >
        <span class="price-symbol">￥</span>
        <span>{{ detail.lowPrice / 100 }}</span>
        <span>起</span>
      </span>
      <span class="distance">
        <img
          v-if="detail.ticketTypes"
          src="../../img/location-icon.png"
          alt=""
        />
        <strong>距离未知</strong>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "CinemasListItem",
  props: {
    detail: Object
  },
  methods: {
    goCinemasDetail() {
      this.$router.push({
        name: "cinemas_detail",
        params: { cinemaId: this.detail.cinemaId }
      });
    }
  }
};
</script>

<style scoped lang="less">
.cinemas-list-item {
  width: 100vw;
  height: 75px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 15px;
  position: relative;
  .item-left {
    float: left;
    width: calc(100% - 65px);
    padding-right: 15px;
    box-sizing: border-box;
    color: #191a1b;
    .name {
      max-width: 80%;
      display: inline-block;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .is-visted {
      width: 32px;
      height: 16.5px;
      margin: 0 0 -2px 4px;
    }
    .location {
      font-size: 12px;
      color: #797d82;
      display: block;
      max-width: 80%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      margin-top: 5px;
    }
  }
  .item-right {
    float: right;
    color: #ff5f16;
    text-align: center;
    .price {
      height: 22px;
      line-height: 22px;
      display: block;
      .price-symbol {
        font-size: 11px;
      }
    }
    .distance {
      color: #797d82;
      font-size: 11px;
      display: block;
      margin-top: 5px;
      img {
        width: 13px;
        height: 17.5px;
        display: block;
        margin: 0 auto;
      }
      strong {
        display: block;
        font-weight: 400;
        margin-top: 5px;
      }
    }
  }
  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #ededed;
    transform: scaleY(0.5);
  }
}
</style>
