<template>
  <div class="change-avatar">
    <van-uploader :before-read="updateBefore" :after-read="updateAfter">
      <van-cell
        title="头像"
        size="large"
        center
        value-class="sex-right"
        @click="isShow = true"
        :is-link="true"
      >
        <van-image round :src="avatarImg" class="van-image" />
      </van-cell>
    </van-uploader>
  </div>
</template>

<script>
import { AccountStatusEnum } from "../../../../common/enum/AccountStatusEnum";
import LoginUtil from "@/common/utils/LoginUtil";
export default {
  name: "ChangeAvatar",
  props: {
    userInfo: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    userInfo: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return;
        this.avatarImg = val.avatar || require("../../img/default_avatar.jpg");
      }
    }
  },
  data() {
    return {
      avatarImg: require("../../img/default_avatar.jpg")
    };
  },
  methods: {
    updateBefore(file) {
      if (file.length >= 2) {
        for (const curFiles of file) {
          return this.typeofImage(curFiles);
        }
      } else {
        return this.typeofImage(file);
      }
    },
    async updateAfter(file) {
      file.file = await this.compressImg(file.file);
      let params = this.formUploadParam(file);
      params.append("token", LoginUtil.getToken());
      const { data } = await this.$axios.post(
        "http://192.168.50.35:3002/upload",
        params
      );
      this.$Toast.loading({ message: "更新中...", forbidClick: true });
      if (data && data.code == AccountStatusEnum.UPLOAD_SUCCESS) {
        this.updateFileStatus(file, "done", data);
        this.avatarImg = data.url;
        setTimeout(() => {
          this.$Toast.clear();
        }, 250);
      } else {
        this.updateFileStatus(file, "failed");
        this.$Toast.fail("图片更换失败，请重试");
      }
    },
    // 图片压缩函数
    compressImg(file) {
      const that = this;
      let files;
      let fileSize = parseFloat(parseInt(file["size"]) / 1024 / 1024).toFixed(
        2
      );
      let read = new FileReader();
      read.readAsDataURL(file);
      return new Promise(function(resolve) {
        read.onload = function(e) {
          let img = new Image();
          img.src = e.target.result;
          img.onload = function() {
            // 默认按比例压缩
            let w = this.width;
            let h = this.height;
            // 生成canvas
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            let base64;
            // 创建属性节点
            canvas.setAttribute("width", w);
            canvas.setAttribute("height", h);
            ctx.drawImage(this, 0, 0, w, h);
            if (fileSize < 1) {
              // 如果图片小于一兆 那么压缩0.5
              base64 = canvas.toDataURL(file["type"], 0.5);
            } else if (fileSize > 1 && fileSize < 2) {
              // 如果图片大于1M并且小于2M 那么压缩0.5
              base64 = canvas.toDataURL(file["type"], 0.5);
            } else {
              // 如果图片超过2m 那么压缩0.2
              base64 = canvas.toDataURL(file["type"], 0.2);
            }
            // 回调函数返回file的值（将base64编码转成file）
            files = that.dataURLtoFile(base64, file.name); // 如果后台接收类型为base64的话这一步可以省略
            resolve(files);
          };
        };
      });
    },
    // base64转码（压缩完成后的图片为base64编码，这个方法可以将base64编码转回file文件）
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    updateFileStatus(file, status, res) {
      let statusMap = {
        uploading: "上传中...",
        failed: "上传失败",
        done: "上传成功"
      };
      file.status = status;
      file.message = statusMap[status];
      if (status == "done") {
        file.pic_url = res.url;
      }
    },
    formUploadParam({ file }) {
      let param = { file };
      let fm = new FormData();
      Object.keys(param).forEach(item => {
        fm.append(item, param[item]);
      });
      return fm;
    },
    typeofImage(curFiles) {
      if (!/(image)\/\w+/.test(curFiles.type)) {
        this.$Toast.fail("请上传图片");
        return false;
      }
      return true;
    }
  }
};
</script>

<style scoped lang="less">
.change-avatar {
  margin-top: 10px;
  .van-image {
    width: 50px;
    height: 50px;
    vertical-align: middle;
  }
}
/deep/ .van-cell--large {
  width: 100vw;
}
</style>
