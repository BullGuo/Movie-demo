import Enum from "./Enum";

export class AccountStatusEnum extends Enum {
  static CODE_OVERDUE = "1";
  static CODE_ERROR = "2";
  static TOKEN_OVERDUE = "3";
  static TOKEN_SUCCESS = "4";
  static LOGIN_SUCCESS = "5";
  static LOGIN_ERROR = "6";
  static ADD_SUCCESS = "7";
  static ADD_ABSENT = "8";
  initAddDatas() {
    this.add(AccountStatusEnum.CODE_OVERDUE, "验证码过期");
    this.add(AccountStatusEnum.CODE_ERROR, "验证码错误");
    this.add(AccountStatusEnum.TOKEN_OVERDUE, "token过期");
    this.add(AccountStatusEnum.TOKEN_SUCCESS, "token校验成功");
    this.add(AccountStatusEnum.LOGIN_SUCCESS, "登录成功");
    this.add(AccountStatusEnum.LOGIN_ERROR, "登录失败");
    this.add(AccountStatusEnum.ADD_SUCCESS, "账号添加成功");
    this.add(AccountStatusEnum.ADD_ABSENT, "账号不存在");
  }
}
