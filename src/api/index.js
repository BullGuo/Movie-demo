import axios from "axios";

// 登录
export const movieLogin = params =>
  axios.post("http://192.168.50.35:3002/login", {
    ...params
  });

// 发送验证码
export const movieSmsCode = params =>
  axios.post("http://192.168.50.35:3002/smsCode", {
    ...params
  });

// 个人中心信息
export const movieMyCenter = params =>
  axios.post("http://192.168.50.35:3002/myCenter", {
    ...params
  });

// 更改头像
export const movieUpload = params =>
  axios.post("http://192.168.50.35:3002/upload", {
    ...params
  });

// 更改个人信息
export const movieUpdate = params =>
  axios.post("http://192.168.50.35:3002/update", {
    ...params
  });

// 收藏状态
export const movieIsCollect = params =>
  axios.post("http://192.168.50.35:3002/isCollect", {
    ...params
  });

// 收藏
export const movieCollect = params =>
  axios.post("http://192.168.50.35:3002/collect", {
    ...params
  });

// 收藏列表
export const movieCollectList = params =>
  axios.post("http://192.168.50.35:3002/collectList", {
    ...params
  });

// 购买
export const movieBuyTicket = params =>
  axios.post("http://192.168.50.35:3002/buyTicket", {
    ...params
  });

// 购买记录
export const movieOrderList = params =>
  axios.post("http://192.168.50.35:3002/orderList", {
    ...params
  });
