<template>
  <a class="buy-ticket" @click="buyTicketClick">选座购票</a>
</template>

<script>
export default {
  name: "BuyTicket",
  props: {
    id: {
      type: [Number, String],
      default: ""
    }
  },
  methods: {
    buyTicketClick() {
      this.$router.push({ name: "filmCinemas", params: { id: this.id } });
    }
  }
};
</script>

<style scoped lang="less">
.buy-ticket {
  width: 100%;
  height: 49px;
  position: fixed;
  bottom: 0;
  background: #ff5f16;
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 49px;
  z-index: 1;
  outline: none;
  cursor: pointer;
  &:active {
    background: rgb(229, 85, 19);
  }
}
</style>
