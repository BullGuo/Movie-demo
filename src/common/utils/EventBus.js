export class EventBus {
  constructor() {
    this.msgQueues = {};
  }
  // 将消息保存到当前的消息队列中
  $on(msgName, func) {
    if (Object.hasOwnProperty.call(this.msgQueues, msgName)) {
      this.msgQueues[msgName].push(func);
    } else {
      this.msgQueues[msgName] = [func];
    }
  }
  // 消息队列中仅保存一个消息
  $one(msgName, func) {
    // 无需检查msgName是否存在
    this.msgQueues[msgName] = [func];
  }
  // 发送消息
  $emit(msgName, msg) {
    if (!Object.hasOwnProperty.call(this.msgQueues, msgName)) {
      return Promise.resolve();
    }
    let rs = [];
    this.msgQueues[msgName].map(fn => {
      let r = fn(msg);
      if (r instanceof Promise) {
        rs.push(r);
      }
    });
    return Promise.all(rs);
  }
  // 移除消息
  $off(msgName) {
    if (!Object.hasOwnProperty.call(this.msgQueues, msgName)) {
      return;
    }
    delete this.msgQueues[msgName];
  }
}
