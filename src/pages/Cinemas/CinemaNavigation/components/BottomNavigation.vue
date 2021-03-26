<template>
  <div
    :class="['bottom-navigation', driveProject.length == 1 ? 'top-filter' : '']"
    v-if="driveProject.length"
  >
    <div class="bottom-navigation-type" v-if="driveProject.length >= 2">
      <div
        v-for="(item, index) in driveProject"
        :key="index"
        @click="changeType(index)"
        :class="index == 0 && driveProject.length != 1 ? 'type-border' : ''"
      >
        <div
          :class="activeNum == index ? 'active active-title' : ''"
          :style="{ visibility: driveProject.length == 1 ? 'hidden' : '' }"
        >
          {{ index == 0 ? "推荐方案" : "方案二" }}
        </div>
        <div :class="['time', activeNum == index ? 'active' : '']">
          {{ item.time | timeFilter }}
        </div>
        <div :class="activeNum == index ? 'active' : ''">
          {{ item.distance | distanceFilter }}
        </div>
      </div>
    </div>
    <div class="bottom-navigation-filter" v-else>
      <div class="time-filter">
        {{ driveProject[0].time | timeFilter }}
      </div>
      <div>
        {{ driveProject[0].distance | distanceFilter }}
      </div>
    </div>
    <div
      :class="[
        'bottom-navigation-info',
        driveProject.length == 1 ? 'bottom-navigation-info-filter' : ''
      ]"
    >
      <div class="navigation" @click="handleNavigation">
        {{ bottomName + "导航" }}
      </div>
    </div>
    <van-action-sheet
      v-model="isShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="handleSelect"
    />
  </div>
</template>

<script>
export default {
  name: "BottomNavigation",
  props: {
    driveProject: {
      type: Array,
      default: () => []
    },
    activeName: {
      type: String,
      default: "drive"
    }
  },
  watch: {
    activeName: {
      immediate: true,
      handler(val) {
        switch (val) {
          case "drive":
            this.bottomName = "驾车";
            return;
          case "riding":
            this.bottomName = "骑行";
            return;
          case "walk":
            this.bottomName = "步行";
            return;
        }
      }
    }
  },
  data() {
    return {
      activeNum: 0,
      bottomName: "",
      isShow: false,
      actions: [{ name: "高德地图" }]
    };
  },
  methods: {
    changeType(index) {
      if (this.activeNum == index) return;
      this.activeNum = index;
      this.$emit("changeType", { index: index, type: "drive" });
    },
    handleNavigation() {
      // if (this.activeName == "riding") {
      //   this.$Toast.fail("骑行暂不支持唤起高德地图");
      //   return;
      // }
      this.isShow = true;
    },
    handleSelect() {
      this.$emit("arouseTheGold", this.activeName);
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
    }
  }
};
</script>

<style scoped lang="less">
.bottom-navigation {
  width: 100%;
  height: 140px;
  border-radius: 30px 30px 0 0;
  background-color: white;
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 10px 20px;
  font-size: 14px;
  > div {
    display: flex;
    text-align: center;
  }
  .bottom-navigation-type {
    > div {
      flex: 1;
      text-align: left;
      margin-left: 58px;
      position: relative;
      .time {
        font-size: 20px;
        font-weight: bold;
      }
      .active {
        color: #4897ff;
      }
      .active-title {
        font-weight: bold;
      }
    }
    .type-border {
      border-right: 1px solid #f3eaea;
    }
  }
  .bottom-navigation-info {
    margin-top: 10px;
    color: white;
    height: 35px;
    line-height: 35px;
    justify-content: center;
    .navigation {
      width: 150px;
      background-color: #1b79ff;
      border-radius: 20px;
      border: 1px solid #eae2e2;
    }
  }
  .bottom-navigation-info-filter {
    margin-top: 0;
  }
  .bottom-navigation-filter {
    flex-direction: column;
    text-align: left;
    color: #626365;
    .time-filter {
      font-size: 20px;
      font-weight: bold;
      color: black;
    }
  }
}
.top-filter {
  height: 110px;
}
</style>
