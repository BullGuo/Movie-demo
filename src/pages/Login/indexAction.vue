<template>
  <div class="login">
    <div class="logo">
      <img src="../../common/assets/img/logo.png" alt="" />
    </div>
    <div class="login-form">
      <van-field
        v-model="accountNumber"
        type="tel"
        center
        clearable
        clear-trigger="always"
        maxlength="11"
        placeholder="手机号"
      >
        <template #button>
          <div
            @click="resendVerificationCode"
            :class="['get-sms-code', codeDisabled ? 'code-disable' : '']"
          >
            <span v-if="!showCode">获取验证码</span>
            <span v-else>{{ countDown }}秒</span>
          </div>
        </template>
      </van-field>
      <div class="error-tip" v-if="accountFormat">
        {{
          codeDisabled
            ? "请输入11位正确的手机号码"
            : accountFormat
            ? "手机号格式有误,请重新输入"
            : ""
        }}
      </div>
      <van-field v-model="verificationCode" center placeholder="验证码" />
      <div class="login-btn" @click="handleLogin">
        <span
          :class="!codeDisabled && verificationCode != '' ? '' : 'btn-disable'"
          >登录</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { AccountStatusEnum } from "../../common/enum/AccountStatusEnum";
import LoginUtil from "@/common/utils/LoginUtil";
export default {
  name: "indexAction",
  data() {
    return {
      accountNumber: "",
      verificationCode: "",
      codeDisabled: true,
      countDown: 60, // 倒计时长
      showCode: false, // 显示倒计时
      accountFormat: false // 手机号格式错误
    };
  },
  watch: {
    accountNumber(newVal, oldVal) {
      if (newVal != oldVal) {
        this.accountFormat = false;
      }
      this.codeDisabled = newVal.toString().length == 11 ? false : true;
    }
  },
  methods: {
    // 获取验证码
    resendVerificationCode() {
      if (this.codeDisabled) return;
      this.phoneVerify();
      if (this.accountFormat) return;
      this.showCode = true;
      let time = setInterval(() => {
        this.countDown--;
        if (this.countDown <= 0) {
          clearInterval(time);
          this.countDown = 60;
          this.showCode = false;
        }
      }, 1000);
      let params = { account: this.accountNumber };
      this.$axios.post("http://192.168.50.35:3002/smsCode", params);
    },
    // 登录
    handleLogin() {
      if (this.codeDisabled || this.verificationCode == "") {
        this.accountFormat = true;
        return;
      }
      this.phoneVerify();
      if (this.accountFormat) return;
      let params = { account: this.accountNumber, code: this.verificationCode };
      this.$axios
        .post("http://192.168.50.35:3002/login", params)
        .then(async res => {
          if (res && res.statusText == "OK") {
            switch (res.data.code) {
              case AccountStatusEnum.TOKEN_OVERDUE:
              case AccountStatusEnum.CODE_OVERDUE:
              case AccountStatusEnum.ADD_ABSENT:
              case AccountStatusEnum.CODE_ERROR:
                await this.showLoading("fail", res.data.message);
                break;
              case AccountStatusEnum.TOKEN_SUCCESS:
              case AccountStatusEnum.LOGIN_SUCCESS:
              case AccountStatusEnum.ADD_SUCCESS:
                await this.showLoading("success", res.data.message);
                LoginUtil.setToken(res.data.token, this.afterOfDate(1));
                this.$router.go(-1);
                break;
            }
          }
        });
    },
    //获取n天后的日期
    afterOfDate(n) {
      let d = new Date();
      let hour = d.getHours();
      d.setHours(n + hour);
      return d;
    },
    phoneVerify() {
      let phoneVerify = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      this.accountFormat = !phoneVerify.test(this.accountNumber) ? true : false;
    },
    showLoading(type, data) {
      this.$Toast.loading({ message: "加载中", forbidClick: true });
      return new Promise(resolve => {
        setTimeout(
          () => {
            this.$Toast[type]({
              message: data,
              forbidClick: true,
              duration: 1500
            });
            resolve();
          },
          type == "success" ? 1500 : 500
        );
      });
    }
  }
};
</script>

<style scoped lang="less">
.login {
  width: 100%;
  height: 100%;
  .logo {
    margin: 79px auto 40px;
    text-align: center;
    height: 60px;
    line-height: 60px;
    img {
      width: 60px;
      height: 60px;
    }
  }
  .error-tip {
    color: #ff5f16;
    width: 100%;
    line-height: 11px;
    padding-left: 25px;
    font-size: 11px;
    margin-top: 7px;
    text-align: left;
  }
  .login-form {
    /deep/ .van-cell {
      padding: 20px 25px;
      &:after {
        width: 325px;
        right: 0;
        left: 25px;
      }
      .get-sms-code {
        font-size: 13px;
        width: 90px;
        text-align: right;
        border-radius: 3px;
        cursor: pointer;
      }
      .code-disable {
        color: #bdc0c5;
      }
    }
    /deep/ .van-field__body {
      height: 15px;
      line-height: 15px;
      color: #191a1b;
      font-size: 15px;
    }
    .login-btn {
      line-height: 45px;
      font-size: 16px;
      margin: 70px 25px 0;
      border-radius: 3px;
      text-align: center;
      background-color: #ff5f16;
      height: 44px;
      color: #fff;
      .btn-disable {
        opacity: 0.3;
      }
    }
  }
}
</style>
