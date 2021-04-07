import CookieUtil from "./CookieUtil";
export default class LoginUtil {
  static check() {
    return CookieUtil.get("_ses_token");
  }
  static setToken(ses_token) {
    CookieUtil.set("_ses_token", ses_token);
  }
  static getToken() {
    return CookieUtil.get("_ses_token");
  }
  static setTokenFromUrl() {
    let query = "";
    let href = window.location.href;
    let index = href.indexOf("?");
    if (index !== -1) {
      let queryArr = href.slice(index + 1).split("&");
      if (queryArr && queryArr.length) {
        let variable = [];
        queryArr.map(item => {
          if (item.indexOf("ses_token=") > -1) {
            let arr = item.split("ses_token=");
            if (arr && arr.length) {
              query = arr[1];
            }
          } else {
            variable.push(item);
          }
        });
        let str = "";
        if (variable && variable.length) {
          str = variable.join("&");
        }
        let href = window.location.href.split("?")[0];
        if (str) {
          href = `${href}?${str}`;
        }
        location.href = href;
        if (query) {
          LoginUtil.setToken(query);
        }
      }
    }
    return query;
  }
}
