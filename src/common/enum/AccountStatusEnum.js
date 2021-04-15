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
  static USER_INFO = "9";
  static UPDATE_SUCCESS = "10";
  static UPLOAD_SUCCESS = "11";
  static COLLECT_SUCCESS = "12";
  static CAN_COLLECT_SUCCESS = "13";
  static HAVE_ALREADY_COLLECTED = "14";
  static NO_COLLECTED = "15";
  static BUY_SUCCESS = "16";
  initAddDatas() {
    this.add(AccountStatusEnum.CODE_OVERDUE, "验证码过期");
    this.add(AccountStatusEnum.CODE_ERROR, "验证码错误");
    this.add(AccountStatusEnum.TOKEN_OVERDUE, "token过期");
    this.add(AccountStatusEnum.TOKEN_SUCCESS, "token校验成功");
    this.add(AccountStatusEnum.LOGIN_SUCCESS, "登录成功");
    this.add(AccountStatusEnum.LOGIN_ERROR, "登录失败");
    this.add(AccountStatusEnum.ADD_SUCCESS, "账号添加成功");
    this.add(AccountStatusEnum.ADD_ABSENT, "账号不存在");
    this.add(AccountStatusEnum.USER_INFO, "信息查询成功");
    this.add(AccountStatusEnum.UPDATE_SUCCESS, "信息更新成功");
    this.add(AccountStatusEnum.UPLOAD_SUCCESS, "图片上传成功");
    this.add(AccountStatusEnum.COLLECT_SUCCESS, "收藏成功");
    this.add(AccountStatusEnum.CAN_COLLECT_SUCCESS, "取消收藏成功");
    this.add(AccountStatusEnum.HAVE_ALREADY_COLLECTED, "已收藏");
    this.add(AccountStatusEnum.NO_COLLECTED, "未收藏");
    this.add(AccountStatusEnum.BUY_SUCCESS, "购买成功");
  }
}
