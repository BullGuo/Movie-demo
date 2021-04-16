<template>
  <div class="film-detail" v-if="detail" @click="goFilmDetail">
    <div class="film-head">
      <span class="film-name">{{ detail.name }}</span>
      <span class="film-grade">{{ detail.grade }}</span>
      <span class="film-grade-unit">分</span>
    </div>
    <div class="film-desc">
      <span>{{ detail.category }} | </span>
      <span> {{ detail.runtime }}分钟 | </span>
      <span>{{ detail.actors | actorsFilter }}</span>
    </div>
    <img
      src="../../img/right.png"
      alt=""
      width="4"
      height="8"
      class="film-more"
    />
  </div>
</template>

<script>
export default {
  name: "FilmDetail",
  props: {
    detail: Object
  },
  methods: {
    async goFilmDetail() {
      await this.$store.dispatch("getFilmDetail", this.detail.filmId);
      this.$router.push({ name: "detail", params: { id: this.detail.filmId } });
    }
  },
  filters: {
    actorsFilter(actor) {
      if (!actor) return "暂无主演";
      return actor
        .map(item => {
          return item.name;
        })
        .join(" | ");
    }
  }
};
</script>

<style scoped lang="less">
.film-detail {
  width: 100%;
  height: 80px;
  padding: 15px 0;
  text-align: center;
  position: relative;
  background-color: #fff;
  .film-head {
    margin-bottom: 10px;
    line-height: 18px;
    color: #ffb232;
    .film-name {
      font-size: 15px;
      color: #191a1b;
      padding-right: 5px;
    }
    .film-grade {
      font-size: 16px;
      font-style: italic;
    }
    .film-grade-unit {
      font-size: 10px;
    }
  }
  .film-desc {
    height: 18px;
    line-height: 18px;
    color: #797d82;
    font-size: 13px;
    padding: 0 12%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .film-more {
    position: absolute;
    right: 15px;
    top: 36px;
  }
}
</style>
