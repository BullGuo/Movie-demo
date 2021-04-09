<template>
  <div class="date-of-birth">
    <van-cell
      title="出生日期"
      :value="itemValue"
      size="large"
      center
      value-class="date-right"
      @click="showPicker = true"
      :is-link="true"
    />
    <van-popup v-model="showPicker" round position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="handleConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { AccountStatusEnum } from "../../../../common/enum/AccountStatusEnum";
import LoginUtil from "@/common/utils/LoginUtil";
export default {
  name: "DateOfBirth",
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
        if (val.birthday == 0) {
          this.itemValue = "未设置";
          return;
        }
        let time = +val.birthday * 1000;
        if (time) {
          let year = this.$moment(time).format("YYYY");
          let month = this.$moment(time).format("M") - 1;
          let day = this.$moment(time).format("D");
          this.currentDate = new Date(+year, +month, +day);
          this.itemValue = this.$moment(time).format("YYYY年MM月DD日");
        }
      }
    }
  },
  data() {
    return {
      currentDate: new Date(2000, 0, 1),
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(),
      itemValue: "未设置",
      showPicker: false
    };
  },
  methods: {
    handleConfirm(value) {
      this.showPicker = false;
      this.$Toast.loading({ message: "更新中...", forbidClick: true });
      this.$axios
        .post("http://192.168.50.35:3002/update", {
          birthday: Math.floor(this.$moment(value).valueOf() / 1000),
          token: LoginUtil.getToken()
        })
        .then(res => {
          if (res && res.statusText == "OK") {
            if (res.data.code == AccountStatusEnum.UPDATE_SUCCESS) {
              setTimeout(() => {
                this.itemValue = this.$moment(value).format("YYYY年MM月DD日");
                this.$Toast.clear();
              }, 500);
            }
          }
        });
    },
    formatter(type, val) {
      switch (type) {
        case "year":
          return val + "年";
        case "month":
          return val + "月";
        case "day":
          return val + "日";
      }
      return val;
    }
  }
};
</script>

<style scoped lang="less">
.date-of-birth {
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
  .date-right {
    color: #797d82;
    font-size: 13px;
  }
}
</style>
