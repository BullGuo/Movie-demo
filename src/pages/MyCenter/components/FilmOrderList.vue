<template>
  <div>
    <van-tabs v-model="active" color="#ff5f16" animated border>
      <van-tab title="待观看" name="notWatch" />
      <van-tab title="已观看" name="haveWatch" />
    </van-tabs>
    <movie-list :url="$api.movieCollectList" v-slot="{ data }">
      <img :src="data.poster" />
      <div class="nowPlayingFilm-info">
        <div class="film-name">
          <span class="name">{{ data.name }}</span>
          <span class="item">{{ data.filmType }}</span>
        </div>
        <div class="film-grade" v-if="data.grade">
          <span class="info-col">观众评分 </span>
          <span class="grade">{{ data.grade }}</span>
        </div>
        <div class="info-col">
          上映时间：{{
            $moment(+data.premiereAt * 1000).format("YYYY年MM月DD日")
          }}
        </div>
        <div class="info-col">
          购买时间：{{
            $moment(+data.premiereAt * 1000).format("YYYY年MM月DD日")
          }}
        </div>
      </div>
    </movie-list>
  </div>
</template>

<script>
export default {
  name: "FilmOrderList",
  data() {
    return {
      active: "notWatch"
    };
  },
  components: {
    movieList: () => import("../components/movieList")
  }
};
</script>

<style scoped lang="less">
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
</style>
