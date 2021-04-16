<template>
  <van-tabs
    v-model="active"
    swipeable
    animated
    border
    color="#ff5f16"
    title-active-color="#ff5f16"
    swipe-threshold="1"
    class="date-list"
    @change="handleChange"
  >
    <van-tab
      :title="item"
      v-for="(item, index) in tabList"
      :key="index"
      title-class="date-list-item"
    >
      <div v-if="cinemasList.length">
        <cinemas-list-item
          v-for="item in cinemaList"
          :key="item.cinemaId"
          :detail="item"
          :filmId="id"
          :active-index="dataList[index].showDate"
        />
      </div>
    </van-tab>
  </van-tabs>
</template>

<script>
export default {
  name: "TopTabs",
  props: {
    cinemasList: {
      type: Array,
      default: () => []
    },
    id: [Number, String]
  },
  watch: {
    cinemasList(val) {
      let list = [...val];
      for (let i = 0; i < list.length - 1; i++) {
        for (let j = i + 1; j < list.length; j++) {
          if (list[i].showDate > list[j].showDate) {
            let tmp = list[i];
            list[i] = list[j];
            list[j] = tmp;
          }
        }
      }
      let arr = [];
      for (let index in list) {
        let day = this.$moment(list[index].showDate * 1000).format("M月D日");
        if (index <= 1) {
          arr.push(
            this.$moment(list[index].showDate * 1000)
              .calendar()
              .substring(0, 2) + day
          );
        } else {
          arr.push(this.getWeek(list[index].showDate) + day);
        }
      }
      this.tabList = [...arr];
      this.dataList = [...list];
      if (this.dataList.length) {
        this.getCinemasList(this.dataList[0]);
      }
    }
  },
  data() {
    return {
      active: 0,
      tabList: [],
      dataList: [], // 排序后的tabs列表
      cinemaList: [],
      emptyImg: require("@/common/assets/img/empty.png")
    };
  },
  created() {
    this.$Toast.loading({ message: "加载中", forbidClick: true });
  },
  methods: {
    getCinemasList(cinemas) {
      let cityInfo = this.$store.state.cityInfo;
      let params = {
        cityId: cityInfo.cityId || cityInfo.cityID,
        cinemaIds: cinemas.cinemaList.join(",")
      };
      // 所有影院列表;
      this.$axios({
        url: "https://m.maizuo.com/gateway",
        method: "post",
        params: { k: 8084840 },
        data: params,
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"16092348011945091904110593"}',
          "X-Host": "mall.film-ticket.cinema.batch-cinema"
        }
      }).then(res => {
        if (res && res.statusText == "OK") {
          this.cinemaList = [...res.data.data.cinemas];
          this.$Toast.clear();
        }
      });
    },
    handleChange(index) {
      this.$Toast.loading({ message: "加载中", forbidClick: true });
      this.getCinemasList(this.dataList[index]);
    },
    getWeek(date) {
      let week = this.$moment(date * 1000).day();
      switch (week) {
        case 1:
          return "周一";
        case 2:
          return "周二";
        case 3:
          return "周三";
        case 4:
          return "周四";
        case 5:
          return "周五";
        case 6:
          return "周六";
        case 0:
          return "周日";
      }
    }
  },
  components: {
    CinemasListItem: () =>
      import("../../../Cinemas/components/components/CinemasListItem")
  }
};
</script>

<style scoped lang="less">
/deep/ .van-tabs__nav {
  padding: 0 0 15px !important;
  justify-content: flex-start;
}
/deep/ .date-list-item {
  flex: none;
  width: 110px;
  /deep/ .van-empty {
    padding: 20px 0;
  }
}
/deep/ .van-tabs__line {
  width: 80px;
  height: 2px;
}
</style>
