<template>
  <div class="navigation">
    <top-navigation
      @changeWay="changeWay"
      :cinema-detail="cinemaDetail"
      @exchangeLocation="exchangeLocation"
      ref="topNavigation"
      v-if="!isShowTransDetail"
    />
    <div
      id="container"
      :style="{
        height: projectList.length
          ? projectList.length == 1
            ? 'calc(100% - 200px)'
            : 'calc(100% - 240px)'
          : isShowTransDetail
          ? '54%'
          : 'calc(100% - 130px)'
      }"
    />
    <img
      src="../img/refresh.png"
      class="refresh-icon"
      @click="refreshMap"
      v-if="activeName != 'transit'"
    />
    <img
      src="../img/center_location.png"
      class="center-icon"
      @click="centerMap"
      v-if="activeName != 'transit'"
    />
    <!-- 公交路线 -->
    <transit-list
      v-if="activeName == 'transit' && !isShowTransDetail"
      :transit-list="transitList"
      :notTransit="notTransit"
      @showTransDetail="showTransDetail"
    />
    <transit-detail v-if="isShowTransDetail" :transit-detail="transitDetail" />
    <!-- 底部方案与唤起地图app -->
    <bottom-navigation
      :drive-project="projectList"
      :active-name="activeName"
      @changeType="changeType"
      @arouseTheGold="arouseTheGold"
    />
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
      nowDetail: null, // 当前位置详情
      mapCenter: null, // 获取路线后的地图中心点
      mapBounds: null,
      mapZoom: null,
      geolocation: null, // 当前位置map实例
      activeName: "drive",
      transitList: [], // 公交导航路线方案
      projectList: [], // 驾车,骑行,步行路线方案
      notTransit: false, // 没有公交路线时
      hot_drive: null, // 推荐驾车路线(默认路线)
      hot_transit: null, // 推荐公交路线(默认路线)
      hot_walking: null, // 推荐步行路线(默认路线)
      drivePolicy: "LEAST_TIME", // 保留上一次选择的路线方案(推荐,方案二)
      isShowTransDetail: false, // 是否显示公交导航详情
      transitDetail: null // 公交导航详情
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.cinemaDetail = this.$route.params.cinemaDetail || {};
      this.changeWay(this.activeName);
    },
    // 更改导航方式 [驾车,公交,骑行,步行]
    async changeWay(data) {
      this.activeName = data;
      if (data != "transit") {
        this.transitList = [];
        this.isShowTransDetail = false;
      }
      this.projectList = [];
      await this.getLocationInfo();
      let type = data.replace(data[0], data[0].toUpperCase());
      this[`get${type}Path`]();
      this.$Toast.clear();
    },
    // 更改推荐路线方案
    changeType(data) {
      this.hot_drive.clear();
      this.map.clearMap();
      let projectArr = ["LEAST_TIME", "LEAST_DISTANCE"];
      let type = data.type.replace(data.type[0], data.type[0].toUpperCase());
      this.drivePolicy = projectArr[data.index];
      if (data.type == "drive") {
        this[`get${type}Path`](projectArr[data.index], data.type);
      } else {
        this[`get${type}Path`]();
      }
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
              this.nowDetail = { ...result };
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
    getDrivePath(policy = "LEAST_TIME", type = "") {
      // 异步加载插件
      AMap.plugin("AMap.Driving", () => {
        // 构造路线导航类
        this.hot_drive = new AMap.Driving({
          map: this.map,
          autoFitView: true, // 控制在路径规划结束后，自动调整地图视野使绘制的路线处于视口的可见范围
          isOutline: true, // 是否显示描边
          outlineColor: "#5074b6"
        });
        // 设置驾车路线规划策略
        this.hot_drive.setPolicy(AMap.DrivingPolicy[policy]);
        // 根据起终点经纬度规划驾车导航路线
        this.hot_drive.search(...this.getStartEnd, (status, result) => {
          if (status !== "complete") {
            this.$Toast.fail("获取驾车数据失败");
          } else {
            // this.getMapCenterZoom();
            if (type != this.activeName) {
              this.projectList.push(result.routes[0]);
            }
          }
        });
        let projectArr = ["LEAST_TIME", "LEAST_DISTANCE"];
        let otherProject = projectArr.find(item => item != policy);
        // 导航备用方案
        let driving_two = new AMap.Driving();
        driving_two.setPolicy(AMap.DrivingPolicy[otherProject]);
        // 绘制备用路线
        driving_two.search(...this.getStartEnd, (status, result) => {
          if (status == "complete") {
            if (type != this.activeName) {
              this.projectList.push(result.routes[0]);
            }
            let pathArr = [];
            result.routes[0].steps.map(item => {
              pathArr.push(item.path);
              return pathArr;
            });
            let path = this.flatten(pathArr);
            this.handlePolyline(path);
          }
        });
      });
    },
    // 构造备用路线
    handlePolyline(path, strokeColor = "#C0D3EB", showDir = false) {
      // 绘制轨迹
      const polyline = new AMap.Polyline({
        map: this.map,
        path,
        strokeColor: strokeColor, // 线颜色
        strokeOpacity: 1, // 线透明度
        strokeWeight: 7, // 线宽
        strokeStyle: "solid", // 线样式
        lineJoin: "round", // 折线拐点样式
        lineCap: "round", // 折线两段线帽样式
        showDir: showDir,
        isOutline: true,
        outlineColor: "#5074b6"
      });
      polyline.setMap(this.map);
    },
    // 扁平化坐标数组
    flatten(arr) {
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          result.push(arr[i][j]);
        }
      }
      return result;
    },
    // 获取公交路径
    getTransitPath() {
      AMap.plugin("AMap.Transfer", () => {
        let transferOption = {
          // map: this.map,
          city: this.cinemaDetail.cityName, // 必填
          nightflag: true, // 是否计算夜班车
          extensions: "all", // 返回全部信息
          autoFitView: true,
          policy: AMap.TransferPolicy.LEAST_TIME // 换成策略
          // isOutline: true, // 是否显示描边
          // outlineColor: "#3a5484"
        };
        this.hot_transit = new AMap.Transfer(transferOption);
        //根据起、终点坐标查询公交换乘路线
        this.hot_transit.search(...this.getStartEnd, (status, result) => {
          if (status === "complete") {
            this.transitList = [...result.plans];
            // this.getMapCenterZoom();
          } else if (status === "error") {
            this.$Toast.fail("公交路线数据查询失败");
          } else {
            this.$Toast.fail("暂无路线！");
            // this.getMapCenterZoom();
          }
        });
      });
    },
    // 获取骑行路径
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
            this.$Toast.fail("骑行路线数据查询失败");
          } else {
            this.projectList.push(result.routes[0]);
            // this.getMapCenterZoom();
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
        this.hot_walking = new AMap.Walking(walkOption);
        //根据起终点坐标规划步行路线
        this.hot_walking.search(...this.getStartEnd, (status, result) => {
          if (status !== "complete") {
            this.$Toast.fail("步行路线数据查询失败");
          } else {
            this.projectList.push(result.routes[0]);
            if (result.routes[0].distance / 1000 >= 10) {
              this.$Toast({
                message: "距离过长，建议公交或驾车出行",
                position: "top",
                duration: 3000
              });
            }
            // this.getMapCenterZoom();
          }
        });
      });
    },
    // 获取地图层级与中心点
    getMapCenterZoom() {
      this.mapZoom = this.map.getZoom();
    },
    // 刷新
    refreshMap() {
      if (!this.mapBounds) {
        this.mapBounds = this.map.getBounds();
      }
      this.map.setBounds(this.mapBounds);
    },
    // 锁定当前位置
    centerMap() {
      if (!this.location.lng || !this.location.lat) return;
      this.map.setCenter([this.location.lng, this.location.lat]);
    },
    // 唤起高德
    arouseTheGold(data) {
      let mode = "";
      switch (data) {
        case "drive":
          mode = "car";
          break;
        case "transit":
          mode = "bus";
          break;
        case "riding":
          mode = "ride";
          break;
        case "walk":
          mode = "walk";
          break;
      }
      window.location.href = `https//uri.amap.com/navigation?from=${this.location.lng},${this.location.lat},哈哈哈&to=${this.cinemaDetail.longitude},${this.cinemaDetail.latitude},嘿嘿嘿&mode=${mode}&policy=1&callnative=1`;
      // this[`hot_${data}`].searchOnAMAP({
      //   origin: new AMap.LngLat(this.location.lng, this.location.lat),
      //   originName: this.nowDetail.formattedAddress,
      //   destination: new AMap.LngLat(
      //     this.cinemaDetail.longitude,
      //     this.cinemaDetail.latitude
      //   ),
      //   destinationName: this.cinemaDetail.name
      // });
      // return false;
    },
    inLoading() {
      this.$Toast.loading({
        forbidClick: true,
        duration: 0,
        className: "toast",
        message: "加载中"
      });
    },
    // 交换当前与目标点位置
    exchangeLocation() {
      let locationLng = this.location.lng;
      let locationLat = this.location.lat;
      this.location.lng = this.cinemaDetail.longitude;
      this.location.lat = this.cinemaDetail.latitude;
      this.cinemaDetail.longitude = locationLng;
      this.cinemaDetail.latitude = locationLat;
      let projectArr = ["LEAST_TIME", "LEAST_DISTANCE"];
      this.projectList = [];
      let index = projectArr.findIndex(item => item == this.drivePolicy);
      this.hot_drive.clear();
      this.map.clearMap();
      let type = this.activeName.replace(
        this.activeName[0],
        this.activeName[0].toUpperCase()
      );
      this.drivePolicy = this.activeName;
      if (this.activeName == "drive") {
        this[`get${type}Path`](projectArr[index], "");
      } else {
        this[`get${type}Path`]();
      }
    },
    showTransDetail(data) {
      this.transitDetail = data;
      this.isShowTransDetail = true;
      this.handlePolyline(data.path, "#D3256D", true);
      this.map.setFitView();
    }
  },
  // 当进入公交导航详情时，点击返回，阻止返回，回退到公交列表
  beforeRouteLeave(to, from, next) {
    if (this.isShowTransDetail) {
      this.isShowTransDetail = false;
      // 返回后保留tabs栏选中值
      this.$nextTick(() => {
        this.$refs.topNavigation.activeName = this.activeName;
      });

      next(false);
    } else {
      next(true);
      this.$Toast.clear();
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
    BottomNavigation: () => import("./components/BottomNavigation"),
    TransitList: () => import("./components/TransitList"),
    transitDetail: () => import("./components/transitDetail")
  }
};
</script>

<style scoped lang="less">
.navigation {
  position: relative;
  overflow: hidden;
  > img {
    position: absolute;
    right: 12px;
    z-index: 99999;
  }
  .refresh-icon {
    right: 20px;
    bottom: 222px;
    width: 30px;
    height: 30px;
    z-index: 9999;
  }
  .center-icon {
    bottom: 166px;
    width: 45px;
    height: 45px;
  }
  #container {
    height: calc(100% - 240px);
    position: relative;
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
