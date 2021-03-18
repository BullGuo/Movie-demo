<template>
  <div class="schedule">
    <div
      class="schedule-item"
      v-for="(item, index) in schedulesList"
      :key="index"
      @click="chooseSeat(item)"
    >
      <div class="left">
        <div class="start-at">
          {{ $moment(item.showAt * 1000).format("LT") }}
        </div>
        <div class="end-at">
          {{ $moment(item.endAt * 1000).format("LT") + "散场" }}
        </div>
      </div>
      <div class="center">
        <div class="language">{{ item.filmLanguage }}</div>
        <div class="hall">{{ item.hallName }}</div>
      </div>
      <div class="right">
        <div class="buy-ticket">购票</div>
        <div class="lowest-price">
          <span class="price-icon">￥</span>
          <span>{{ item.salePrice / 100 }}</span>
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
    }
  },
  methods: {
    chooseSeat(data) {
      this.$router.push({
        name: "schedule",
        params: {
          schedule: data.scheduleId,
          ticketList: [data.maxSalePrice, data.minSalePrice],
          schedulesList: this.schedulesList
        }
      });
    }
  },
  beforeDestroy() {
    this.$store.commit("setTabs", false);
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
}
</style>
<style>
.toast {
  width: 50px;
  height: 50px;
  min-height: 0;
}
</style>
