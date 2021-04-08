export default class Enum {
  static _objs = {};
  static _values = {};

  constructor() {}

  static init() {
    let classname = this.name;
    if (!Enum._objs[classname]) {
      Enum._objs[classname] = new this();
      Enum._values[classname] = [];
      Enum._objs[classname].initAddDatas();
    }
    return Enum._objs[classname];
  }

  static getValues() {
    return this.init().getAllValue();
  }

  getAllValue() {
    let classname = this.constructor.name;
    return Enum._values[classname] || [];
  }

  static getValueByIndex(index) {
    return this.init().getValueByKey(index);
  }

  getValueByKey(key) {
    return this.getAllValue().find(item => {
      return item.id == key;
    }).name;
  }

  add(index, val) {
    let classname = this.constructor.name;
    Enum._values[classname].push({
      id: index,
      name: val
    });
  }

  addForList(list, index_name, value_name) {
    this.addForArray(this._getTransformList(list, index_name, value_name));
  }

  addForArray(array) {
    let classname = this.constructor.name;
    Enum._values[classname] = array;
  }

  _getTransformList(list, index_name, value_name) {
    let arr = [];
    for (let model of list) {
      arr[model[index_name]] = model[value_name];
    }
    return arr;
  }

  initAddDatas() {}
}
