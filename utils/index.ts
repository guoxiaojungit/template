
/** 获取链接参数 */
export function getUrlParam(url:string, name:string):string {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const r = url.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
}

export function enumToSelectOtp(params: object) {
    const optionsArr = [{
        key: '',
        value: '全部',
    }];
    Object.keys(params).forEach(key => {
        if (!isNaN(Number(key))) {
            optionsArr.push({
                key,
                value: params[key],
            })
        }
    })
    return optionsArr
}