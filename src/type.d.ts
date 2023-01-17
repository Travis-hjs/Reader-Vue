// 全局声明文件，局部声明文件不要写在这里

/** 深层递归所有属性为可选 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}

/** 深层递归所有属性为只读 */
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
}

/** 深层递归所有属性为必选选（貌似不生效） */
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? Required<T[P]> : T[P];
}

/** 运算符号 */
type NumberSymbols = "+" | "-" | "*" | "/";

/**
 * `JavaScript`类型
 * - 这里只枚举一些常见类型，后续根据使用场景自行添加即可
 */
type JavaScriptTypes = "string" | "number" | "array" | "object" | "boolean" | "function" | "null" | "undefined" | "regexp" | "promise" | "formdata";

/** 基础对象 */
interface BaseObj<T = string | number> {
  [key: string]: T
}

/** 接口请求基础响应数据 */
interface ApiResult<T = any> {
  /** 接口状态`code === 1`为成功 */
  code: number
  /** 接口响应数据 */
  data: T
  /** 接口响应信息 */
  msg: string
}

/** 接口请求列表响应数据 */
interface ApiResultList<T = any> extends PageInfo {
  /** 列表数据 */
  list: Array<T>
}

/** 请求配置 */
interface RequestOptions {
  /**
   * 请求头配置（header 中不能设置 Referer。），会覆盖默认设置
   * - 需要表单形式就`headers: { "codeMode": "form" }`;
   * - 其他头部设置自行定义
   */
  headers: BaseObj<string> & {
    codeMode?: "json" | "form"
  },
  /** 请求数据类型 */
  dataType: "json" | "text" | ""
  /** 接口数据响应类型 */
  responseType: "json" | "arraybuffer" | "blob" | "stream" | "document" | "text"
  /** 是否在`res.code !== 1`的时候显示提示，默认`false`，传入`true`则用`res.msg`作为提示，也可以传入字符串作为提示内容 */
  showTip: string | boolean
}

/** 页码信息 */
interface PageInfo {
  /** 一页多少条 */
  pageSize: number
  /** 当前页，从`1`开始 */
  currentPage: number
  /** 总数 */
  total?: number
}

/** `uni-app`change事件参数 */
interface UniAppChangeEvent<T> {
  detail: {
    /** `@change`事件触发的值 */
    value: T
  }
}

interface Window {
  /**
   * 当前版本，方便在控制台查看调试用
   * @description 引用的是`package.json`中的`version`
   */
  version: string
}

/** .nvue文件专用模块 */
declare const weex: any;
