<template>
  <div
    class="activity-area"
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
      <!--红色外框开始-->
      <div
        class="thumbnail-border"
        :style="{
          transform: 'scale(' + scaleReciprocal + ')',
          top: topThumbnail + 'rem',
          left: leftThumbnail + 'rem'
        }"
      />
      <!--红色外框结束-->
      <slot name="thumbnail-seat-slot">
        <!--这里是缩略图中的所有座位放入此插槽-->
      </slot>
    </div>
    <v-touch
      @pinchout="pinchOut"
      @pinchin="pinchIn"
      @panmove="panMove"
      @panstart="panStart"
      @panend="panEnd"
      class="box"
      ref="pinchAndPan"
      :pinch-options="{ threshold: 0.09 }"
      :pan-options="{ threshold: 0.01 }"
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
        <!--所有可以点击座位的数据会放入此插槽,此插槽可以缩放,拖动-->
      </slot>
    </v-touch>
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
  </div>
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
    // 座位左边栏的数组
    seatToolArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scale: 1, // 区域放大尺寸
      top: 0, // 单位rem
      left: 0, // 单位rem
      thumbnailShow: false, // 缩略图是否显示
      startX: 0, // ---移动的起点X轴 单位px
      startY: 0, // ---移动的起点Y轴 单位px
      topThumbnail: 0, // 单位rem
      leftThumbnail: 0, // 单位rem
      // 设备 rem计算值
      screenRem:
        (document.body.clientWidth ||
          window.innerWidth ||
          document.documentElement.clientWidth) / 10,
      // 项目 rem计算值
      pxtorem: 75,
      // 定时器对象
      timer: {},
      // 触摸状态
      touchStatus: false
    };
  },
  methods: {
    // 第一次点击座位改变放大比例
    changeScale: function() {
      if (this.maxscale === 1) {
        return;
      }
      this.scale = this.maxscale;
    },
    // 第一次点击座位改变偏移
    changePosition: function(top, left) {
      if (this.maxscale === 1) {
        return;
      }
      let _this = this;
      // 0.67是上方 屏幕方向dom 部分偏移的部分 也是 .box margin-top 的50px
      _this.top = top * (this.scale - 1) + 0.67;
      _this.left = left * (this.scale - 1);
    },
    // seat-tool 内的字体大小
    seatToolFontSize() {
      let fontsize = 20 / this.pxtorem;
      return fontsize * this.scale;
    },
    // 当缩放 放大的时候触发
    pinchOut() {
      if (this.scale >= 0 && this.scale < this.maxScale) {
        this.scale += 0.1;
      }
    },
    // 当缩放 缩小的时候触发
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
        // .seatBox的高和缩略图的高 换算比例
        let heightProportion =
          (this.seatBoxHeight * this.seatScale) / this.thumbnailHeightRem;
        // .seatBox的宽和缩略图的宽 换算比例
        let widthProportion = this.seatAreaWidthRem / this.thumbnailWidthRem;
        // 本次缩略图移动横纵坐标rem的值
        this.topThumbnail =
          (-this.top / heightProportion) * this.scalereciprocal;
        this.leftThumbnail =
          (-this.left / widthProportion) * this.scalereciprocal;
      }
    },
    // 当手指拖动开始的时候
    panStart() {
      // 优化触摸性能
      this.touchStatus = true;
      // 展示缩略图
      this.thumbnailShow = true;
      // 获取上次记录的xy坐标作为起点
      this.startY = this.top * this.screenRem;
      this.startX = this.left * this.screenRem;
      clearTimeout(this.timer);
    },
    // 当手指拖动结束的时候
    panEnd() {
      // 优化触摸性能
      this.touchStatus = false;
      if (this.scale === 1) {
        this.top = 0;
        this.left = 0;
        this.topThumbnail = 0;
        this.leftThumbnail = 0;
      } else {
        // 如果宽度度移动超过了边界值 把移动置为边界值
        if (this.left > this.crossLeft) {
          this.left = this.crossLeft;
        } else if (this.left < -this.crossLeft) {
          this.left = -this.crossLeft;
        }
        // 缩略图移动超过了边界值 把移动置为边界值
        if (this.leftThumbnail > this.thumbnailWidthRemProportion) {
          this.leftThumbnail = this.thumbnailWidthRemProportion;
        } else if (this.leftThumbnail < -this.thumbnailWidthRemProportion) {
          this.leftThumbnail = -this.thumbnailWidthRemProportion;
        }
        // 如果高度移动超过了边界值 把移动置为边界值
        if (this.top > this.crossTop) {
          this.top = this.crossTop;
        } else if (this.top < -this.crossTop) {
          this.top = -this.crossTop;
        }
        // 缩略图移动超过了边界值 把移动置为边界值
        if (this.topThumbnail > this.thumbnailHeightRemProportion) {
          this.topThumbnail = this.thumbnailHeightRemProportion;
        } else if (this.topThumbnail < -this.thumbnailHeightRemProportion) {
          this.topThumbnail = -this.thumbnailHeightRemProportion;
        }
      }
      this.timer = setTimeout(() => {
        this.thumbnailShow = false;
      }, 2000);
    }
  },
  computed: {
    // 最大放大比例
    maxscale: function() {
      return 1 + 1 / this.seatScale;
    },
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
    // css样式控制.seat-tool缩放中心点
    transformOriginTool() {
      return "0 " + +this.scaleYCross * 100 + "%";
    },
    // 缩放.box区域 y轴的中心点
    scaleYCross() {
      return (this.horizontalLine / this.seatAreaHeightRem) * this.seatScale;
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
    // css样式控制.box缩放中心点
    transformOrigin() {
      return this.scaleXCross * 100 + "%" + this.scaleYCross * 100 + "%";
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
      &::after {
        content: "";
        pointer-events: none;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        transform-origin: 0 0;
        border: 2px solid red;
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
