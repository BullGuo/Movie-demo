<template>
  <div class="navigation">
    <van-tabs
      v-model="activeName"
      background="#4187FF"
      color="white"
      title-inactive-color="#E0DCDC"
      title-active-color="white"
      @change="handleChange"
    >
      <van-tab
        :title="item.name"
        :name="item.key"
        v-for="item of tabList"
        :key="item.key"
      />
    </van-tabs>
    <div id="container">
      <img
        src="../img/center_location.png"
        class="center-icon"
        @click="centerMap"
      />
    </div>
    <!--    <div id="panel" />-->
    <transit-list v-if="activeName !== 'drive'" :transit-list="transitList" />
    <!--    <div @click="handleClick">查看全部地图</div>-->
  </div>
</template>

<script>
import { asyncLoadScript } from "@/common/utils/utils";
const mapSrc =
  "https://webapi.amap.com/maps?v=1.4.15&key=31d2705ea862611c04a817de8b96ad85";
let AMap;
export default {
  name: "indexAction",
  data() {
    return {
      cinemaDetail: {}, // 目标点信息
      map: null,
      location: { lng: null, lat: null }, // 当前位置
      mapBounds: null, // 获取路线后的地图视图范围
      geolocation: null, // 当前位置map实例
      tabList: [
        { name: "驾车", key: "drive" },
        { name: "公交", key: "transit" },
        { name: "骑行", key: "riding" },
        { name: "步行", key: "walk" }
      ],
      activeName: "drive",
      transitList: [] // 公交导航路线方案
    };
  },
  async created() {
    this.cinemaDetail = this.$route.params.cinemaDetail || {};
    console.log(this.cinemaDetail);
    await this.getLocationInfo();
    this.getDrivePath();
    this.$Toast.clear();
  },
  methods: {
    // 获取当前精准定位
    async getLocationInfo() {
      this.inLoading();
      await asyncLoadScript({ id: "map", src: mapSrc });
      AMap = AMap || window.AMap;
      this.map = new AMap.Map("container", {
        resizeEnable: true // 监控地图容器尺寸变化
      });
      return new Promise((resolve, reject) => {
        AMap.plugin("AMap.Geolocation", () => {
          this.geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 500, //超过10秒后停止定位，返回错误信息，默认：5s
            buttonPosition: "RB", //定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
            buttonDom: "", // 隐藏自带定位按钮
            extensions: "all" //返回周边POI、道路交叉口等信息
          });
          this.map.addControl(this.geolocation);
          this.geolocation.getCurrentPosition((status, result) => {
            if (status == "complete") {
              resolve();
              this.location = { ...result.position };
            } else {
              reject();
              if (result.info == "NOT_SUPPORTED") {
                this.$Toast.fail("当前设备不支持定位功能");
              } else if (result.info == "FAILED") {
                this.$Toast.fail("定位失败");
              }
            }
          });
        });
      });
    },
    // 切换顶部tabs
    async handleChange(name) {
      // if (this.activeName == name) return;
      switch (name) {
        case "drive":
          await this.getLocationInfo();
          this.getDrivePath();
          this.$Toast.clear();
          break;
        case "transit":
          await this.getLocationInfo();
          this.getTransitPath();
          this.$Toast.clear();
          break;
        case "riding":
          break;
        case "walk":
          break;
      }
    },
    // 获取驾车路径
    getDrivePath() {
      //构造路线导航类
      AMap.plugin("AMap.Driving", () => {
        //异步加载插件
        let driving = new AMap.Driving({
          map: this.map,
          // panel: "panel", // 在容器中填充结果列表
          policy: AMap.DrivingPolicy.LEAST_TIME, // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
          autoFitView: true // 控制在路径规划结束后，自动调整地图视野使绘制的路线处于视口的可见范围
        });
        // 根据起终点经纬度规划驾车导航路线
        driving.search(
          new AMap.LngLat(this.location.lng, this.location.lat),
          new AMap.LngLat(
            this.cinemaDetail.longitude,
            this.cinemaDetail.latitude
          ),
          (status, result) => {
            if (status === "complete") {
              this.$Toast({
                message: "绘制驾车路线完成",
                position: "bottom"
              });
            } else {
              this.$Toast.fail({
                message: "获取驾车数据失败：" + result
              });
            }
            this.mapBounds = this.map.getBounds();
          }
        );
      });
    },
    // 获取公交路径
    getTransitPath() {
      this.inLoading();
      AMap.plugin("AMap.Transfer", () => {
        let transferOption = {
          map: this.map,
          city: "北京市", // 必填
          nightflag: true, // 是否计算夜班车
          // panel: "panel",
          extensions: "all", // 返回全部信息
          autoFitView: true,
          policy: AMap.TransferPolicy.LEAST_TIME // 换成策略
        };
        let transfer = new AMap.Transfer(transferOption);
        //根据起、终点坐标查询公交换乘路线
        transfer.search(
          new AMap.LngLat(this.location.lng, this.location.lat),
          new AMap.LngLat(
            this.cinemaDetail.longitude,
            this.cinemaDetail.latitude
          ),
          (status, result) => {
            if (status === "complete") {
              console.log(result);
              this.transitList = [...result.plans];
              this.$Toast({
                message: "公交路线数据查询成功",
                position: "bottom"
              });
            } else {
              this.$Toast.fail("公交路线数据查询失败" + result);
            }
          }
        );
      });
    },
    handleClick() {
      this.map.setBounds(this.mapBounds);
    },
    // 锁定当前位置
    centerMap() {
      this.map.setCenter([this.location.lng, this.location.lat]);
    },
    inLoading() {
      this.$Toast.loading({
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
        className: "toast",
        message: "加载中"
      });
    }
  },
  components: {
    TransitList: () => import("./components/TransitList")
  }
};
</script>

<style scoped lang="less">
.navigation {
  position: relative;
  #container {
    height: calc(100% - 44px);
    position: relative;
    .center-icon {
      position: absolute;
      right: 12px;
      bottom: 55px;
      z-index: 9;
      width: 45px;
      height: 45px;
    }
    /deep/ .amap-logo {
      display: none !important;
    }
    /deep/ .amap-copyright {
      display: none !important;
    }
  }
  #panel {
    position: absolute;
    bottom: 0;
    z-index: 10;
    width: 100%;
    height: calc(100% - 44px);
    background-color: #fafafa;
    overflow-y: auto;
    /deep/ .amap-lib-transfer {
      border: none;
    }
    /deep/ .amap-call {
      display: none;
    }
  }
}
</style>
