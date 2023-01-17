/** 用户信息类型 */
export interface UserInfo {
  /** 登录凭据 */
  token: string
  /** 用户手机号 */
  phone: number | "",
  /** 用户`id` */
  id: number | ""
}
