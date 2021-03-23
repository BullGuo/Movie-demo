<template>
  <div v-if="transitList.length" class="transit-list">
    <div v-for="(item, index) of transitList" :key="index" class="item">
      {{ index }}
      <p>{{ item.time | timeFilter }}</p>
      <p>{{ item.walking_distance }}米</p>
      <p>{{ item | busFilter }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TransitList",
  props: {
    transitList: {
      type: Array,
      default: () => []
    }
  },
  // watch: {
  //   transitList: {
  //     immediate: true,
  //     handler(val) {
  //       console.log(val);
  //       if (!val.length) return;
  //       console.log(this.busList);
  //     }
  //   }
  // },
  data() {
    return {
      // busList: []
    };
  },
  filters: {
    timeFilter(time) {
      let hour = Math.floor(time / 3600);
      let minute = Math.ceil(time / 60) - hour * 60;
      return `${hour}时 ${minute}分`;
    },
    busFilter(data) {
      let busList = data.segments.filter(item => item.transit_mode == "BUS");
      let busName = "";
      for (let item of busList) {
        let index = item.instruction.indexOf("路(");
        busName += item.instruction.substring(2, index + 1) + "/";
      }
      return busName.slice(0, -1);
    }
  }
};
</script>

<style scoped lang="less">
.transit-list {
  position: absolute;
  bottom: 0;
  z-index: 10;
  width: 100%;
  height: calc(100% - 44px);
  background-color: #fafafa;
  overflow-y: auto;
  padding: 10px;
  .item {
    width: 100%;
    height: 80px;
    background-color: #fff;
    border-radius: 5px;
    margin-bottom: 10px;
  }
}
</style>
