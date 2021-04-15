<template>
  <div class="change">
    <van-nav-bar
      title="更改昵称"
      right-text="保存"
      left-arrow
      border
      fixed
      placeholder
      @click-left="$emit('goBack')"
      @click-right="onClickRight"
    />
    <van-field
      v-model="nickname"
      placeholder="新昵称"
      clearable
      clear-trigger="always"
    />
  </div>
</template>

<script>
import { AccountStatusEnum } from "../../../../common/enum/AccountStatusEnum";
export default {
  name: "ChangeName",
  props: {
    userInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      nickname: this.userInfo.name
    };
  },
  methods: {
    onClickRight() {
      this.$Toast.loading({ message: "更新中...", forbidClick: true });
      this.$api.movieUpdate({ name: this.nickname }).then(res => {
        if (res && res.statusText == "OK") {
          if (res.data.code == AccountStatusEnum.UPDATE_SUCCESS) {
            setTimeout(() => {
              this.$Toast.clear();
              this.$emit("changeNameSuccess");
            }, 500);
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.change {
  margin-top: 10px;
}
/deep/ .van-nav-bar .van-icon {
  color: #404345;
  font-size: 22px;
}
/deep/ .van-nav-bar__title {
  font-size: 17px;
}
</style>
