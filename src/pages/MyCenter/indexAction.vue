<template>
  <div class="center-view">
    <div class="avatar">
      <img :src="getAvatar" alt="" class="avator-icon" @click="GoToLogin" />
      <div class="nick-name" @click="GoToLogin">
        {{ (userInfo && userInfo.name) || "立即登录" }}
      </div>
    </div>
    <ul class="my-order-tab">
      <li @click="goToFilmOrders">
        <!--        <van-badge :content="5" color="#ff5f16">-->
        <img src="./img/film_orders.png" alt="" />
        <!--        </van-badge>-->
        <div>电影订单</div>
      </li>
      <li @click="goToCollect">
        <img src="./img/collect.png" alt="" />
        <div>收藏列表</div>
      </li>
    </ul>
    <div class="center-cell">
      <img src="./img/consumer-voucher.png" alt="" />
      <div class="text">消费券</div>
      <van-icon name="arrow" size="6" color="rgb(187 180 180)" />
    </div>
    <div class="center-cell">
      <img src="./img/red-packet.png" alt="" />
      <div class="text">红包</div>
      <van-icon name="arrow" size="6" color="rgb(187 180 180)" />
    </div>
    <div class="center-cell">
      <img src="./img/balance.png" alt="" />
      <div class="text">余额</div>
      <van-icon name="arrow" size="6" color="rgb(187 180 180)" />
    </div>
    <div class="center-cell">
      <img src="./img/setting.png" alt="" />
      <div class="text">设置</div>
      <van-icon name="arrow" size="6" color="rgb(187 180 180)" />
    </div>
  </div>
</template>

<script>
import LoginUtil from "@/common/utils/LoginUtil";
export default {
  name: "indexAction",
  created() {
    this.init();
  },
  data() {
    return {
      userInfo: null
    };
  },
  methods: {
    init() {
      this.$store.commit("setTabs", true);
      if (LoginUtil.getToken()) {
        this.$Toast.loading({ message: "加载中...", forbidClick: true });
        this.$api.movieMyCenter({}).then(res => {
          if (res && res.statusText == "OK") {
            this.userInfo = res.data.accountInfo[0];
            setTimeout(() => {
              this.$Toast.clear();
            }, 300);
          }
        });
      }
    },
    GoToLogin() {
      this.goTo("user");
    },
    goToFilmOrders() {
      this.goTo("film_orders");
    },
    goToCollect() {
      this.goTo("collect");
    },
    goTo(goto) {
      if (!LoginUtil.getToken()) {
        this.$Toast.loading("加载中");
        setTimeout(() => {
          this.$Toast.clear();
          this.$router.push({ name: "login" });
        }, 300);
      } else {
        this.$store.commit("setTabs", false);
        this.$router.push({ name: goto });
      }
    }
  },
  computed: {
    getAvatar() {
      return LoginUtil.getToken()
        ? (this.userInfo && this.userInfo.avatar) ||
            require("./img/default_avatar.jpg")
        : require("./img/no-user.png");
    }
  }
};
</script>

<style scoped lang="less">
.center-view {
  background-color: #f4f4f4;
  .avatar {
    display: flex;
    align-items: center;
    height: 136px;
    padding: 22px 0 0 22px;
    background: url("./img/center-background.png") center/cover no-repeat;
    .avator-icon {
      width: 63px;
      height: 63px;
      border: 2px solid #fff;
      border-radius: 35px;
      margin-right: 20px;
    }
    .nick-name {
      font-size: 16px;
      color: white;
    }
  }
  .my-order-tab {
    background-color: #fff;
    height: 79px;
    display: flex;
    align-items: center;
    text-align: center;
    font-size: 13px;
    margin-bottom: 10px;
    li {
      flex: 1;
      img {
        width: 26px;
        height: 26px;
      }
      div {
        color: #797d82;
      }
    }
  }
  .center-cell {
    height: 49px;
    background-color: #fff;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    position: relative;
    img {
      width: 20px;
      height: 20px;
    }
    .text {
      flex-grow: 1;
      color: #191a1b;
      margin-left: 15px;
      font-size: 15px;
    }
    &:after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #ededed;
      transform: scaleY(0.5);
    }
  }
}
</style>
