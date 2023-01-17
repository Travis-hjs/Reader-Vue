# 接口模块

## 正常 GET 和 POST 请求

```ts
/**
 * 通过`id`获取用户信息
 * @param id 
 */
export function getUserInfo(id: number | string) {
  return request('GET', '/getUserInfoById', { id })
}

/**
 * 普通`post`json请求
 * @param params 
 */
export function saveBannerInfo(params: { img: string, date: string, sort: number }) {
  return request('POST', '/saveBannerInfo', params)
}
```

## 表单请求

```ts
import { jsonToFormData } from '@/utils';

/**
 * `post`表单请求
 * @param params
 */
export function saveUserInfo(params: { account: string, password: string }) {
  return request('POST', '/saveUserInfo', jsonToFormData(params), {
    headers: {
      'codeMode': 'form'
    }
  })
}
```

## 请求获取文件流

```ts
/**
 * 响应结果类型为`blob`
 * @param params
 */
export function getBlob(params: { name: string }) {
  return request('GET', '/getXlsxBlob', params, {
    responseType: 'blob'
  })
}
```