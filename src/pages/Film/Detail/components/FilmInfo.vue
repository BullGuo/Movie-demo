<template>
  <div class="film-detail">
    <div class="info-class">
      <div class="film-name">
        <span class="name">{{ dataDetail.name }}</span>
        <span class="item">{{ dataDetail.filmType.name }}</span>
      </div>
      <div class="film-grade">
        <span class="grade">{{ dataDetail.grade }}</span>
        <span class="grade-text">分</span>
      </div>
    </div>
    <div class="grey-text">{{ dataDetail.category | categoryFilter }}</div>
    <div class="grey-text">{{ dataDetail.premiereAt | timeFilter }}</div>
    <div class="grey-text">
      {{ dataDetail.nation }} | {{ dataDetail.runtime }}分钟
    </div>
    <div class="grey-text hide" :style="'height:' + (is_up ? 'auto' : '37px')">
      {{ dataDetail.synopsis }}
    </div>
    <div class="toggle">
      <van-icon
        :name="is_up ? 'arrow-up' : 'arrow-down'"
        color="rgb(189,192,197)"
        @click="iconClick"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "FilmInfo",
  data() {
    return {
      dataDetail: this.$store.state.film_detail,
      is_up: false
    };
  },
  filters: {
    categoryFilter(val) {
      return val.split("|").join(" | ");
    },
    timeFilter(time) {
      let date = new Date(time * 1000);
      let Y = date.getFullYear(),
        M =
          date.getMonth() + 1 > 10
            ? date.getMonth() + 1
            : "0" + (date.getMonth() + 1),
        D = date.getDate() > 10 ? date.getDate() : "0" + date.getDate();
      let toDay = Y + "-" + M + "-" + D + "上映";
      return toDay;
    }
  },
  methods: {
    iconClick() {
      this.is_up = !this.is_up;
    }
  }
};
</script>

<style scoped lang="less">
.film-detail {
  padding: 12px 15px 15px;
  background-color: #fff;
  .info-class {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .film-name {
      width: 256px;
      .name {
        color: #191a1b;
        font-size: 18px;
        height: 24px;
        line-height: 24px;
        margin-right: 7px;
      }
      .item {
        font-size: 9px;
        color: #fff;
        background-color: #d2d6dc;
        height: 14px;
        line-height: 14px;
        padding: 0 2px;
        border-radius: 2px;
        display: inline-block;
      }
    }
    .film-grade {
      text-align: right;
      color: #ffb232;
      width: calc(100% - 250px);
      .grade {
        font-size: 18px;
        font-style: italic;
      }
      .grade-text {
        font-size: 10px;
      }
    }
  }
  .grey-text {
    font-size: 13px;
    color: #797d82;
    margin-top: 6px;
  }
  .hide {
    overflow: hidden;
  }
  .toggle {
    text-align: center;
  }
}
</style>
