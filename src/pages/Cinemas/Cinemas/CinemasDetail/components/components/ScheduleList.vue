<template>
  <div class="schedule">
    <div
      class="schedule-item"
      v-for="(item, index) in schedulesList"
      :key="index"
      @click="chooseSeat(item)"
    >
      <div class="left">
        <div :class="['start-at', item.isOnsell ? '' : 'disable']">
          {{ $moment(item.showAt * 1000).format("LT") }}
        </div>
        <div :class="['end-at', item.isOnsell ? '' : 'disable']">
          {{ $moment(item.endAt * 1000).format("LT") + "散场" }}
        </div>
      </div>
      <div class="center">
        <div :class="['language', item.isOnsell ? '' : 'disable']">
          {{ item.filmLanguage }}
        </div>
        <div :class="['hall', item.isOnsell ? '' : 'disable']">
          {{ item.hallName }}
        </div>
      </div>
      <div class="right">
        <div :class="['buy-ticket', item.isOnsell ? '' : 'disable']">
          {{ item.isOnsell ? "购票" : "停售" }}
        </div>
        <div class="lowest-price">
          <span :class="['price-icon', item.isOnsell ? '' : 'disable']"
            >￥</span
          >
          <span :class="item.isOnsell ? '' : 'disable'">{{
            item.salePrice / 100
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScheduleList",
  props: {
    schedulesList: {
      type: Array,
      default: () => []
    },
    activeIndex: [String, Number],
    filmId: [String, Number],
    detail: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    chooseSeat(data) {
      if (!data.isOnsell) {
        this.$Toast({
          message: "当前场次已经停止售票，请选择其他场次",
          position: "bottom"
        });
        return;
      }
      this.$router.push({
        name: "schedule",
        params: {
          schedule: data.scheduleId,
          ticketList: [data.maxSalePrice, data.minSalePrice],
          schedulesList: this.schedulesList,
          detail: this.detail
        },
        query: {
          cinemaId: this.$route.params.cinemaId,
          activeIndex: this.activeIndex,
          filmId: this.filmId
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.schedule-item {
  height: 74px;
  padding: 15px 15px;
  position: relative;
  background: #fff;
  .left {
    float: left;
    width: 84px;
    .start-at {
      font-size: 15px;
      color: #191a1b;
    }
    .end-at {
      font-size: 13px;
      color: #797d82;
      margin-top: 2px;
    }
  }
  .center {
    float: left;
    width: calc(100% - 210px);
    .language {
      font-size: 15px;
      color: #191a1b;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hall {
      font-size: 13px;
      color: #797d82;
      margin-top: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .right {
    float: right;
    padding: 10px 0;
    line-height: 25px;
    color: #ff5f16;
    .buy-ticket {
      float: right;
      width: 50px;
      height: 25px;
      border-radius: 2px;
      position: relative;
      text-align: center;
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
    .lowest-price {
      float: right;
      padding-right: 20px;
      font-size: 15px;
      .price-icon {
        font-size: 10px;
      }
    }
  }
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 1px;
    color: #ededed;
    border-bottom: 1px solid #ededed;
  }
}
.disable {
  color: #d2d6dc !important;
  &:after {
    border: 1px solid #d2d6dc !important;
  }
}
</style>
<style>
.toast {
  width: 50px;
  height: 50px;
  min-height: 0;
}
</style>
