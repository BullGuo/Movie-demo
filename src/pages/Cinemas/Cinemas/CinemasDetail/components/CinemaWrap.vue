<template>
  <div class="cinema-wrap">
    <div class="cinema-info">
      <div
        class="tags"
        v-if="detail.services && detail.services.length"
        @click="tagInfo"
      >
        <div class="tag" v-for="(item, index) in detail.services" :key="index">
          {{ item.name }}
        </div>
        <van-icon name="arrow" />
      </div>
      <div class="address">
        <img src="../img/address.png" alt="" class="left-icon" />
        <div class="address-title">{{ detail.address }}</div>
        <img src="../img/phone.png" alt="" class="right-icon" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CinemaWrap",
  props: {
    detail: Object
  },
  methods: {
    tagInfo() {
      this.$emit("update:showClose", true);
    }
  }
};
</script>

<style scoped lang="less">
.cinema-wrap {
  .cinema-info {
    .tags {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      color: #ffb232;
      overflow: hidden;
      padding: 5px 0 15px;
      .tag {
        padding: 0 6px;
        margin: 0 2.5px;
        font-size: 10px;
        border: 1px solid #ffb232;
        border-radius: 1px;
      }
    }
    .address {
      height: 50px;
      display: flex;
      padding-left: 17px;
      align-items: center;
      .left-icon {
        width: 14px;
        height: 21px;
      }
      .address-title {
        font-size: 14px;
        height: 20px;
        padding: 0 12px;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .right-icon {
        width: 17px;
        height: 18px;
        padding: 0 25px;
        color: #333;
        cursor: pointer;
        box-sizing: content-box;
      }
    }
  }
}
</style>
