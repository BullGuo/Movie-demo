<template>
  <ul class="film-list-class">
    <li
      v-for="data in $store.state.film_list"
      :key="data.filmId"
      @click="handleClick(data.filmId)"
    >
      <img :src="data.poster" />
      <div class="nowPlayingFilm-info">
        <div class="film-name">
          <span class="name">{{ data.name }}</span>
          <span class="item">{{ data.filmType.name }}</span>
        </div>
        <div class="film-grade" v-if="data.grade">
          <span class="info-col">观众评分 </span>
          <span class="grade">{{ data.grade }}</span>
        </div>
        <div class="van-ellipsis info-col">
          主演：{{ data.actors | actorFilter }}
        </div>
        <div class="info-col">{{ data.nation }} | {{ data.runtime }}分钟</div>
      </div>
      <van-button
        plain
        :color="button_text == '购票' ? '#ff5f16' : '#ffb232'"
        size="small"
        v-if="data.isPresale"
      >
        {{ button_text }}
      </van-button>
    </li>
  </ul>
</template>

<script>
export default {
  name: "FilmList",
  props: {
    button_text: {
      type: String,
      default: "购票"
    }
  },
  filters: {
    actorFilter(actor) {
      if (!actor) return "暂无主演";
      return actor
        .map(item => {
          return item.name;
        })
        .join(" ");
    }
  },
  methods: {
    async handleClick(id) {
      await this.$store.dispatch("getFilmDetail", id);
      this.$router.push({ name: "detail", params: { id: id } });
    }
  }
};
</script>

<style lang="less" scoped>
.film-list-class {
  li {
    padding: 15px;
    display: flex;
    align-items: center;
    position: relative;
    .nowPlayingFilm-info {
      width: calc(100% - 116px);
      padding: 0 10px;
      box-sizing: border-box;
      .film-name {
        .name {
          color: #191a1b;
          font-size: 16px;
          line-height: 22px;
          margin-right: 5px;
        }
        .item {
          font-size: 9px;
          color: #fff;
          background-color: #d2d6dc;
          padding: 0 2px;
          border-radius: 2px;
          position: relative;
          top: -2px;
        }
      }
      .film-grade {
        height: 21px;
        line-height: 21px;
      }
      .info-col {
        font-size: 13px;
        margin-top: 4px;
        color: #797d82;
      }
      .grade {
        color: #ffb232;
        font-size: 15px;
      }
    }
    img {
      float: left;
      width: 66px;
      height: 94px;
    }
    button {
      height: 25px;
    }
    &:after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      height: 1px;
      width: 100%;
      border-bottom: 1px solid #ededed;
      transform: scaleY(0.5);
    }
  }
}
</style>
