// import { ComponentInternalInstance } from "vue";

// /**
//  * `vue3`类型扩充
//  * - 弥补官方的类型不足问题
//  */
// export declare namespace Vue3 {
//   /**
//    * `vue`实例上下文
//    * - `vue3`类型文件中貌似没有暴露可以使用的类型，所以自定义补充一个接口代替，和`vue2`中一样的类型一致
//    */
//   interface Ctx {
//     /** 当前组件节点 */
//     readonly $el: HTMLElement
//     /** 父节点 */
//     readonly $parent?: Ctx
//     /** 当前组件实例 */
//     readonly $root: Ctx
//     /** 选项配置 */
//     readonly $options: {
//       name: string
//     }
//   }
//   /**
//    * `hooks: getCurrentInstance()`钩子函数返回的类型扩充
//    */
//   interface Instance extends ComponentInternalInstance {
//     /** 实例上下文对象 */
//     ctx: Ctx
//   }
// }

/** 上传图片返回结果 */
export interface UploadChange {
  /** 和当前上传组件绑定的`id` */
  id: string | number
  /** 图片路径 */
  src: string
}

/** 表单规则类型 */
export interface TheFormRulesItem {
  /** 是否必填项 */
  required?: boolean
  /** 提示字段 */
  message?: string
  /** 指定类型 */
  type?: "number" | "array"
  /**
   * 自定义的校验规则（正则）
   * - 考虑到微信一些特殊的抽风机制，在微信小程序中，除`number|string|object|undefined|null`这几个基础类型外，其他类型是会被过滤掉，所以这里在写正则的时候，在末尾加上`.toString()`即可
   */
  reg?: string // | RegExp
}

/** 表单规则类型 */
export type TheFormRules = { [key: string]: Array<TheFormRulesItem> };

/** `label`布局位置 */
export type LabelPosition = "left" | "right" | "top";

/** 表单验证回调类型 */
export interface TheFormValidateCallback {
  (
    /** 是否验证通过 */
    isValid: boolean,
    /** 验证不通过的规则列表 */
    rules: { [key: string]: Array<TheFormRulesItem> }
  ): void
}

/** 选择器`item`数据 */
export interface PickerSelectItem<T = string | number> {
  /** 展示字段 */
  label: string
  /** 对应的值 */
  value: T
  /**
   * 下级数据
   * @description 最多三层，选择器栏目数根据当前下级动态显示
   */
  children?: Array<PickerSelectItem<T>>
  /** 其他携带的值 */
  [key: string]: any
}
