function moduleConfig() {

  const env = process.env.NODE_ENV === "development" ? "dev" : "prod";

  const url = {
    dev: `/api`,
    prod: "https://huangjingsheng.com/api"
  }

  return {
    /** 请求超时毫秒 */
    get requestOvertime() {
      return 8000;
    },
    /** `api`请求域名 */
    get apiUrl() {
      return url[env];
    },
    /** 当前环境模式 */
    get env() {
      return env;
    },
    /** 上传图片地址 */
    get uploadUrl() {
      return "http://xxx.com/upload"
    }
  }
}

/** 配置模块 */
const config = moduleConfig();

export default config;
