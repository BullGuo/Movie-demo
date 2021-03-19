<template>
  <!--  <div-->
  <!--    class="seating-chart"-->
  <!--    :style="{-->
  <!--      '&#45;&#45;width': seatingChart.width,-->
  <!--      '&#45;&#45;height': seatingChart.height-->
  <!--    }"-->
  <!--    v-if="seatingChart.width && seatingChart.height"-->
  <!--  >-->
  <!--    <template>-->
  <!--      <div v-for="item in seatingChart.width * seatingChart.height" :key="item">-->
  <!--        <p v-if="aaaa(item)">-->
  <!--          {{ item }}-->
  <!--        </p>-->
  <!--      </div>-->
  <!--    </template>-->
  <!--  </div>-->
  <div>
    <seat-area
      :seatAreaHeightRem="seatAreaHeightRem"
      :seatAreaWidthRem="seatAreaWidthRem"
      :seatScale="seatScale"
      :thumbnailWidthRem="thumbnailBoxWidth"
      :thumbnailHeightRem="thumbnailBoxHeight"
      :positionDistin="positionDistin"
      :seatToolArr="seatToolArr"
      :yMax="yMax"
      :seatBoxHeight="seatBoxHeight"
      :middleLine="middleLine"
      :horizontalLine="horizontalLine"
    >
      <!--以下为缩略座位图具名插槽 开始-->
      <template slot="thumbnail-seat-slot">
        <template v-for="seatItem in seatList">
          <div
            class="thumbnail-seat-class"
            :key="'thumbnail' + seatItem.offerSeatId"
            :style="{
              height: thumbnailHeight + 'rem',
              width: thumbnailWidth + 'rem',
              background: thumbnailBackground(seatItem),
              top: seatItem.rowNum * thumbnailPositionDistin + 'rem',
              left: seatItem.columnNum * thumbnailPositionDistin + 'rem'
            }"
          />
        </template>
      </template>
      <!--以上为缩略座位图具名插槽 结束-->
      <!--以下为座位图具名插槽 开始-->
      <template slot="seat-area-slot">
        <div
          class="seatBox"
          :style="{
            transform: 'scale(' + seatScale + ')',
            width: seatBoxWidth + 'rem',
            height: seatBoxHeight + 'rem',
            marginLeft: seatBoxCenterMargin + 'rem'
          }"
        >
          <!--中轴线-->
          <div
            v-show="seatList.length > 0"
            class="middle-line"
            :style="{ height: seatBoxHeight + 'rem', left: middleLine + 'rem' }"
          />
          <!--列表-->
          <template v-for="(item, index) in seatList">
            <div
              class="seatClass"
              @click="clickSeat(index)"
              :key="item.offerSeatId"
              :style="{
                top: item.rowNum * positionDistin + 'rem',
                left: item.columnNum * positionDistin + 'rem'
              }"
            >
              <img
                class="seatImgClass"
                :seatId="item.offerSeatId"
                :seatIndex="index"
                :src="getSeatImg(item)"
              />
            </div>
          </template>
        </div>
      </template>
      <!--以上为座位图具名插槽 结束-->
    </seat-area>
  </div>
</template>

<script>
export default {
  name: "SeatingChart",
  props: {
    seatingChart: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    seatingChart(val) {
      console.log(val);
      this.seatList = val.seats;
      this.xMax = val.width;
      this.yMax = val.height;
    }
  },
  data() {
    return {
      seatList: [],
      xMax: null,
      yMax: null,
      positionDistin: 0.5, // 每个座位偏移距离
      seatAreaWidthRem: 10, // 座位区域横向rem最大值 用于和 seatAreaHeightRem 共同计算区域缩放比例
      scale: 1, // 区域放大尺寸
      top: 0, // 单位rem
      left: 0, // 单位rem
      thumbnailWidth: 0.1, // 缩略图每个座位的宽
      thumbnailHeight: 0.1, // 缩略图每个座位的高
      thumbnailPositionDistin: 0.15 // 缩略图每个座位偏移距离
    };
  },
  created() {
    this.$Toast.loading({
      forbidClick: true,
      duration: 0,
      loadingType: "spinner",
      className: "toast"
    });
    this.$nextTick(() => {
      this.$Toast.clear();
    });
  },
  computed: {
    getSeatImg() {
      return function(data) {
        if (data.isOccupied) {
          return require("../../img/sold-out.png"); // 已售
        } else if (data.sectionId == 637) {
          return require("../../img/seat-two.png"); // 居中好座位
        } else if (data.isBroken) {
          return require("../../img/service.png"); // 维修不可选
        } else {
          return require("../../img/seat-one.png"); // 普通座位
        }
      };
    },
    // 座位区域高度rem
    seatAreaHeightRem() {
      let screenRem =
        (document.body.clientWidth ||
          window.innerWidth ||
          document.documentElement.clientWidth) / 10;
      let height =
        document.documentElement.clientHeight ||
        window.innerHeight ||
        document.body.clientHeight;
      // 除了座位区域的大小
      let otherDom = 46 + 40 + 40 + 45 + 88; // 头+排期信息+座位示例 +底部快捷选择+确认按钮
      // 剩下的座位区域的大小
      return (height - otherDom) / screenRem;
    },
    // 竖中轴线
    middleLine() {
      return (
        (this.xMax / 2 + 1) * this.positionDistin -
        (this.xMax % 2 ? 0.05 : 0.025)
      );
    },
    // 横中轴线
    horizontalLine() {
      console.log((this.yMax / 2 + 1) * this.positionDistin - 0.025);
      return (this.yMax / 2 + 1) * this.positionDistin - 0.025;
    },
    // 让影厅居中展示的偏移值
    seatBoxCenterMargin() {
      return -(this.seatBoxWidth * this.seatScale) / 2;
    },
    // class 为 seatBox 的宽度值 单位为rem
    seatBoxWidth() {
      return (this.xMax + 1) * this.positionDistin + 0.5;
    },
    // class 为 seatBox 的高度值 单位为rem
    seatBoxHeight() {
      return (this.yMax + 1) * this.positionDistin + 0.5;
    },
    // 根据影厅的大小缩放比例(需要把影厅全部显示出来)
    seatScale() {
      let seatScaleX = 1;
      let seatScaleY = 1;
      seatScaleX = this.seatAreaWidthRem / this.seatBoxWidth;
      seatScaleY = this.seatAreaHeightRem / this.seatBoxHeight;
      console.log(seatScaleX < seatScaleY ? seatScaleX : seatScaleY);
      return seatScaleX < seatScaleY ? seatScaleX : seatScaleY;
    },
    // 缩放.box区域 x轴的中心点
    scaleXCross() {
      return (this.middleLine / this.seatAreaWidthRem) * this.seatScale;
    },
    // 缩放.box区域 y轴的中心点
    scaleYCross() {
      return (this.horizontalLine / this.seatAreaHeightRem) * this.seatScale;
    },
    // 缩略图宽 rem
    thumbnailBoxWidth() {
      return (
        (this.xMax + 1) * this.thumbnailPositionDistin + this.thumbnailWidth
      );
    },
    // 缩略图高 rem
    thumbnailBoxHeight() {
      return (
        (this.yMax + 1) * this.thumbnailPositionDistin + this.thumbnailHeight
      );
    },
    // 座位左边栏的数组
    seatToolArr() {
      let seatToolArr = [];
      for (let i = 1; i <= this.yMax; i++) {
        let el = this.seatList.find(item => item.rowNum == i);
        if (el) {
          seatToolArr.push(el.rowNum);
        } else {
          seatToolArr.push("");
        }
      }
      return seatToolArr;
    }
  },
  methods: {
    // 点击每个座位触发的函数
    clickSeat(index) {
      if (this.seatList[index].canClick) {
        if (
          this.seatList[index].nowIcon === this.seatList[index].selectedIcon
        ) {
          this.processSelected(index);
        } else {
          this.processUnSelected(index);
        }
      }
    },
    thumbnailBackground() {
      // if (seatItem.isOccupied) {
      //   return require("../../img/sold-out.png"); // 已售
      // } else if (seatItem.sectionId == 637) {
      //   return require("../../img/seat-two.png"); // 居中好座位
      // } else if (seatItem.isBroken) {
      //   return require("../../img/service.png"); // 维修不可选
      // } else {
      //   return require("../../img/seat-one.png"); // 普通座位
      // }
      return "white";
      // if (seatItem.nowIcon === seatItem.selectedIcon) {
      //   return "green";
      // } else if (seatItem.nowIcon === seatItem.soldedIcon) {
      //   return "red";
      // } else if (seatItem.nowIcon === seatItem.fixIcon) {
      //   return "red";
      // } else {
      //   return "white";
      // }
    },
    aaaa(data) {
      return this.seatingChart.seats.find(
        item =>
          +item.columnNum + (+item.rowNum - 1) * this.seatingChart.width == data
      );
    }
  },
  components: {
    SeatArea: () => import("./components/SeatArea")
  }
};
</script>

<style scoped lang="less">
.seating-chart {
  display: grid;
  height: calc(100% - 46px - 40px - 40px - 45px - 88px);
  /*grid-template-columns: 1fr 1fr;*/
  /*grid-template-columns: repeat(3, 1fr);*/
  grid-template-columns: repeat(var(--width), 1fr);
  /*grid-template-rows: repeat(var(--height), 1fr);*/
  gap: 5px;
  grid-template-areas:
    "a . c"
    "d . f"
    "g . i";
  p {
    background-color: #fbf4d8;
  }
}
.thumbnail-seat-class {
  position: absolute;
}
.seatBox {
  position: absolute;
  left: 50%;
  transform-origin: 0rem 0rem 0rem;
  .middle-line {
    position: absolute;
    border-right: 0.05rem rgba(0, 0, 0, 0.2) dashed;
  }
  .seatClass {
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    .seatImgClass {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
    }
  }
}
</style>
