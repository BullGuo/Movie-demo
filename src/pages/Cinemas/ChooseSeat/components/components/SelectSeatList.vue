<template>
  <div class="select-seats" v-if="selectedSeatList.length">
    <div>
      <div
        v-for="item of selectedSeatList"
        :key="item.offerSeatId"
        class="select-item"
      >
        <div class="seat-name">
          {{ `${item.rowNum}排${item.columnNum}座` }}
        </div>
        <div class="seat-price">
          <span>￥{{ ticketList[item.sectionId == 637 ? 0 : 1] / 100 }}</span>
          <van-icon name="cross" class="right-icon" @click="deleteSeat(item)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectSeatList",
  props: {
    selectedSeatList: {
      type: Array,
      default: () => []
    },
    ticketList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    deleteSeat(data) {
      this.$bus.$emit("deleteSeat", data);
    }
  }
};
</script>

<style scoped lang="less">
.select-seats {
  background-color: #fff;
  padding: 0 10px 10px;
  > div {
    position: relative;
    padding-top: 10px;
    overflow-x: scroll;
    display: flex;
    /* 隐藏滚动条 */
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    &::-webkit-scrollbar {
      display: none;
    }
    &:before {
      content: "";
      position: absolute;
      left: -50%;
      bottom: -50%;
      right: -50%;
      top: -50%;
      border-top: 1px solid #ededed;
      transform: scale(0.5);
    }
    .select-item {
      background-color: hsla(0, 0%, 95.7%, 0.6);
      border-radius: 2px;
      padding: 8px 25px 8px 10px;
      min-width: 85px !important;
      margin-right: 15px;
      flex-shrink: 0;
      .seat-name {
        font-size: 15px;
        color: #191a1b;
      }
      .seat-price {
        position: relative;
        span {
          font-size: 13px;
          color: rgb(250, 182, 70);
        }
        .right-icon {
          position: absolute;
          right: -21px;
          top: 1px;
          font-size: 15px;
        }
      }
    }
  }
}
</style>
