<template>
  <ul class="ticket-list" v-if="ticketList.length">
    <li v-for="(item, index) of ticketList" :key="index" class="list-item">
      <img :src="getIcon(index)" alt="" />
      <span>￥{{ item / 100 }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "TicketList",
  props: {
    ticketList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    getIcon() {
      return index => {
        return index
          ? require("../../img/seat-two.png")
          : require("../../img/seat-one.png");
      };
    }
  }
};
</script>

<style scoped lang="less">
.ticket-list {
  display: flex;
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  background-color: #fff;
  .list-item {
    margin-right: 15px;
    display: flex;
    align-items: center;
    img {
      width: 25px;
      height: 25px;
    }
    span {
      margin: 3px 0 0 2px;
      color: #797d82;
      font-size: 13px;
    }
  }
}
</style>
