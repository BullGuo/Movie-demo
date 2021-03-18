<template>
  <div class="notice-msg">
    <van-collapse v-model="activeNames" :border="false">
      <van-collapse-item name="collapse">
        <template #title>
          <div class="notice-collapse item-color">
            <img src="../../img/notice-icon.png" alt="" />
            <div v-if="activeNames.length">温馨提示：</div>
            <van-swipe
              vertical
              :autoplay="3000"
              :show-indicators="false"
              :touchable="false"
              class="notice-swipe"
              v-else
            >
              <van-swipe-item
                class="swipe-item"
                v-for="(item, index) of noticeMsgList"
                :key="index"
              >
                {{ item }}
              </van-swipe-item>
            </van-swipe>
          </div>
        </template>
        <template #value>
          <div class="item-color" v-if="!activeNames.length">
            通知
          </div>
        </template>
        <div class="item-color">
          {{ noticeMsg }}
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
export default {
  name: "NoticeMsg",
  props: {
    noticeMsg: {
      type: String,
      default: ""
    }
  },
  watch: {
    noticeMsg(val) {
      if (!val) return;
      this.noticeMsgList = val.split("，");
    }
  },
  data() {
    return {
      activeNames: [],
      noticeMsgList: []
    };
  }
};
</script>

<style scoped lang="less">
.notice-msg {
  .item-color {
    color: #e68e1a;
    line-height: 20px;
  }
  .notice-collapse {
    display: flex;
    align-items: center;
    img {
      margin-right: 5px;
      width: 14px;
      height: 14px;
    }
    .notice-swipe {
      flex: 1;
      height: 20px;
      .swipe-item {
        height: 20px;
        line-height: 20px;
      }
    }
  }
}
/deep/ .van-cell--clickable {
  background-color: #fbf4d8;
  height: 40px;
  padding: 10px 15px;
  &:after {
    border: none;
  }
}
/deep/ .van-cell__right-icon {
  color: rgb(230, 142, 26);
  line-height: 20px;
}
/deep/ .van-collapse-item__content {
  background-color: #fbf4d8;
  padding: 0 16px 6px 35px;
}
/deep/ .van-cell__value {
  flex: none;
}
</style>
