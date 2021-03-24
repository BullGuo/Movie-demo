<template>
  <div class="navigation">
    <top-navigation @changeWay="changeWay" :cinema-detail="cinemaDetail" />
    <div id="container">
      <img
        src="../img/refresh.png"
        alt=""
        class="refresh-icon"
        @click="refreshMap"
      />
      <img
        src="../img/center_location.png"
        class="center-icon"
        @click="centerMap"
      />
    </div>
    <!-- 公交路线 -->
    <transit-list
      v-if="activeName == 'transit'"
      :transit-list="transitList"
      :notTransit="notTransit"
    />
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
      activeName: "drive",
      transitList: [], // 公交导航路线方案
      notTransit: false // 没有公交路线时
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.cinemaDetail = this.$route.params.cinemaDetail || {};
      console.log(this.cinemaDetail);
      this.changeWay(this.activeName);
    },
    async changeWay(data) {
      this.activeName = data;
      if (data != "transit") {
        this.transitList = [];
      }
      await this.getLocationInfo();
      switch (data) {
        case "drive":
          this.getDrivePath();
          break;
        case "transit":
          this.getTransitPath();
          break;
        case "riding":
          this.getRidingPath();
          break;
        case "walk":
          this.getWalkPath();
          break;
      }
      this.$Toast.clear();
    },
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
                this.notTransit = true;
                this.$Toast.fail(
                  "定位失败!请确保打开系统定位，并赋予App定位权限！"
                );
              }
            }
          });
        });
      });
    },
    // 获取驾车路径
    getDrivePath() {
      //构造路线导航类
      AMap.plugin("AMap.Driving", () => {
        //异步加载插件
        let driving = new AMap.Driving({
          map: this.map,
          policy: AMap.DrivingPolicy.LEAST_TIME, // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
          autoFitView: true, // 控制在路径规划结束后，自动调整地图视野使绘制的路线处于视口的可见范围
          isOutline: true, // 是否显示描边
          outlineColor: "#5074b6"
        });
        // 根据起终点经纬度规划驾车导航路线
        driving.search(...this.getStartEnd, (status, result) => {
          if (status !== "complete") {
            this.$Toast.fail({
              message: "获取驾车数据失败" + result
            });
          } else {
            this.mapBounds = this.map.getBounds();
          }
        });
      });
    },
    // 获取公交路径
    getTransitPath() {
      AMap.plugin("AMap.Transfer", () => {
        let transferOption = {
          map: this.map,
          city: this.cinemaDetail.cityName, // 必填
          nightflag: true, // 是否计算夜班车
          extensions: "all", // 返回全部信息
          autoFitView: true,
          policy: AMap.TransferPolicy.LEAST_TIME, // 换成策略
          isOutline: true, // 是否显示描边
          outlineColor: "#3a5484"
        };
        let transfer = new AMap.Transfer(transferOption);
        //根据起、终点坐标查询公交换乘路线
        transfer.search(...this.getStartEnd, (status, result) => {
          if (status === "complete") {
            this.transitList = [...result.plans];
            this.mapBounds = this.map.getBounds();
          } else if (status === "error") {
            this.$Toast.fail("公交路线数据查询失败" + result);
          } else {
            this.$Toast.fail("暂无路线！");
            this.mapBounds = this.map.getBounds();
          }
        });
      });
    },
    // 获取公交路径
    getRidingPath() {
      AMap.plugin("AMap.Riding", () => {
        let ridingOption = {
          map: this.map,
          isOutline: true, // 是否显示描边
          outlineColor: "#3a5484",
          autoFitView: true
        };
        let riding = new AMap.Riding(ridingOption);
        //根据起终点坐标规划骑行路线
        riding.search(...this.getStartEnd, (status, result) => {
          if (status !== "complete") {
            this.$Toast.fail("骑行路线数据查询失败" + result);
          } else {
            this.mapBounds = this.map.getBounds();
          }
        });
      });
    },
    // 获取步行路径
    getWalkPath() {
      AMap.plugin("AMap.Walking", () => {
        let walkOption = {
          map: this.map,
          isOutline: true,
          outlineColor: "#3a5484",
          autoFitView: true
        };
        // 步行导航
        let walking = new AMap.Walking(walkOption);
        //根据起终点坐标规划步行路线
        walking.search(...this.getStartEnd, (status, result) => {
          console.log(result);
          if (status !== "complete") {
            this.$Toast.fail("步行路线数据查询失败" + result);
          } else {
            let time = result.routes[0].time;
            let hour = Math.floor(time / 3600);
            let minute = Math.ceil(time / 60) - hour * 60;
            console.log(hour);
            console.log(minute);
            if (result.routes[0].distance / 1000 >= 10) {
              this.$Toast({
                message: "距离过长，建议公交或驾车出行",
                position: "top",
                duration: 3000
              });
            }
            this.mapBounds = this.map.getBounds();
          }
        });
      });
    },
    // 刷新
    refreshMap() {
      this.map.setBounds(this.mapBounds);
    },
    // 锁定当前位置
    centerMap() {
      if (!this.location.lng || !this.location.lat) return;
      this.map.setCenter([this.location.lng, this.location.lat]);
    },
    inLoading() {
      this.$Toast.loading({
        forbidClick: true,
        duration: 0,
        className: "toast",
        message: "加载中"
      });
    }
  },
  computed: {
    getStartEnd() {
      return [
        new AMap.LngLat(this.location.lng, this.location.lat),
        new AMap.LngLat(this.cinemaDetail.longitude, this.cinemaDetail.latitude)
      ];
    }
  },
  components: {
    TopNavigation: () => import("./components/TopNavigation"),
    TransitList: () => import("./components/TransitList")
  }
};
</script>

<style scoped lang="less">
.navigation {
  position: relative;
  overflow: hidden;
  #container {
    height: calc(100% - 130px);
    position: relative;
    > img {
      position: absolute;
      right: 12px;
      z-index: 9;
    }
    .refresh-icon {
      right: 20px;
      bottom: 112px;
      width: 30px;
      height: 30px;
    }
    .center-icon {
      bottom: 55px;
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
