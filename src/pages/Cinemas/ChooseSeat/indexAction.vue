<template>
  <div>
    <div class="header">
      <div class="left">
        <van-icon name="arrow-left" @click="goBack" />
      </div>
      <div class="title" v-if="infoDetail.cinema && infoDetail.cinema.name">
        {{ infoDetail.cinema.name }}
      </div>
      <div class="right" />
    </div>
    <notice-msg />
    <a class="buy-ticket" @click="buyTicketClick">
      <span style="color: hsla(0, 0%, 100%, 0.3);">请先选座</span>
    </a>
  </div>
</template>

<script>
export default {
  name: "indexAction",
  data() {
    return {
      infoDetail: {},
      seatingChart: {}
    };
  },
  created() {
    this.$store.commit("setTabs", false);
    this.init();
  },
  methods: {
    init() {
      let params = { scheduleId: this.$route.params.schedule, k: "9864735" };
      // 影厅信息详情
      this.$axios({
        url: `https://m.maizuo.com/gateway/`,
        params: { ...params },
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"16092348011945091904110593","bc":"510100"}',
          "X-Host": "mall.film-ticket.schedule.info"
        }
      }).then(res => {
        if (res && res.data.msg == "表示成功") {
          this.infoDetail = { ...res.data.data.schedule };
        }
      });
      // 座位列表
      this.$axios({
        //17737
        url: `https://m.maizuo.com/gateway/`,
        params: { ...params },
        headers: {
          "X-Client-Info":
            '{"a":"3000","ch":"1002","v":"5.0.4","e":"16092348011945091904110593","bc":"510100"}',
          "X-Host": "mall.film-ticket.seat.list"
        }
      }).then(res => {
        if (res && res.data.msg == "表示成功") {
          this.seatingChart = { ...res.data.data.seatingChart };
        }
      });
    },
    buyTicketClick() {
      console.log(1111111);
    },
    goBack() {
      history.go(-1);
    }
  },
  components: {
    NoticeMsg: () => import("./components/NoticeMsg")
  }
};
</script>

<style scoped lang="less">
.header {
  height: 46px;
  display: flex;
  align-items: center;
  .left {
    padding-left: 8px;
    font-size: 24px;
    color: rgb(129, 129, 129);
    min-width: 15%;
    display: flex;
  }
  .title {
    text-align: center;
    font-size: 17px;
    color: #191a1b;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    display: flex;
    justify-content: center;
  }
  .right {
    width: 15%;
    height: 100%;
    margin-right: 15px;
  }
}
.buy-ticket {
  width: 100%;
  height: 45px;
  position: fixed;
  bottom: 0;
  background: #ff5f16;
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 45px;
  z-index: 1;
  outline: none;
  cursor: pointer;
  &:active {
    background: rgb(229, 85, 19);
  }
}
</style>
