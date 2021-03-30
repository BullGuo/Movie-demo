<template>
  <div class="transit-list">
    <div v-if="transitList.length">
      <div
        v-for="(item, index) of transitList"
        :key="index"
        class="item"
        @click="goToNavigation(item)"
      >
        <div class="top">
          <div class="time">{{ item.time | timeFilter }}</div>
          <div class="walking-distance">
            <img src="../../img/walk.png" alt="" />
            <div>{{ item.walking_distance | distanceFilter }}</div>
          </div>
        </div>
        <div class="bottom">
          <div
            v-for="(arr, ind) of busFilter(item)"
            :key="ind"
            class="bottom-item"
          >
            <img :src="arr.key | busIconFilter" alt="" class="type-icon" />
            <div :class="arr.key == 'BUS' ? 'transit-class' : 'metro-class'">
              <div class="title">{{ arr.name }}</div>
            </div>
            <img
              src="../../img/to-right.png"
              alt=""
              class="to-right"
              v-if="ind != busFilter(item).length - 1"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!transitList.length && !notTransit">
      <van-skeleton
        :row="2"
        :row-width="['50%', '100%']"
        class="item skeleton"
        v-for="index in 5"
        :key="index"
      />
    </div>
    <van-empty
      v-else-if="notTransit"
      description="暂无数据"
      :image="emptyImg"
    />
  </div>
</template>

<script>
export default {
  name: "TransitList",
  props: {
    transitList: {
      type: Array,
      default: () => []
    },
    notTransit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      emptyImg: require("@/common/assets/img/empty.png")
    };
  },
  methods: {
    goToNavigation(data) {
      this.$emit("showTransDetail", data);
    }
  },
  filters: {
    timeFilter(time) {
      let hour = Math.floor(time / 3600);
      let minute = Math.ceil(time / 60) - hour * 60;
      if (hour) {
        return `${hour}时${minute}分`;
      } else {
        return `${minute}分钟`;
      }
    },
    distanceFilter(distance) {
      if (distance >= 1000) {
        return (distance / 1000).toFixed(1) + "公里";
      }
      return distance + "米";
    },
    busIconFilter(data) {
      if (data == "BUS") {
        return require("../../img/transit.png");
      } else {
        return require("../../img/metro.png");
      }
    }
  },
  computed: {
    busFilter() {
      return data => {
        let busList = data.segments.filter(
          item => item.transit_mode == "BUS" || item.transit_mode == "SUBWAY"
        );
        let busDetailList = [];
        for (let item of busList) {
          let index = item.instruction.indexOf("(");
          busDetailList.push({
            name: item.instruction.substring(2, index),
            key: item.transit_mode
          });
        }
        return busDetailList;
      };
    }
  }
};
</script>

<style scoped lang="less">
.transit-list {
  position: absolute;
  bottom: 0;
  z-index: 10;
  width: 100%;
  height: calc(100% - 130px);
  background-color: #f7f7f7;
  overflow-y: auto;
  padding: 10px;
  font-size: 15px;
  .item {
    width: 100%;
    min-height: 80px;
    background-color: #fff;
    border-radius: 10px;
    margin-bottom: 10px;
    padding: 0 10px;
    .top {
      display: flex;
      height: 40px;
      line-height: 40px;
      font-weight: 500;
      .time {
        font-size: 18px;
      }
      .walking-distance {
        display: flex;
        img {
          width: 15px;
          height: 15px;
          margin: 11px 0 0 11px;
        }
      }
    }
    .bottom {
      display: flex;
      overflow: hidden;
      .bottom-item {
        display: flex;
        align-items: center;
        .transit-class {
          border: 2px solid #8eabec;
          color: #5486ff;
        }
        .metro-class {
          border: 2px solid #d97ba3;
          color: #d3256d;
        }
        .type-icon {
          width: 25px;
          height: 25px;
        }
        .title {
          margin: 0 3px;
          height: 100%;
        }
        > div {
          height: 25px;
          box-sizing: border-box;
          padding: 0 0 0 12.5px;
          margin-left: -12.5px;
          line-height: 22px;
          border-radius: 4px;
          border-left: none !important;
          text-align: center;
          font-size: 14px;
        }
      }
      .to-right {
        width: 12px;
        height: 12px;
        margin: 0 5px;
      }
    }
  }
  .skeleton {
    align-items: center;
  }
}
/deep/ .van-skeleton__row {
  height: 20px;
}
</style>
