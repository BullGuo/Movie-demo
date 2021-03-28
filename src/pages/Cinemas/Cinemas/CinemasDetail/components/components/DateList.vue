<template>
  <div>
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
        <schedule-list
          :schedules-list="schedulesList"
          v-if="schedulesList.length"
        />
        <van-empty v-else description="暂无数据" :image="emptyImg" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: "DateList",
  props: {
    id: Object,
    detail: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    async id(val) {
      this.active = 0;
      await this.init();
      if (!val.cinemaId || !val.filmId) return;
      this.getScheduleList();
    },
    active: {
      handler(val) {
        if (!val) return;
        this.getScheduleList();
      }
    }
  },
  data() {
    return {
      tabList: [],
      active: 0,
      schedulesList: [],
      emptyImg: require("@/common/assets/img/empty.png")
    };
  },
  methods: {
    init() {
      let arr = [];
      this.$moment.lang("zh-cn");
      if (!this.detail && !this.detail.showDate && !this.detail.showDate.length)
        return;
      for (let index in this.detail.showDate) {
        let day = this.$moment(this.detail.showDate[index] * 1000).format(
          "M月D日"
        );
        if (index <= 1) {
          arr.push(
            this.$moment(this.detail.showDate[index] * 1000)
              .calendar()
              .substring(0, 2) + day
          );
        } else {
          arr.push(this.getWeek(this.detail.showDate[index]) + day);
        }
      }
      this.tabList = [...arr];
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
    },
    getScheduleList() {
      this.$Toast.loading({
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
        className: "toast"
      });
      this.$axios({
        url: `https://m.maizuo.com/gateway/`,
        params: {
          ...this.id,
          date: this.detail.showDate[this.active],
          k: 3659182
        },
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"16092348011945091904110593"}',
          "X-Host": "mall.film-ticket.schedule.list"
        }
      }).then(res => {
        if (res && res.data.msg == "表示成功") {
          this.schedulesList = [...res.data.data.schedules];
        }
        this.$Toast.clear();
      });
    }
  },
  components: {
    ScheduleList: () => import("./ScheduleList")
  }
};
</script>

<style scoped lang="less">
.date-list {
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
}
/deep/ .van-tabs__line {
  width: 80px;
  height: 2px;
}
</style>
