import { Toast } from "vant";

function ArouseAThirdParty(url) {
  // 记录起始时间
  const last = Date.now();
  // 创建一个iframe
  const ifr = document.createElement("IFRAME");
  ifr.src = url;
  // 飘出屏幕外
  ifr.style.position = "absolute";
  ifr.style.left = "-1000px";
  ifr.style.top = "-1000px";
  ifr.style.width = "1px";
  ifr.style.height = "1px";
  // 设置一个4秒的动画用于检查客户端是否被调起
  ifr.style.transition = "all 4s";
  document.body.appendChild(ifr);
  setTimeout(() => {
    // 监听动画完成时间
    ifr.addEventListener(
      "webkitTransitionEnd",
      () => {
        document.body.removeChild(ifr);
        if (Date.now() - last < 6000) {
          // 如果动画执行时间在预设范围内，就认为没有调起客户端
          Toast.fail("唤起失败");
        }
      },
      false
    );
    // 启动动画
    ifr.style.left = "-10px";
  }, 0);
}

export default ArouseAThirdParty;
