<template>
  <ul class="ticket-list" v-if="ticketList.length">
    <li v-for="(item, index) of ticketList" :key="index" class="list-item">
      <div
        :style="{
          '--color': `${index ? 'rgb(92,214,4)' : 'rgb(239,193,0)'}`
        }"
      />
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
  }
};
</script>

<style scoped lang="less">
.ticket-list {
  display: flex;
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  .list-item {
    margin-right: 15px;
    display: flex;
    align-items: center;
    div {
      width: 16px;
      height: 16px;
      border: 1px solid var(--color);
    }
    span {
      margin-left: 2px;
      color: #797d82;
      font-size: 13px;
    }
  }
}
</style>
