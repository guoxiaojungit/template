import { HttpConfigTest } from './http.test.config';
import { HttpConfigBeta } from './http.beta.config';
import { HttpConfigDev } from './http.dev.config';
import { HttpConfigPreBeta } from './http.dist.config';
import { getCookie } from '../../common/utils/cookie';
function getConfig() {
    if (process.env.environment === 'dist') {
        return HttpConfigPreBeta; // 预发布环境 执行指令yarn build:dist
    }
    else if (process.env.environment === 'production') {
        return HttpConfigBeta; // 生产环境 执行指令yarn build:prod
    }
    else if (process.env.environment === 'test') {
        return HttpConfigTest; // 测试环境 执行指令yarn build:test
    }
    else {
        return HttpConfigDev;// 开发环境 执行指令yarn dev
    }
}

export const HttpConfig = getConfig();
export const DevToken = process.env.environment !== 'dev' ? getCookie() : 'DMS_JSESSIONID=NTk0NThiODYtMGFjZS00MDBkLWI2ZmItMmEwNzhjMDU3NDJi;';
export const setHeaders = (url: string, option?: Object, cookie?: string) => {
    let cookies = cookie ? cookie : 'DMS_JSESSIONID=NTk0NThiODYtMGFjZS00MDBkLWI2ZmItMmEwNzhjMDU3NDJi';
    if (process.env.environment !== 'dev') {
        /* cookie 存储UCTOKEN为大写  需置换为小写(3pl接口使用) */
        cookies = (getCookie() || '').replace('UCTOKEN=', 'uctoken=')
    }
    let options = {
        'api-target': url,
        'api-cookie': cookies,
    }
    return option ? { ...options, ...option } : options
}
