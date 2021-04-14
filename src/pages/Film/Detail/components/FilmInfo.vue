<template>
  <div class="film-detail">
    <div class="info-class">
      <div class="film-name">
        <span class="name">{{ dataDetail.name }}</span>
        <span class="item">{{ dataDetail.filmType.name }}</span>
      </div>
      <div class="film-grade" v-if="dataDetail.grade">
        <span class="grade">{{ dataDetail.grade }}</span>
        <span class="grade-text">分</span>
        <van-icon :name="collectName" class="collect" @click="handleCollect" />
      </div>
    </div>
    <div class="grey-text">{{ dataDetail.category | categoryFilter }}</div>
    <div class="grey-text">{{ dataDetail.premiereAt | timeFilter }}</div>
    <div class="grey-text">
      {{ dataDetail.nation }} | {{ dataDetail.runtime || "" }}分钟
    </div>
    <div class="grey-text hide">
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
import $ from "jquery";
export default {
  name: "FilmInfo",
  data() {
    return {
      dataDetail: this.$store.state.film_detail,
      is_up: false,
      collectName: "like-o"
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
      let el = $(".film-detail .hide");
      this.is_up = !this.is_up;
      if (this.is_up) {
        let nowHeight = el.height();
        let autoHeight = el.css("height", "auto").height();
        el.height(nowHeight).animate({ height: autoHeight }, 500);
        return;
      }
      el.animate({ height: 37 }, 500);
    },
    handleCollect() {
      let params = {};
      if (this.collectName == "like-o") {
        // 收藏
        params = {
          id: this.dataDetail.filmId,
          name: this.dataDetail.name,
          filmType: this.dataDetail.filmType.name,
          grade: this.dataDetail.grade,
          actors: this.actorFilter(this.dataDetail.actors),
          nation: this.dataDetail.nation,
          runtime: this.dataDetail.runtime,
          collection_time: Math.floor(new Date().getTime() / 1000),
          premiereAt: this.dataDetail.premiereAt,
          type: "collect"
        };
      } else {
        // 取消收藏
        params = {
          id: this.dataDetail.filmId,
          type: "cancel_collect"
        };
      }
      this.$Toast.loading({ message: "加载中...", forbidClick: true });
      this.$axios
        .post("http://192.168.50.35:3002/collect", params)
        .then(res => {
          if (res && res.statusText == "OK") {
            setTimeout(() => {
              this.$Toast.clear();
            }, 300);
          }
        });
      this.collectName = this.collectName == "like" ? "like-o" : "like";
    },
    actorFilter(actor) {
      if (!actor) return "暂无主演";
      return actor
        .map(item => {
          return item.name;
        })
        .join(" ");
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
      .collect {
        font-size: 18px;
        margin-left: 8px;
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
    height: 37px;
  }
  .toggle {
    text-align: center;
  }
}
</style>
