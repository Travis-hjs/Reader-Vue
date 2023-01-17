/**
 * 检测类型
 * @param target 检测的目标
 */
export function checkType(target: any) {
  const value: string = Object.prototype.toString.call(target);
  const result = (value.match(/\[object (\S*)\]/) as RegExpMatchArray)[1];
  return result.toLocaleLowerCase() as JavaScriptTypes;
}

/**
 * 修改属性值-只修改之前存在的值
 * @param target 修改的目标
 * @param value 修改的内容
 */
export function modifyData<T>(target: T, value: T) {
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      // target[key] = value[key];
      // 需要的话，深层逐个赋值
      if (checkType(target[key]) === "object") {
        modifyData(target[key], value[key]);
      } else {
        target[key] = value[key];
      }
    }
  }
}

/**
 * 设置属性值-之前不存在的值也根据传入的`value`值去设置
 * @param target 设置的目标
 * @param value 设置的内容
 */
export function setData<T>(target: T, value: T) {
  for (const key in value) {
    target[key] = value[key];
  }
}

/**
 * 格式化日期
 * @param value 指定日期
 * @param format 格式化的规则
 * @example
 * ```js
 * formatDate();
 * formatDate(1603264465956);
 * formatDate(1603264465956, "h:m:s");
 * formatDate(1603264465956, "Y年M月D日");
 * ```
 */
export function formatDate(value: string | number | Date = Date.now(), format = "Y-M-D h:m:s") {
  if (["null", null, "undefined", undefined, ""].includes(value as any)) return "";
  // ios 和 mac 系统中，带横杆的字符串日期是格式不了的，这里做一下判断处理
  if (typeof value === "string" && new Date(value).toString() === "Invalid Date") {
    value = value.replace(/-/g, "/");
  }
  const formatNumber = (n: number) => `0${n}`.slice(-2);
  const date = new Date(value);
  const formatList = ["Y", "M", "D", "h", "m", "s"];
  const resultList = [];
  resultList.push(date.getFullYear().toString());
  resultList.push(formatNumber(date.getMonth() + 1));
  resultList.push(formatNumber(date.getDate()));
  resultList.push(formatNumber(date.getHours()));
  resultList.push(formatNumber(date.getMinutes()));
  resultList.push(formatNumber(date.getSeconds()));
  for (let i = 0; i < resultList.length; i++) {
    format = format.replace(formatList[i], resultList[i]);
  }
  return format;
}

/**
 * 数字运算（主要用于小数点精度问题）
 * [see](https://juejin.im/post/6844904066418491406#heading-12)
 * @param a 前面的值
 * @param type 计算方式
 * @param b 后面的值
 * @example 
 * ```js
 * // 可链式调用
 * const res = computeNumber(1.3, "-", 1.2).next("+", 1.5).next("*", 2.3).next("/", 0.2).result;
 * console.log(res);
 * ```
 */
export function computeNumber(a: number, type: NumberSymbols, b: number) {
  /**
   * 获取数字小数点的长度
   * @param n 数字
   */
  function getDecimalLength(n: number) {
    const decimal = n.toString().split(".")[1];
    return decimal ? decimal.length : 0;
  }
  /**
   * 修正小数点
   * @description 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的处理
   * @param n 数字
   */
  const amend = (n: number, precision = 15) => parseFloat(Number(n).toPrecision(precision));
  const power = Math.pow(10, Math.max(getDecimalLength(a), getDecimalLength(b)));
  let result = 0;

  a = amend(a * power);
  b = amend(b * power);

  switch (type) {
    case "+":
      result = (a + b) / power;
      break;
    case "-":
      result = (a - b) / power;
      break;
    case "*":
      result = (a * b) / (power * power);
      break;
    case "/":
      result = a / b;
      break;
  }

  result = amend(result);

  return {
    /** 计算结果 */
    result,
    /**
     * 继续计算
     * @param nextType 继续计算方式
     * @param nextValue 继续计算的值
     */
    next(nextType: NumberSymbols, nextValue: number) {
      return computeNumber(result, nextType, nextValue);
    },
    /** 
     * 小数点进位 
     * @param n 小数点后的位数
     */
    toHex(n: number) {
      const strings = result.toString().split(".");
      if (n > 0 && strings[1] && strings[1].length > n) {
        const decimal = strings[1].slice(0, n);
        const value = Number(`${strings[0]}.${decimal}`);
        const difference = 1 / Math.pow(10, decimal.length);
        result = computeNumber(value, "+", difference).result;
      }
      return result;
    }
  };
}

/**
 * 获取`url?`后面参数（JSON对象）
 * @param name 获取指定参数名
 * @param target 目标字段，默认`location.search`
 * @example 
 * ```js
 * // 当前网址为 www.https://hjs.com?id=99&age=123&key=sdasfdfr
 * const targetAge = getQueryParam("age", "id=12&age=14&name=hjs");
 * const params = getQueryParam();
 * const age = getQueryParam("age");
 * // 非IE浏览器下简便方法
 * new URLSearchParams(location.search).get("age");
 * ```
 */
export function getQueryParam(name?: string, target?: string) {
  const code = target || location.href.split("?")[1] || "";
  const list = code.split("&");
  const params: any = {};
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const items = item.split("=");
    if (items.length > 1) {
      params[items[0]] = item.replace(`${items[0]}=`, "");
    }
  }
  if (name) {
    return params[name] || "";
  } else {
    return params;
  }
}

/**
 * 获取一些深层`key`的对象值
 * @param target 目标对象
 * @param key `key`字段
 * @example 
 * ```js
 * const info = {
 *   list: [
 *     { value: "hjs" }
 *   ]
 * }
 * getDeepLevelValue(info, "list.0.value"); // => "hjs"
 * ```
 */
export function getDeepLevelValue(target: any, key: string) {
  const keys = key.split(".");
  let result;
  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];
    result = target[prop];
    const type = checkType(result);
    if (type !== "object" && type !== "array") {
      break;
    } else {
      target = target[prop];
    }
  }
  return result;
}

/**
 * ES5 兼容 ES6 `Array.findIndex`
 * @param array 
 * @param compare 对比函数
 */
export function findIndex<T>(array: Array<T>, compare: (value: T, index: number) => boolean) {
  var result = -1;
  for (var i = 0; i < array.length; i++) {
    if (compare(array[i], i)) {
      result = i;
      break;
    }
  }
  return result;
}

/**
 * 范围随机整数
 * @param min 最小数
 * @param max 最大数
 */
export function ranInt(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * 随机生成中文
 * @param min 最小数
 * @param max 最大数
 */
export function randomText(min: number, max: number) {
  const len = Math.floor(Math.random() * max) + min;
  const base = 20000;
  const range = 1000;
  let str = "";
  let i = 0;
  while (i < len) {
    i++;
    const lower = Math.floor(Math.random() * range);
    str += String.fromCharCode(base + lower);
  }
  return str;
}

// /**
//  * 获取`/static/`目录下的图片路径
//  * @param name 图片或文件路径名，需要带后缀
//  * @returns 
//  */
// export function getIamgeByName(name: string) {
//   console.log(name, import.meta.url);
//   return new URL(`../static/${name}`, import.meta.url).href;
// }
