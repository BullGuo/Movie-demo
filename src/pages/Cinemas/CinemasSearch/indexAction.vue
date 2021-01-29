<template>
  <div class="cinemas-search">
    <div class="cinemas-search-input">
      <div class="input-wrap">
        <van-icon name="search" size="17" color="#797d82" class="left-icon" />
        <input v-model="searchValue" type="text" placeholder="输入影城名称" />
        <van-icon
          name="clear"
          color="#797d82"
          size="14"
          class="right-icon"
          v-show="showClear"
          @click="searchValue = ''"
        />
      </div>
      <div class="cancel-btn" @click="handleCancel">取消</div>
    </div>
    <div class="cinema-nearby" v-if="!showClear">
      <div class="cinema-index-title">离你最近</div>
      <ul class="cinema-index-detail">
        <li v-for="item in list.slice(0, 5)" :key="item.cinemaId">
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="search-result" v-if="showClear">
      <ul>
        <cinemas-list-item
          v-for="item in searchList"
          :key="item.cinemaId"
          :detail="item"
        />
      </ul>
    </div>
    <div class="empty-result" v-if="!searchList.length && showClear">
      <img
        src="https://assets.maizuo.com/h5/v5/public/app/img/rectangle@2x.2bdf0374.png"
        alt=""
      />
      <p>没有找到匹配的影院</p>
      <p class="empty-list-tip">
        提示：仅支持搜索“影院”，建议您检查输入的影院名称是否有误？
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "indexAction",
  data() {
    return {
      list: [],
      showClear: false,
      searchValue: "",
      searchList: []
    };
  },
  watch: {
    searchValue(val) {
      if (val !== "") {
        this.showClear = true;
        let list = [];
        let fuzzySearch = new RegExp(val, "i");
        for (let item of this.list) {
          if (fuzzySearch.test(item.address) || fuzzySearch.test(item.name)) {
            list.push(item);
          }
        }
        this.searchList = [...list];
      } else {
        this.showClear = false;
      }
    }
  },
  created() {
    this.$store.commit("setTabs", false);
    let state = this.$store.state;
    let params = {
      ...state.cinemas_params,
      ...{ cityId: state.cityInfo.cityID || state.cityInfo.cityId }
    };
    this.$axios({
      url: `https://m.maizuo.com/gateway?k=3631575`,
      params: { ...params },
      headers: {
        "X-Client-Info":
          '{"a":"3000","ch":"1002","v":"5.0.4","e":"16092348011945091904110593","bc":"110100"}',
        "X-Host": "mall.film-ticket.cinema.list"
      }
    }).then(res => {
      if (res && res.data.msg == "ok") {
        this.list = [...res.data.data.cinemas];
      }
    });
  },
  methods: {
    handleCancel() {
      this.$router.push({ name: "cinemas" });
    }
  },
  components: {
    CinemasListItem: () => import("../components/components/CinemasListItem")
  },
  beforeDestroy() {
    this.$store.commit("setTabs", true);
  }
};
</script>

<style scoped lang="less">
.cinemas-search {
  overflow: auto;
  .cinemas-search-input {
    width: 100vw;
    height: 49px;
    box-sizing: border-box;
    padding: 9.5px 15px;
    display: flex;
    position: fixed;
    z-index: 1;
    background-color: #ffffff;
    .input-wrap {
      width: calc(100% - 43px);
      background-color: #f4f4f4;
      position: relative;
      border-radius: 3px;
      .left-icon {
        position: absolute;
        top: 7px;
        left: 9px;
      }
      .right-icon {
        position: absolute;
        top: 8px;
        right: 10px;
      }
      input {
        background-color: #f4f4f4;
        border: none;
        width: calc(100% - 65px);
        height: 30px;
        position: absolute;
        top: 0px;
        left: 33.5px;
        font: 12px/1.5 Tahoma, Helvetica, Arial, sans-serif;
        color: #2c3e50;
        &::-webkit-input-placeholder {
          color: #bab8b8;
        }
        &::-moz-placeholder {
          color: #bab8b8;
        }
        &:-ms-input-placeholder {
          color: #bab8b8;
        }
        &:-moz-placeholder {
          color: #bab8b8;
        }
      }
    }
    .cancel-btn {
      margin-left: 15px;
      font-size: 14px;
      line-height: 30px;
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
  .cinema-nearby {
    padding: 49px 15px 8px;
    min-height: 100vh;
    box-sizing: border-box;
    font-size: 13px;
    .cinema-index-title {
      color: #bdc0c5;
      margin: 16px 0;
    }
    .cinema-index-detail {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      li {
        box-sizing: border-box;
        text-align: center;
        height: 30px;
        margin: 0 10px 10px 0;
        padding: 8px 12px;
        background-color: hsla(0, 0%, 95.7%, 0.6);
      }
    }
  }
  .search-result {
    margin-top: 49px;
  }
  .empty-result {
    position: absolute;
    top: 156px;
    width: 100%;
    text-align: center;
    color: #bdc0c5;
    img {
      width: 90px;
    }
    p {
      font-size: 14px;
    }
    .empty-list-tip {
      font-size: 11px;
      padding: 0 22vw;
    }
  }
}
</style>
