<template>
  <div class="user">
    <div v-if="!showChangeName">
      <van-nav-bar
        title="我的资料"
        left-arrow
        fixed
        placeholder
        @click-left="onClickLeft"
      />
      <change-avatar :user-info="userInfo" />
      <div>
        <van-cell
          border
          title="昵称"
          :value="userInfo.name"
          size="large"
          center
          value-class="date-right"
          @click="showChangeName = true"
          :is-link="true"
        />
      </div>
      <change-sex :user-info="userInfo" />
      <date-of-birth :user-info="userInfo" />
    </div>
    <change-name
      v-else
      @changeNameSuccess="updateName"
      @goBack="goBack"
      :user-info="userInfo"
    />
  </div>
</template>

<script>
import LoginUtil from "@/common/utils/LoginUtil";
export default {
  name: "indexAction",
  created() {
    this.$store.commit("setTabs", false);
    this.init();
  },
  data() {
    return {
      showChangeName: false,
      userInfo: {}
    };
  },
  methods: {
    init() {
      let params = { token: LoginUtil.getToken() };
      this.$axios
        .post("http://192.168.50.35:3002/myCenter", params)
        .then(res => {
          if (res && res.statusText == "OK") {
            this.userInfo = res.data.accountInfo[0];
          }
        });
    },
    updateName() {
      this.showChangeName = false;
      this.init();
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    goBack() {
      this.showChangeName = false;
    }
  },
  components: {
    ChangeAvatar: () => import("./components/ChangeAvatar"),
    ChangeName: () => import("./components/ChangeName"),
    ChangeSex: () => import("./components/ChangeSex"),
    DateOfBirth: () => import("./components/DateOfBirth")
  },
  destroyed() {
    this.$store.commit("setTabs", true);
  }
};
</script>

<style scoped lang="less">
.user {
  background-color: #f4f4f4;
}
/deep/ .van-nav-bar .van-icon {
  color: #404345;
  font-size: 22px;
}
/deep/ .van-nav-bar__title {
  font-size: 17px;
}
/deep/ .van-nav-bar__text {
  color: #404345;
  font-size: 16px;
}
</style>
