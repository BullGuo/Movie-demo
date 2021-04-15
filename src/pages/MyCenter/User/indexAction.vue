<template>
  <div class="user">
    <div v-if="!showChangeName">
      <movie-nav-bar nav-bar-title="我的资料" />
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
      this.$Toast.loading({ message: "加载中...", forbidClick: true });
      this.$api.movieMyCenter({}).then(res => {
        if (res && res.statusText == "OK") {
          this.userInfo = res.data.accountInfo[0];
          setTimeout(() => {
            this.$Toast.clear();
          }, 300);
        }
      });
    },
    updateName() {
      this.showChangeName = false;
      this.init();
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
  }
};
</script>

<style scoped lang="less">
.user {
  background-color: #f4f4f4;
}
</style>
