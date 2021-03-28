<template>
  <div class="transit-detail">
    <div class="transit-detail-top">
      <div class="top-time">全程 {{ transitDetail.time | timeFilter }}</div>
      <div class="top-distance">
        步行{{ transitDetail.walking_distance | distanceFilter }}
      </div>
      <div></div>
    </div>
    <div class="transit-detail-bottom">
      <div class="title">我的位置</div>
      <div
        v-for="(item, index) of infoList"
        :key="index"
        :class="[
          'bottom-item',
          item.type != 'walk' && item.isStart ? 'left-after-bg' : ''
        ]"
      >
        <div :class="[item.type == 'walk' ? 'bottom-walk' : 'title']">
          {{ item.message }}
        </div>
        <div class="icon-left" v-if="item.type">
          <img :src="item.type | busIconFilter" alt="" />
        </div>
        <div
          v-if="item.type == 'subway' && item.isStart"
          :class="[
            is_up && unfoldIndex == index
              ? 'bottom-subway-up'
              : 'bottom-subway-down',
            'bottom-subway'
          ]"
          :style="{ '--height': item.via_stops.length * 40 + 'px' }"
          @click="iconClick(item, index)"
        >
          <span class="subway-list">乘坐{{ item.via_stops.length + 1 }}站</span>
          <van-icon
            v-if="item.via_stops.length"
            :name="is_up && unfoldIndex == index ? 'arrow-up' : 'arrow-down'"
            color="#626365"
            class="up-down-icon"
          />
          <div v-for="arr of item.via_stops" :key="arr.id">
            {{ arr.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "transitDetail",
  props: {
    transitDetail: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    transitDetail: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return;
        // this.segmentsList = [...val.segments];
        let aList = [];
        for (let item of val.segments) {
          let walk_des = null;
          let subway_des = null;
          switch (item.transit_mode) {
            case "WALK":
              walk_des = item.instruction.split("到达");
              walk_des[0] = { message: walk_des[0], type: "walk" };
              if (walk_des.length > 1) {
                walk_des[1] = { message: walk_des[1] };
              }
              aList = aList.concat(walk_des);
              break;
            case "SUBWAY":
              aList[aList.length - 1].type = "subway";
              aList[aList.length - 1].isStart = true;
              aList[aList.length - 1].via_stops = [...item.transit.via_stops];
              subway_des = item.instruction.split("到达");
              subway_des[0] = { message: subway_des[0] };
              if (subway_des.length > 1) {
                subway_des[1] = { message: subway_des[1] };
              }
              aList = aList.concat(subway_des[1]);
              break;
            case "BUS":
              break;
          }
        }
        this.infoList = [...aList];
      }
    }
  },
  data() {
    return {
      segmentsList: [],
      infoList: [],
      is_up: false,
      unfoldIndex: null
    };
  },
  methods: {
    iconClick(data, index) {
      if (!data.via_stops.length) return;
      this.unfoldIndex = index;
      this.is_up = !this.is_up;
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
      if (data == "subway") {
        return require("../../img/metro.png");
      } else if (data == "walk") {
        return require("../../img/walk.png");
      }
    }
  }
};
</script>

<style scoped lang="less">
.transit-detail {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 9;
  width: 100%;
  height: 50%;
  background-color: #fff;
  border-radius: 30px 30px 0 0;
  padding: 20px 0 10px;
  font-size: 14px;
  overflow-y: auto;
  .transit-detail-top {
    height: 25%;
    border-bottom: 1px solid #ededed;
    padding: 0 20px;
    .top-time {
      font-weight: bold;
      font-size: 16px;
    }
    .top-distance {
      color: #626365;
    }
  }
  .transit-detail-bottom {
    margin-left: 30px;
    padding: 20px 20px 0;
    height: 79%;
    .title {
      font-weight: bold;
      font-size: 16px;
    }
    .bottom-item {
      position: relative;
      width: 100%;
      margin: 30px 0;
      .bottom-walk {
        font-size: 12px;
        color: #454649;
      }
      .bottom-subway {
        margin: 30px 0;
        transition: all 500ms;
        .subway-list {
          font-size: 12px;
          color: #626365;
        }
        .up-down-icon {
          position: relative;
          top: 2px;
        }
      }
      .bottom-subway-down {
        overflow-y: hidden;
        max-height: 21px;
      }
      .bottom-subway-up {
        overflow-y: hidden;
        max-height: var(--height);
      }
      .icon-left {
        position: absolute;
        left: -30px;
        top: 0px;
        width: 20px;
        height: 20px;
        transform: translateZ(10px);
        /*background-image: url("../../img/metro.png");*/
        /*background-size: 20px 20px;*/
        > img {
          width: 20px;
          height: 20px;
        }
      }
    }
    .left-after-bg {
      position: relative;
      /*transform-style: preserve-3d;*/
      &:before {
        /*overflow: visible;*/
        /*transform: translateZ(-1px);*/
        position: absolute;
        content: "";
        left: -25px;
        top: 0;
        width: 10px;
        height: calc(100% + 54px);
        background-color: #d3256d;
      }
    }
  }
}
</style>
