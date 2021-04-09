<template>
  <div class="change-sex">
    <van-cell
      title="性别"
      :value="value"
      size="large"
      center
      @click="isShow = true"
      :is-link="true"
    />
    <van-popup v-model="isShow" round position="bottom">
      <van-picker
        title="更改性别"
        show-toolbar
        :default-index="default_index"
        :columns="columns"
        item-height="50px"
        @confirm="onConfirm"
        @cancel="isShow = false"
        class="picker-class"
      />
    </van-popup>
  </div>
</template>

<script>
import { AccountStatusEnum } from "../../../../common/enum/AccountStatusEnum";
import LoginUtil from "@/common/utils/LoginUtil";
export default {
  name: "ChangeSex",
  props: {
    userInfo: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    userInfo: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return;
        if (val.sex == 0) {
          this.default_index = 0;
          this.value = "未设置";
        } else {
          this.default_index = val.sex - 1;
          this.value = val.sex == 1 ? "男" : "女";
        }
      }
    }
  },
  data() {
    return {
      isShow: false,
      columns: [
        { text: "男", id: 1 },
        { text: "女", id: 2 }
      ],
      default_index: 0,
      value: "未设置"
    };
  },
  methods: {
    onConfirm(value) {
      this.$Toast.loading({ message: "更新中...", forbidClick: true });
      this.isShow = false;
      this.$axios
        .post("http://47.94.152.106:3002/update", {
          sex: value.id,
          token: LoginUtil.getToken()
        })
        .then(res => {
          if (res && res.statusText == "OK") {
            if (res.data.code == AccountStatusEnum.UPDATE_SUCCESS) {
              setTimeout(() => {
                this.value = value.text;
                this.default_index = value.id - 1;
                this.$Toast.clear();
              }, 500);
            }
          }
        });
    }
  }
};
</script>

<style scoped lang="less">
.change-sex {
  position: relative;
  &:after {
    content: "";
    position: absolute;
    left: 0.42667rem;
    top: 0;
    right: 0.42667rem;
    height: 1px;
    border-top: 1px solid #ededed;
    color: #ededed;
    transform-origin: 0 0;
    transform: scaleY(0.5);
  }
}
</style>
