<template>
  <div class="top-navigation">
    <div class="top-info">
      <van-icon name="arrow-left" class="top-left" />
      <div class="top-right">
        <div class="top-right-dot">
          <img src="../../img/big-top.png" alt="" class="dot-big" />
          <img src="../../img/big-center.png" alt="" class="dot-center" />
          <img src="../../img/big-bottom.png" alt="" class="dot-big" />
        </div>
        <div class="top-right-info">
          <div class="right-start">我的位置</div>
          <div class="right-end">{{ cinemaDetail.name }}</div>
        </div>
        <div class="top-right-exchange">
          <img src="../../img/exchange.png" alt="" />
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
        {{ item.name }}
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
      activeName: "drive"
    };
  },
  methods: {
    // 切换顶部tabs
    handleChange(name) {
      if (this.activeName == name) return;
      this.activeName = name;
      this.$emit("changeWay", name);
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
      margin-top: 20px;
      margin-right: 10px;
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
      width: 50px;
      border-radius: 12px;
      color: black;
    }
    .tabs-item-active {
      background-color: #0a70f6;
      color: white !important;
    }
  }
}
</style>
