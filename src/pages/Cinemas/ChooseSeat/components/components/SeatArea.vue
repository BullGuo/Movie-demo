<template>
  <v-touch
    @pinchout="pinchOut"
    @pinchin="pinchIn"
    @panmove="panMove"
    @panstart="panStart"
    @panend="panEnd"
    ref="pinchAndPan"
    class="activity-area"
    :pinch-options="{ threshold: 0.09 }"
    :pan-options="{ threshold: 0.01 }"
    :style="{
      width: seatAreaWidthRem + 'rem',
      height: seatAreaHeightRem + 'rem'
    }"
  >
    <div
      class="thumbnail"
      v-show="thumbnailShow"
      :style="{
        transform: 'scale(' + seatScale + ')',
        width: thumbnailWidthRem + 'rem',
        height: thumbnailHeightRem + 'rem'
      }"
    >
      <!--红色外框-->
      <div
        class="thumbnail-border"
        :style="{
          transform: 'scale(' + scaleReciprocal + ')',
          top: topThumbnail + 'rem',
          left: leftThumbnail + 'rem'
        }"
      />
      <slot name="thumbnail-seat-slot">
        <!--缩略图中所有座位-->
      </slot>
    </div>
    <div
      class="box"
      ref="pinchAndPan"
      :style="{
        transform: 'scale(' + scale + ')',
        transformOrigin: transformOrigin,
        top: top + 'rem',
        left: left + 'rem',
        width: seatAreaWidthRem + 'rem',
        height: seatAreaHeightRem + 'rem'
      }"
    >
      <slot name="seat-area-slot">
        <!--所有可以点击座位的数据-->
      </slot>
    </div>
    <!--座位左边栏-->
    <div
      class="seat-tool-parent"
      :style="{ height: seatAreaHeightRem + 'rem' }"
    >
      <div
        class="seat-tool"
        :style="{
          transform: 'scale(' + seatScale + ')',
          transformOrigin: transformOriginTool,
          marginTop: seatToolMargin + 'rem',
          fontSize: seatToolFontSize + 'rem'
        }"
      >
        <template v-for="(item, index) in seatToolArr">
          <div
            class="seat-tool-item"
            :key="'seat-tool' + index"
            :style="{
              height: seatHeightWithScale + 'rem',
              lineHeight: seatHeightWithScale + 'rem'
            }"
          >
            {{ item }}
          </div>
        </template>
      </div>
    </div>
  </v-touch>
</template>

<script>
export default {
  name: "SeatArea",
  props: {
    // 缩略图宽 rem
    thumbnailWidthRem: {
      type: [Number, String],
      default: null
    },
    // 缩略图高 rem
    thumbnailHeightRem: {
      type: [Number, String],
      default: null
    },
    // 最大排数
    yMax: {
      type: [Number, String],
      default: null
    },
    // 内部座位图缩放比例(为了一次可以显示全部座位)
    seatScale: {
      type: [Number, String],
      default: null
    },
    // 每个座位dom的高度
    positionDistin: {
      type: [Number, String],
      default: null
    },
    // 座位区域宽  rem
    seatAreaWidthRem: {
      type: [Number, String],
      default: 10
    },
    // 座位区域高  rem
    seatAreaHeightRem: {
      type: [Number, String],
      default: null
    },
    middleLine: {
      type: [Number, String],
      default: null
    },
    // 横中轴线
    horizontalLine: {
      type: [Number, String],
      default: null
    },
    // .seatBox的高度
    seatBoxHeight: {
      type: [Number, String],
      default: null
    },
    // 座位左边栏数组
    seatToolArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scale: 1, // 区域放大尺寸
      top: 0, // 座位图位移
      left: 0,
      thumbnailShow: false, // 是否显示缩略图
      startX: 0, // ---移动的起点X轴 单位px  用于拖动时候计算开始坐标
      startY: 0,
      topThumbnail: 0, // 缩略图红色外框位移
      leftThumbnail: 0,
      // 设备 rem计算值
      screenRem:
        (document.body.clientWidth ||
          window.innerWidth ||
          document.documentElement.clientWidth) / 10,
      // 项目 rem计算值
      pxToRem: 75,
      // 定时器对象
      timer: {},
      // 触摸状态
      touchStatus: false
    };
  },
  methods: {
    // 切换时间场次时，初始化缩略图与放大比例
    init() {
      this.scale = 1;
      this.left = this.top = this.leftThumbnail = this.topThumbnail = 0;
      this.thumbnailShow = this.touchStatus = false;
    },
    // 第一次点击座位改变放大比例
    changeScale: function() {
      if (this.maxScale === 1) return;
      this.scale = this.maxScale;
    },
    // 第一次点击座位改变偏移
    changePosition: function(top, left) {
      if (this.maxScale === 1) return;
      // 0.67是上方 屏幕方向dom 部分偏移的部分 也是 .box margin-top 的50px
      this.top = top * (this.scale - 1) + 0.67;
      this.left = left * (this.scale - 1);
      this.showThumbnail(); // 展示缩略图
      this.setThumbnailFrame(); // 计算缩略图位移值
    },
    // seat-tool 内的字体大小
    seatToolFontSize() {
      let fontsize = 20 / this.pxToRem;
      return fontsize * this.scale;
    },
    // 放大时触发
    pinchOut() {
      if (this.scale >= 0 && this.scale < this.maxScale) {
        this.scale += 0.1;
      }
    },
    // 缩小时触发
    pinchIn() {
      if (this.scale > 1) {
        this.scale -= 0.1;
      }
    },
    // 当手指拖动的过程中
    panMove(ev) {
      if (this.touchStatus) {
        // 本次座位图移动横纵坐标rem的值
        this.top = (ev.deltaY + this.startY) / this.screenRem;
        this.left = (ev.deltaX + this.startX) / this.screenRem;
        this.setThumbnailFrame(); // 计算缩略图位移值
      }
    },
    // 当手指拖动开始的时候
    panStart() {
      this.showThumbnail(); // 显示缩略图
      // 获取上次记录的xy坐标作为起点
      this.startY = this.top * this.screenRem;
      this.startX = this.left * this.screenRem;
    },
    // 当手指拖动结束的时候
    panEnd() {
      // 优化触摸性能
      this.touchStatus = false;
      // 计算可移动边界
      if (this.scale === 1) {
        // 座位图左右移动超过了边界值 把移动置为边界值
        if (this.left > 6.15) {
          this.left = 6.15;
        } else if (this.left < -6.027) {
          this.left = -6.027;
        }
        // 缩略图左右移动超过了边界值 把移动置为边界值
        if (this.leftThumbnail > 1.416) {
          this.leftThumbnail = 1.416;
        } else if (this.leftThumbnail < -1.4477) {
          this.leftThumbnail = -1.4477;
        }
        // 座位图上下移动超过了边界值 把移动置为边界值
        if (this.top > 5.92) {
          this.top = 5.92;
        } else if (this.top < -5.15) {
          this.top = -5.15;
        }
        // 缩略图上下移动超过了边界值 把移动置为边界值
        if (this.topThumbnail > 0.8385) {
          this.topThumbnail = 0.8385;
        } else if (this.topThumbnail < -0.6124) {
          this.topThumbnail = -0.6124;
        }
      } else {
        // 座位图左右移动超过了边界值 把移动置为边界值
        if (this.left - this.crossLeft > 6) {
          this.left = this.crossLeft + 6;
        } else if (this.left + this.crossLeft < -6.123) {
          this.left = -this.crossLeft - 6.123;
        }
        // 缩略图左右移动超过了边界值 把移动置为边界值
        if (this.leftThumbnail - this.thumbnailWidthRemProportion > 1.0435) {
          this.leftThumbnail = this.thumbnailWidthRemProportion + 0.8;
        } else if (
          this.leftThumbnail + this.thumbnailWidthRemProportion <
          -0.76
        ) {
          this.leftThumbnail = -this.thumbnailWidthRemProportion - 0.76;
        }
        // 座位图上下移动超过了边界值 把移动置为边界值
        if (this.top - this.crossTop > 3.45) {
          this.top = this.crossTop + 3.45;
        } else if (this.top + this.crossTop < -7.49) {
          this.top = -this.crossTop - 7.49;
        }
        // 缩略图上下移动超过了边界值 把移动置为边界值
        if (this.topThumbnail - this.thumbnailHeightRemProportion > 0.97) {
          this.topThumbnail = this.thumbnailHeightRemProportion + 0.7;
        } else if (
          this.topThumbnail + this.thumbnailHeightRemProportion <
          -0.743
        ) {
          this.topThumbnail = -this.thumbnailHeightRemProportion - 0.7;
        }
      }
      this.timer = setTimeout(() => {
        this.thumbnailShow = false;
      }, 2000);
    },
    // 展示缩略图
    showThumbnail() {
      // 优化触摸性能
      this.touchStatus = true;
      // 展示缩略图
      this.thumbnailShow = true;
      clearTimeout(this.timer);
    },
    // 计算缩略图位移值
    setThumbnailFrame() {
      // .seatBox的高和缩略图的高 换算比例
      let heightProportion =
        (this.seatBoxHeight * this.seatScale) / this.thumbnailHeightRem;
      // .seatBox的宽和缩略图的宽 换算比例
      let widthProportion = this.seatAreaWidthRem / this.thumbnailWidthRem;
      // 本次缩略图移动横纵坐标rem的值
      this.topThumbnail = (-this.top / heightProportion) * this.scaleReciprocal;
      this.leftThumbnail =
        (-this.left / widthProportion) * this.scaleReciprocal;
    }
  },
  computed: {
    // 每个座位放大后的高度
    seatHeightWithScale() {
      return this.positionDistin * this.scale;
    },
    // 座位侧边栏需要偏移的长度
    seatToolMargin() {
      let height =
        this.seatHeightWithScale *
        this.yMax *
        this.scaleYCross *
        (this.seatScale - 1);
      return (
        this.top +
        this.seatHeightWithScale * this.seatScale -
        this.crossTop +
        height
      );
    },
    // 座位区缩放中心点
    transformOrigin() {
      return this.scaleXCross * 100 + "%" + this.scaleYCross * 100 + "%";
    },
    // 座位区x轴的中心点
    scaleXCross() {
      return (this.middleLine / this.seatAreaWidthRem) * this.seatScale;
    },
    // 座位区y轴的中心点
    scaleYCross() {
      return (this.horizontalLine / this.seatAreaHeightRem) * this.seatScale;
    },
    // 侧边栏缩放中心点
    transformOriginTool() {
      return (
        "0 " + +(this.scaleYCross * 100 - (+this.scale - 1) * 52.564875) + "%"
      );
    },
    // 左边触边吸附边界值rem
    crossLeft() {
      return (this.scale - 1) * this.seatAreaWidthRem * this.scaleXCross;
    },
    // 上边触边吸附边界值rem
    crossTop() {
      return (this.scale - 1) * this.seatAreaHeightRem * this.scaleYCross;
    },
    // 最大放大比例
    maxScale() {
      return 1 + 1 / this.seatScale;
    },
    // scale的倒数
    scaleReciprocal() {
      return 1 / this.scale;
    },
    // 缩略图宽度触边吸附边界值
    thumbnailWidthRemProportion() {
      return ((1 - this.scaleReciprocal) * this.thumbnailWidthRem) / 2;
    },
    // 缩略图高度触边吸附边界值
    thumbnailHeightRemProportion() {
      return ((1 - this.scaleReciprocal) * this.thumbnailHeightRem) / 2;
    }
  }
};
</script>

<style scoped lang="less">
.activity-area {
  position: relative;
  overflow: hidden;
  .thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    background: rgba(0, 0, 0, 0.4);
    overflow: hidden;
    transform-origin: 0 0;
    .thumbnail-border {
      z-index: 4;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 1px;
      position: relative;
      transition: transform 0.5s;
      &::after {
        content: "";
        pointer-events: none;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        transform-origin: 0 0;
        border: 1px solid #fe8233;
        background-color: rgba(254, 130, 51, 0.18);
        border-radius: 0;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        @media (min-resolution: 2dppx) {
          width: 200%;
          height: 200%;
          border-radius: 2px * 2;
          transform: scale(0.5);
        }
        @media (min-resolution: 3dppx) {
          width: 300%;
          height: 300%;
          border-radius: 2px * 3;
          transform: scale(0.333);
        }
      }
    }
  }
  .box {
    padding-top: 50px;
    position: absolute;
    z-index: 0;
    transition: transform 0.5s;
  }
  .seat-tool-parent {
    overflow: hidden;
    padding-top: 50px;
    .seat-tool {
      display: flex;
      flex-direction: column;
      position: absolute;
      z-index: 1;
      left: 0.1rem;
      border-radius: 50px;
      background: rgba(0, 0, 0, 0.3);
      text-align: center;
      color: white;
      font-weight: bold;
    }
    .seat-tool-item {
      padding: 0 0.05rem;
    }
  }
}
</style>
