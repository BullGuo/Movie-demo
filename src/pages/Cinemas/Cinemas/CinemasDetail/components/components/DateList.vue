<template>
  <div>
    <van-tabs
      v-model="active"
      swipeable
      animated
      border
      color="#ff5f16"
      line-height="2px"
      line-width="56px"
      title-active-color="#ff5f16"
    >
      <van-tab :title="item" v-for="(item, index) in tabList" :key="index">
        {{ item }}
      </van-tab>
    </van-tabs>
    <schedule-list />
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "DateList",
  props: {
    id: Object
  },
  watch: {
    id() {
      this.init();
    }
  },
  data() {
    return {
      tabList: [],
      active: 0
    };
  },
  methods: {
    async init() {
      let arr = [];
      for (let i = 0; i < 11; ) {
        let b = moment(moment().add(i, "d"));
        // let milliseconds = b.startOf("day").format("X");
        if (b.diff(moment(), "d") > 1) {
          arr.push(this.getWeek(b));
        } else {
          arr.push(this.getLately(b, i));
        }
        // await this.getScheduleList(milliseconds);
        ++i;
      }
      this.tabList = [...arr];
    },
    getWeek(date) {
      let d = date.format("M月D日");
      let week = date.day();
      switch (week) {
        case 1:
          return "周一" + d;
        case 2:
          return "周二" + d;
        case 3:
          return "周三" + d;
        case 4:
          return "周四" + d;
        case 5:
          return "周五" + d;
        case 6:
          return "周六" + d;
        case 0:
          return "周日" + d;
      }
    },
    getLately(date, index) {
      let d = date.format("M月D日");
      switch (index) {
        case 0:
          return "今天" + d;
        case 1:
          return "明天" + d;
        case 2:
          return "后天" + d;
      }
    },
    getScheduleList(milliseconds) {
      let params = {
        filmId: this.id.filmId,
        cinemaId: this.id.cinemaId,
        date: milliseconds,
        k: 8080306
      };
      this.$axios({
        url: `https://m.maizuo.com/gateway/`,
        params: { ...params },
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"16092348011945091904110593","bc":"510100"}',
          "X-Host": "mall.film-ticket.schedule.list"
        }
      }).then(res => {
        if (res) {
          console.log(res);
        }
      });
    }
  },
  components: {
    ScheduleList: () => import("./ScheduleList")
  }
};
</script>

<style scoped></style>
