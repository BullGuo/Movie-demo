<template>
  <div class="login">
    <div class="logo"></div>
    <div class="login-form">
      <van-field v-model="sms" type="tel" center clearable placeholder="手机号">
        <template #button>
          <van-button size="small" type="primary">发送验证码</van-button>
        </template>
      </van-field>
      <van-field v-model="sms1" center clearable placeholder="验证码" />
      <div class="login-btn" @click="handleLogin">登录</div>
    </div>
    <div>{{ list }}</div>
  </div>
</template>

<script>
export default {
  name: "indexAction",
  data() {
    return {
      sms: "",
      sms1: "",
      list: 60
    };
  },
  methods: {
    handleLogin() {
      setInterval(() => {
        this.list--;
      }, 1000);
      // this.$axios({
      //   url: "sms.tencentcloudapi.com",
      //   params: {
      //     PhoneNumberSet: ["+8617341932053"],
      //     TemplateID: "916608",
      //     Sign: "一个简单的小站",
      //     TemplateParamSet: ["383843", "5"],
      //     SmsSdkAppid: "1400505961"
      //   }
      // });
      this.$axios("http://192.168.50.35:3000/users");
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
  }
  .login-form {
    .login-btn {
      /*margin-top: 70px;*/
      line-height: 45px;
      font-size: 16px;
      margin: 70px 25px 0;
      border-radius: 3px;
      text-align: center;
      background-color: #ff5f16;
      height: 44px;
      color: #fff;
    }
  }
}
</style>
