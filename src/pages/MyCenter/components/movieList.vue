<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <ul class="film-list-class" v-if="dataList.length">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        offset="100"
        :immediate-check="false"
      >
        <li
          v-for="data in dataList"
          :key="data.id"
          @click="handleClick(data.id)"
        >
          <slot>
            <!--            <div>-->
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
              <div class="van-ellipsis info-col">主演：{{ data.actors }}</div>
              <div class="info-col">
                {{ data.nation }} | {{ data.runtime }}分钟
              </div>
            </div>
            <van-button
              plain
              :color="data.isSale ? '#ffb232' : '#ff5f16'"
              size="small"
              v-if="data.isPresale || data.isSale"
            >
              {{ data.isSale ? "预购" : "购票" }}
            </van-button>
            <!--            </div>-->
          </slot>
        </li>
      </van-list>
    </ul>
    <van-empty v-else description="暂无数据" :image="emptyImg" />
  </van-pull-refresh>
</template>

<script>
export default {
  name: "movieList",
  props: {
    url: {
      type: [String, Function]
    }
  },
  data() {
    return {
      emptyImg: require("@/common/assets/img/empty.png"),
      refreshing: false,
      loading: false,
      finished: false,
      offset: 0,
      dataList: []
    };
  },
  created() {
    this.onRefresh();
  },
  methods: {
    init(params) {
      this.url(params).then(res => {
        if (res && res.statusText == "OK") {
          this.dataList = [...res.data.list];
          this.loading = false;
          this.refreshing = false;
          if (!res.data.hasMore) {
            this.finished = true;
          }
        }
      });
    },
    onLoad() {
      let params = { offset: this.offset };
      this.init(params);
    },
    onRefresh() {
      this.finished = false;
      this.loading = true;
      this.offset = 0;
      this.onLoad();
    },
    async handleClick(id) {
      await this.$store.dispatch("getFilmDetail", id);
      this.$store.commit("setTabs", false);
      this.$router.push({ name: "detail", params: { id: id } });
    }
  }
};
</script>

<style lang="less" scoped>
.film-list-class {
  min-height: calc(100vh - 56px);
  li {
    padding: 15px;
    display: flex;
    align-items: center;
    position: relative;
    background-color: #fff;
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
