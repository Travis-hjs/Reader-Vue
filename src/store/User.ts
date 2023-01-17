import { reactive } from "vue";
import { modifyData } from "@/utils";
import { UserInfo } from "@/types/user";

const cacheName = "user-info";

function useUserInfo(): UserInfo {
  return {
    id: "",
    token: "",
    phone: ""
  }
}

/**
 * 用户状态管理模块
 */
export default class ModuleUser {
  constructor() {
    this.init();
  }

  /** 初始化用户数据（从本地获取） */
  private init() {
    const data = uni.getStorageSync(cacheName);
    if (data) {
      this.update(JSON.parse(data));
    }
  }

  /** 用户信息 */
  readonly info = reactive<DeepReadonly<UserInfo>>(useUserInfo());

  /**
   * 更新用户信息字段
   * @param value 修改的值
   */
  update(value: Partial<UserInfo>) {
    modifyData(this.info, value);
    uni.setStorageSync(cacheName, JSON.stringify(this.info));
  }

  /** 重置用户信息 */
  reset() {
    modifyData(this.info, useUserInfo());
    uni.setStorageSync(cacheName, JSON.stringify(this.info));
  }

}
