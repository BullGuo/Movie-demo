<template>
  <div class="action-card">
    <van-collapse v-model="activeNames" :border="false">
      <van-collapse-item name="collapse">
        <template #title>
          <div
            v-if="cardDetail.film && cardDetail.film.name"
            class="card-collapse-title"
          >
            {{ cardDetail.film.name }}
          </div>
          <div class="card-collapse-desc">
            {{ cardDetail | cardFilter(that) }}
          </div>
        </template>
        <template #value>
          <div class="item-color">
            {{ activeNames.length ? "收起场次" : "切换场次" }}
          </div>
        </template>
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div
              :class="[
                'swiper-slide',
                cardDetail.scheduleId == item.scheduleId ? 'select' : ''
              ]"
              v-for="(item, index) of schedulesList"
              :key="index"
              @click="changeTiming(item)"
            >
              <div class="start-at">
                {{ $moment(item.showAt * 1000).format("LT") }}
              </div>
              <div class="language">{{ item.filmLanguage + item.imagery }}</div>
              <div class="price">￥{{ item.minSalePrice / 100 }}起</div>
            </div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  name: "ActionCard",
  props: {
    cardDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeNames: [],
      that: this,
      schedulesList: []
    };
  },
  created() {
    this.schedulesList = this.$route.params.schedulesList || [];
  },
  watch: {
    activeNames: {
      immediate: true,
      handler(val) {
        if (!val.length) return;
        this.$nextTick(() => {
          /* eslint-disable no-new */
          new Swiper(".swiper-container", {
            slidesPerView: 4,
            spaceBetween: 10
          });
        });
      }
    }
  },
  methods: {
    changeTiming(data) {
      if (this.cardDetail.scheduleId == data.scheduleId) return;
      this.$emit("changeTiming", { scheduleId: data.scheduleId });
    }
  },
  filters: {
    cardFilter(value, that) {
      if (JSON.stringify(value) === "{}") return;
      let date = that.$moment(value.showAt * 1000).format("MMMDo LT");
      date = date + " " + value.film.language + value.imagery;
      let week = that.$moment(value.showAt * 1000).day();
      switch (week) {
        case 1:
          return "周一" + date;
        case 2:
          return "周二" + date;
        case 3:
          return "周三" + date;
        case 4:
          return "周四" + date;
        case 5:
          return "周五" + date;
        case 6:
          return "周六" + date;
        case 0:
          return "周日" + date;
      }
    }
  }
};
</script>

<style scoped lang="less">
.action-card {
  position: fixed;
  bottom: 45px;
  left: 0;
  background-color: #f4f4f4;
  padding: 10px;
  z-index: 9;
  width: 100%;
  .item-color {
    color: #ff5f16;
  }
  .card-collapse-title {
    font-size: 15px;
  }
  .card-collapse-desc {
    color: #797d82;
    font-size: 13px;
  }
  .swiper-container {
    padding-bottom: 10px;
    background-color: #fff;
    .swiper-slide {
      background-color: hsla(0, 0%, 95.7%, 0.6);
      width: 70px !important;
      height: 60px;
      padding: 6px 0;
      text-align: center;
      border-radius: 2px;
      .start-at {
        font-size: 14px;
        color: #191a1b;
        line-height: 17px;
      }
      .language {
        font-size: 10px;
        color: #bdc0c5;
        width: 60px;
        line-height: 14px;
        white-space: normal;
        text-overflow: ellipsis;
        overflow: hidden;
        margin: 2px auto 0;
      }
      .price {
        font-size: 13px;
        color: #797d82;
      }
    }
    .select {
      background-color: #fffbfb;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        left: -50%;
        bottom: -50%;
        right: -50%;
        top: -50%;
        border: 1px solid #ff5f16;
        border-radius: 4px;
        transform: scale(0.5);
      }
    }
  }
  /deep/ .van-cell--clickable {
    background-color: #fff;
    &:after {
      border: none;
    }
  }
  /deep/ .van-cell__right-icon {
    color: #ff5f16;
  }
  /deep/ .van-cell__value {
    flex: none;
  }
  /deep/ .van-cell {
    border-radius: 4px;
    z-index: 10;
  }
}
</style>
