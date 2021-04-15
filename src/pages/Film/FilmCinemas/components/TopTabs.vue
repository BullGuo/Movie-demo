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
  >
    <van-tab
      :title="item"
      v-for="(item, index) in tabList"
      :key="index"
      title-class="date-list-item"
    >
      <div>1111111</div>
      <!--            <schedule-list-->
      <!--                    :schedules-list="schedulesList"-->
      <!--                    v-if="schedulesList.length"-->
      <!--            />-->
      <!--      <van-empty v-else description="暂无数据" :image="emptyImg" />-->
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
    }
  },
  watch: {
    cinemasList(val) {
      let list = val
        .map(item => item.showDate)
        .sort((value1, value2) => {
          return value1 - value2;
        });
      let arr = [];
      for (let index in list) {
        let day = this.$moment(list[index] * 1000).format("M月D日");
        if (index <= 1) {
          arr.push(
            this.$moment(list[index] * 1000)
              .calendar()
              .substring(0, 2) + day
          );
        } else {
          arr.push(this.getWeek(list[index]) + day);
        }
      }
      this.tabList = [...arr];
    }
  },
  data() {
    return {
      active: 0,
      tabList: [],
      emptyImg: require("@/common/assets/img/empty.png")
    };
  },
  methods: {
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
