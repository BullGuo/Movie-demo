<template>
  <div class="city-page">
    <div class="city-top">
      <div class="city-close">
        <van-icon name="cross" size="24" class="top-close" color="#939191" />
        <div class="city-text">
          {{ cityInfo.name ? cityInfo.name : "当前城市 -" }}
        </div>
      </div>
      <van-search
        v-model="searchValue"
        background="#f4f4f4"
        placeholder="请输入城市名或拼音"
        @input="searchInput"
      />
    </div>
    <div v-show="!searchList.length">
      <recommend-city
        :hot-list="hotList"
        :city-name="cityInfo.name"
        @cityClick="cityClick"
      />
      <city-index-bar :data-detail="dataDetail" @cityClick="cityClick" />
    </div>
    <search-city-list
      :search-list="searchList"
      v-show="searchList.length"
      @cityClick="cityClick"
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
      searchValue: "",
      dataDetail: {},
      cityList: [],
      hotList: [],
      searchList: [],
      cityInfo: {
        name: "",
        cityId: 0
      }
    };
  },
  watch: {
    cityInfo: {
      deep: true,
      handler(val) {
        if (!val || !val.name || !val.cityId) return;
        this.$store.commit("setCityInfo", val);
        setTimeout(() => {
          this.$router.push({ name: "menu" });
        }, 1000);
      }
    }
  },
  async created() {
    this.$Toast.loading({
      message: "定位中...",
      forbidClick: true,
      duration: 0
    });
    await this.init();
    await this.getCityInfo();
  },
  methods: {
    async init() {
      let list = [];
      await this.$axios({
        url: `https://m.maizuo.com/gateway?k=8954800`,
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"16092348011945091904110593","bc":"110100"}',
          "X-Host": "mall.film-ticket.city.list"
        }
      }).then(res => {
        if (res && res.data.msg == "ok") {
          list = [...res.data.data.cities];
          this.cityList = [...list];
        }
      });
      this.processData(list);
    },
    // 获取当前城市
    async getCityInfo() {
      await asyncLoadScript({ id: "map", src: mapSrc });
      AMap = AMap || window.AMap;
      //实例化城市查询类
      AMap.plugin("AMap.CitySearch", () => {
        let citysearch = new AMap.CitySearch();
        //根据用户IP返回当前城市
        citysearch.getLocalCity((status, result) => {
          if (status === "complete" && result.info === "OK") {
            if (result && result.city && result.bounds) {
              setTimeout(() => {
                this.$store.commit("setCityInfo", {
                  cityID: result.adcode,
                  name: result.city
                });
                this.cityInfo.name = result.city;
                this.cityInfo.cityId = result.adcode;
                this.$Toast.clear();
              }, 1000);
            }
          } else {
            this.$Toast.fail("位置信息获取失败");
          }
        });
      });
    },
    // 将城市数据根据首字母排序
    processData(list) {
      let detail = {};
      for (let index = 65; index < 91; index++) {
        let ascll = String.fromCharCode(index);
        detail[ascll] = [];
        let reg = new RegExp(ascll, "i");
        for (let item of list) {
          if (item.pinyin.search(reg) == 0) {
            detail[ascll].push(item);
          }
          if (item.isHot && index == 65) {
            this.hotList.push(item);
          }
        }
        if (!detail[ascll].length) {
          delete detail[ascll];
        }
      }
      this.dataDetail = { ...detail };
    },
    searchInput(value) {
      if (!value) {
        this.searchList = [];
        return;
      }
      let arr = [];
      for (let item of this.cityList) {
        if (item.name.includes(value) || item.pinyin.includes(value)) {
          arr.push(item);
        }
      }
      this.searchList = [...arr];
    },
    cityClick(value) {
      this.cityInfo = { ...value };
      this.searchList = [];
      this.searchValue = "";
    }
  },
  components: {
    // 索引栏
    CityIndexBar: () => import("./components/CityIndexBar"),
    RecommendCity: () => import("./components/RecommendCity"),
    SearchCityList: () => import("./components/SearchCityList")
  }
};
</script>

<style scoped lang="less">
.city-page {
  background: #f4f4f4;
  height: 100vh;
  .city-top {
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 999;
    .city-close {
      width: 100%;
      height: 44px;
      display: flex;
      align-items: center;
      background: #fff;
      .top-close {
        margin-left: 10px;
      }
      .city-text {
        width: 74%;
        text-align: center;
      }
    }
  }
}
/deep/ .van-search {
  padding: 9.5px 15px;
}
/deep/ .van-search__content {
  background: #fff;
  border-radius: 3px;
}
</style>
