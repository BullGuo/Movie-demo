/**
 * 注册全局组件
 */

import Vue from "vue";

const requireComponent = require.context("./", true, /\.vue$/);
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);
  // 获取组件的 PascalCase 命名
  const filePathArr = fileName.split("/");
  let componentName = [...filePathArr].pop().replace(/\.\w+$/, "");
  if (componentName === "index" || componentName === "Index") {
    componentName = filePathArr.slice(-2, -1)[0];
  }
  Vue.component(componentName, componentConfig.default || componentConfig);
});
