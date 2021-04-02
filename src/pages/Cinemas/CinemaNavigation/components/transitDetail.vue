<template>
  <div class="transit-detail">
    <div class="transit-detail-top">
      <div class="top-time">全程 {{ transitDetail.time | timeFilter }}</div>
      <div class="top-distance">
        步行{{ transitDetail.walking_distance | distanceFilter }}
      </div>
      <div class="top-bus">
        <div v-for="(item, index) in busList" :key="index">
          <img :src="item.type | busIconFilter" alt="" />
          <div :class="item.type == 'bus' ? 'transit-class' : 'metro-class'">
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
    <div class="transit-detail-bottom">
      <div class="title">
        <span>我的位置</span>
        <img src="../../img/start.png" alt="" />
      </div>
      <div
        v-for="(item, index) of infoList"
        :key="index"
        :class="[
          'bottom-item',
          item.type == 'walk'
            ? 'walk-margin'
            : item.isStart
            ? 'left-after-bg'
            : ''
        ]"
        :style="{
          '--bg':
            item.type == 'subway'
              ? '#d3256d'
              : item.type == 'bus'
              ? '#5486FF'
              : ''
        }"
      >
        <div :class="[item.type == 'walk' ? 'bottom-walk' : 'title']">
          {{ item.message }}
        </div>
        <img
          v-if="item.type == 'walk'"
          src="../../img/ellipsis.png"
          alt=""
          class="ellipsis-top"
        />
        <img
          v-if="item.type == 'walk'"
          src="../../img/ellipsis.png"
          alt=""
          class="ellipsis-bottom"
        />
        <img
          class="icon-left"
          v-if="item.type"
          :src="item.type | busIconFilter"
          alt=""
        />
        <div>{{ item.subway_line }}</div>
        <div
          v-if="item.type !== 'walk' && item.isStart"
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
          <div v-for="arr of item.via_stops" :key="arr.id" class="subway-list">
            {{ arr.name }}
          </div>
        </div>
      </div>
      <div class="title">
        <span>{{ cinemaDetail.name }}</span>
        <img src="../../img/end.png" alt="" />
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
    },
    cinemaDetail: {
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
        console.log(val);
        let aList = [];
        for (let item of val.segments) {
          let walk_des = null;
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
              aList = this.handleData("subway", item, aList);
              break;
            case "BUS":
              aList = this.handleData("bus", item, aList);
              break;
          }
        }
        this.infoList = [...aList];
      }
    }
  },
  data() {
    return {
      infoList: [],
      is_up: false,
      unfoldIndex: null,
      busList: []
    };
  },
  methods: {
    handleData(key, data, list) {
      list[list.length - 1].type = key;
      list[list.length - 1].isStart = true;
      list[list.length - 1].via_stops = [...data.transit.via_stops];
      let bus_des = null;
      if (key == "bus") {
        bus_des = data.instruction.substring(
          2,
          data.instruction.indexOf("路(") + 1
        );
      } else {
        bus_des = data.instruction.substring(
          2,
          data.instruction.indexOf("号线(") + 2
        );
      }
      list[list.length - 1].subway_line = bus_des;
      this.busList.push({ type: key, text: bus_des });
      let subway_des = data.instruction.split("到达");
      if (subway_des.length > 1) {
        subway_des[1] = { message: subway_des[1] };
      }
      list = list.concat(subway_des[1]);
      return list;
    },
    iconClick(data, index) {
      if (!data.via_stops.length) return;
      if (this.unfoldIndex == index) {
        this.is_up = !this.is_up;
        return;
      }
      this.unfoldIndex = index;
      this.is_up = true;
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
      } else if (data == "bus") {
        return require("../../img/transit.png");
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
  height: 52%;
  background-color: #fff;
  border-radius: 30px 30px 0 0;
  padding: 20px 0 10px;
  margin-bottom: 12px;
  font-size: 14px;
  overflow-y: auto;
  .transit-detail-top {
    height: 30%;
    border-bottom: 1px solid #ededed;
    padding: 0 20px;
    .top-time {
      font-weight: bold;
      font-size: 16px;
    }
    .top-distance {
      color: #626365;
    }
    .top-bus {
      overflow: hidden;
      white-space: nowrap;
      display: flex;
      align-items: center;
      margin-top: 10px;
      > div {
        height: 20px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        img {
          width: 20px;
        }
        div {
          line-height: 20px;
          height: 20px;
          padding: 0 3px 0 15.5px;
          margin-left: -12.5px;
          border-radius: 4px;
          border-left: none !important;
        }
        .metro-class {
          border: 1px solid #d97ba3;
          color: #d3256d;
        }
        .transit-class {
          border: 1px solid #8eabec;
          color: #5486ff;
        }
      }
    }
  }
  .transit-detail-bottom {
    margin-left: 30px;
    padding: 20px 20px 0;
    height: 79%;
    .title {
      font-weight: bold;
      font-size: 16px;
      position: relative;
      > img {
        position: absolute;
        left: -34px;
        top: -1px;
        width: 28px;
        height: 28px;
      }
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
      .ellipsis-top {
        position: absolute;
        left: -35px;
        top: -35px;
        width: 30px;
        height: 30px;
      }
      .ellipsis-bottom {
        position: absolute;
        left: -35px;
        top: 23px;
        width: 30px;
        height: 30px;
      }
      .icon-left {
        position: absolute;
        left: -30px;
        top: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }
    }
    .left-after-bg {
      &:before {
        position: absolute;
        content: "";
        left: -25px;
        top: 0;
        width: 10px;
        height: calc(100% + 54px);
        background-color: var(--bg);
        border-radius: 10px;
      }
    }
    .walk-margin {
      margin: 40px 0;
    }
  }
}
</style>
