<template>
  <div class="cinemas-top-filter">
    <div class="header">
      <div class="header-left" @click="getCity">
        <span>{{ cityName }}</span>
        <img src="../img/city-icon.png" alt="" />
      </div>
      <div class="header-title">影院</div>
      <div class="header-right">
        <img src="../img/search.png" alt="" @click="goSearch" />
      </div>
    </div>
    <div class="filter">
      <van-dropdown-menu active-color="#ff5f16">
        <van-dropdown-item
          title-class="filter-title"
          ref="dropdownItem"
          @open="handleOpen"
        >
          <template #title>
            <span>{{ cityDropdownTitle }}</span>
          </template>
          <template #default>
            <ul class="filter-city">
              <li
                v-for="(item, index) in list"
                :key="index"
                class="city-item"
                @click="handleClick(item.name, index)"
              >
                {{ item.name }}
              </li>
            </ul>
          </template>
        </van-dropdown-item>
        <van-dropdown-item
          v-model="ticketFlag"
          :options="ticketFlagList"
          title-class="filter-title"
          @change="typeChange"
        />
        <van-dropdown-item
          v-model="value3"
          :options="option3"
          title-class="filter-title"
        />
      </van-dropdown-menu>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  name: "CinemasTopFilter",
  data() {
    return {
      list: [{ name: "全城" }],
      cityDropdownTitle: "全城",
      isChecked: false,
      ticketFlag: 1,
      value3: 1,
      ticketFlagList: [
        { text: "App订票", value: 1 },
        { text: "前台兑换", value: 2 }
      ],
      option3: [
        { text: "最近去过", value: 1 },
        { text: "离我最近", value: 2 }
      ],
      cityName: this.$store.state.cityInfo.name
    };
  },
  methods: {
    handleOpen() {
      if (this.list.length == 1) {
        let params = {
          keywords: this.cityName,
          subdistrict: 1, // 子级行政区级数
          page: 1
        };
        let url = `https://restapi.amap.com/v3/config/district?key=acfd69505fc1e249ba94625ff4b0d22d`;
        this.$axios.get(url, { params }).then(res => {
          if (res.data && res.data.status && res.data.info == "OK") {
            this.list = [...this.list, ...res.data.districts[0].districts];
            if (this.cityDropdownTitle == "全城") {
              $(".filter-city li").addClass("check-class");
            }
          }
        });
      }
    },
    handleClick(value, index) {
      this.cityDropdownTitle = value;
      this.isChecked = true;
      $(".filter-city li").removeClass("check-class");
      $(".filter-city li")
        .eq(index)
        .addClass("check-class");
      this.$refs.dropdownItem.toggle(false);
      this.$Toast({ message: "稍安勿躁，功能开发中!", position: "bottom" });
    },
    typeChange(ticketFlag) {
      this.$store.commit("setCinemasParams", { ticketFlag: ticketFlag });
    },
    goSearch() {
      this.$router.push({ name: "search" });
    },
    // 跳转城市
    getCity() {
      this.$router.push({ name: "city" });
    }
  }
};
</script>

<style scoped lang="less">
.cinemas-top-filter {
  position: fixed;
  z-index: 1;
  width: 100%;
  .header {
    height: 44px;
    color: #191a1b;
    font-size: 17px;
    text-align: center;
    line-height: 44px;
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    box-sizing: border-box;
    position: relative;
    background-color: #fff;
    .header-left {
      font-size: 13px;
      img {
        width: 6px;
        height: 3px;
        vertical-align: middle;
        margin-left: 5px;
      }
    }
    .header-right {
      img {
        width: 18px;
        height: 18px;
        vertical-align: middle;
      }
    }
    .header-title {
      flex-grow: 1;
      text-align: center;
      padding-right: 21px;
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
  .filter {
    .filter-city {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      color: #797d82;
      padding: 10px 0 0 10px;
      .city-item {
        font-size: 12px;
        width: calc(25vw - 14.5px);
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid rgba(210, 214, 220, 0.5);
        border-radius: 4px;
        margin: 0 10px 15px 0;
        position: relative;
      }
      .check-class {
        color: #ff5f16;
        border: 1px solid rgba(255, 95, 22, 0.6);
      }
    }
    /deep/ .filter-title {
      font-size: 14px;
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
  /deep/ .van-dropdown-menu__bar {
    box-shadow: none;
  }
}
</style>
