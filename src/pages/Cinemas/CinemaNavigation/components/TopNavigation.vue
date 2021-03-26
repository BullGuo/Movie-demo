<template>
  <div class="top-navigation">
    <div class="top-info">
      <van-icon name="arrow-left" class="top-left" @click="$router.go(-1)" />
      <div class="top-right">
        <div class="top-right-dot">
          <img src="../../img/big-top.png" alt="" class="dot-big" />
          <img src="../../img/big-center.png" alt="" class="dot-center" />
          <img src="../../img/big-bottom.png" alt="" class="dot-big" />
        </div>
        <div class="top-right-info" @click="handleClick">
          <div class="right-start">{{ startName }}</div>
          <div class="right-end">{{ cinemaDetail.name }}</div>
        </div>
        <div class="top-right-exchange">
          <img src="../../img/exchange.png" alt="" @click="handleExchange" />
        </div>
      </div>
    </div>
    <div class="top-tabs">
      <div
        v-for="item of tabList"
        :key="item.key"
        :class="['tabs-item', item.key == activeName ? 'tabs-item-active' : '']"
        @click="handleChange(item.key)"
      >
        <img :src="item.key | topIconFilter" alt="" />
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopNavigation",
  props: {
    cinemaDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tabList: [
        { name: "驾车", key: "drive" },
        { name: "公交", key: "transit" },
        { name: "骑行", key: "riding" },
        { name: "步行", key: "walk" }
      ],
      activeName: "drive",
      startName: "我的位置",
      lastTime: null // 保存上一次点击时间，防止点击过快
    };
  },
  methods: {
    // 切换顶部tabs
    handleChange(name) {
      if (this.activeName == name) return;
      this.activeName = name;
      this.$emit("changeWay", name);
    },
    handleClick() {
      this.$Toast.fail("抱歉，暂不支持自定义导航！");
    },
    handleExchange() {
      if (this.lastTime && new Date().getTime() - this.lastTime <= 1500) {
        this.$Toast.fail("点击过快，请稍后点击!");
        return;
      }
      this.$Toast.clear();
      this.lastTime = new Date().getTime();
      [this.startName, this.cinemaDetail.name] = [
        this.cinemaDetail.name,
        this.startName
      ];
      this.$emit("exchangeLocation");
    }
  },
  filters: {
    topIconFilter(data) {
      switch (data) {
        case "drive":
          return require("../../img/drive-icon.png");
        case "transit":
          return require("../../img/transit-icon.png");
        case "riding":
          return require("../../img/riding-icon.png");
        case "walk":
          return require("../../img/walk-icon.png");
      }
    }
  }
};
</script>

<style scoped lang="less">
.top-navigation {
  height: 130px;
  padding: 15px 10px 0;
  .top-info {
    display: flex;
    .top-left {
      font-size: 20px;
      /*margin-top: 20px;*/
      /*margin-right: 10px;*/
      margin: 20px 10px 27px 0;
    }
    .top-right {
      width: 300px;
      height: 70px;
      background-color: #f2f3f5;
      display: flex;
      border-radius: 10px;
      .top-right-dot {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0 5px;
        .dot-big {
          width: 10px;
          height: 10px;
        }
        .dot-center {
          width: 20px;
          height: 20px;
          margin: 3px 0;
        }
      }
      .top-right-info {
        width: 85%;
        font-size: 14px;
        .right-start {
          height: 50%;
          line-height: 38px;
          position: relative;
          &:after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            height: 1px;
            width: 100%;
            border-bottom: 1px solid #e0d7d7;
            transform: scaleY(0.5);
          }
        }
        .right-end {
          height: 50%;
          line-height: 38px;
        }
      }
      .top-right-exchange {
        width: 40px;
        text-align: center;
        img {
          width: 20px;
          height: 20px;
          transform: rotateZ(90deg);
          margin-top: 27px;
        }
      }
    }
  }
  .top-tabs {
    display: flex;
    height: 25px;
    line-height: 25px;
    color: white;
    justify-content: space-between;
    text-align: center;
    margin: 10px 10px;
    .tabs-item {
      width: 60px;
      border-radius: 12px;
      color: black;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      > img {
        width: 20px;
      }
    }
    .tabs-item-active {
      background-color: #0a70f6;
      color: white !important;
    }
  }
}
</style>
