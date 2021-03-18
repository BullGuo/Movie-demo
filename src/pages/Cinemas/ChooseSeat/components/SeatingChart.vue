<template>
  <div
    class="seating-chart"
    :style="{
      '--width': seatingChart.width,
      '--height': seatingChart.height
    }"
    v-if="seatingChart.width && seatingChart.height"
  >
    <div v-for="item in seatingChart.width * seatingChart.height" :key="item">
      <p>{{ item }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SeatingChart",
  props: {
    seatingChart: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    console.log(this.seatingChart);
  }
};
</script>

<style scoped lang="less">
.seating-chart {
  display: grid;
  height: calc(100% - 46px - 40px - 40px - 45px - 88px);
  /*grid-template-columns: 1fr 1fr;*/
  /*grid-template-columns: repeat(3, 1fr);*/
  grid-template-columns: repeat(var(--width), 1fr);
  /*grid-template-rows: repeat(var(--height), 1fr);*/
  gap: 5px;
  grid-template-areas:
    "a . c"
    "d . f"
    "g . i";
  div {
    background-color: #fbf4d8;
  }
}
</style>
