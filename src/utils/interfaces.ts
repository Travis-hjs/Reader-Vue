/** 深层递归所有属性为可选 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
}

/** 深层递归所有属性为只读 */
export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
}

/** 深层递归所有属性为必选选（貌似不生效） */
export type DeepRequired<T> = {
    [P in keyof T]-?: T[P] extends object ? Required<T[P]> : T[P]
}

/** 运算符号 */
export type NumberSymbols = "+" | "-"| "*" | "/";

/** JavaScript类型 */
export type JavaScriptTypes = "string" | "number" | "array" | "object" | "function" | "null" | "undefined";

export interface ShowConfirmOptions {
    /** 内容 */
    content: string 
    /** 标题 */
    title?: string
    /** 确认回调 */
    callback?(): void
    /** 取消回调 */
    cancel?(): void 
    /** 确认按钮文字 */
    text?: string
}

export interface RequestParams {
    /** 请求方法 */
    method: "GET"|"POST"|"DELETE"|"PUT"
    /** 接口路径 */
    path: string
    /** 传参对象 */
    data: any
    /** 设置请求的 header，header 中不能设置 Referer。 */
    headers: { [key: string]: string },
    /** 请求成功回调 */
    success?(res: ApiResult): void
    /** 请求失败回调 */
    fail?(res: ApiResult): void
}

/** 上传图片返回结果 */
export interface UploadImageRes {
    /** 和当前上传组件绑定的`id` */
    id: string | number
    /** 图片路径 */
    src: string
}

export interface UserInfoType {
    /** 登录凭据 */
    token: string
    /** 用户手机号 */
    phone: number | "",
    /** 用户`id` */
    id: number | ""
}

/** 接口请求基础响应数据 */
export interface ApiResult {
    /** 接口状态（1为成功） */
    code: number
    /** 接口响应数据 */
    data: any
    /** 接口响应信息 */
    msg: string
}

/** 接口请求列表响应数据 */
export interface ApiListData extends ApiResult {
    data: {
        /** 当前页码 */
        pageIndex: number
        /** 每页条数 */
        pageSize: number
        /** 列表数据 */
        list: Array<any>
    }
}

/** 列表基础请求字段 */
export interface ListParams {
    /** 当前页码 */
    pageIndex: number
    /** 每页条数 */
    pageSize: number
    /** 其他索引签名 */
    [key: string]: any
}

export interface LoadMoreType extends ListParams {
    /** 加载状态 */ 
    state: "wait" | "loading" | "nomore"
    /** 加载的列表数据 */
    list: Array<any>
    /**
     * 请求成功次数
     * @description 成功时才会累加，`requestCount === 1` 时为首次获取数据 
    */
    requestCount: number
}