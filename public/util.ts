/** @format */

import { message } from 'antd';

interface Desc {
    value?: Function;
    configurable?: boolean;
    enumerable?: boolean;
}
const { defineProperty, getPrototypeOf } = Object;
// tslint:disable-next-line: typedef
function createDefaultSetter(key) {
    // tslint:disable-next-line: typedef
    return function set(newValue) {
        // tslint:disable-next-line: no-invalid-this
        Object.defineProperty(this, key, {
            configurable: true,
            writable: true,
            enumerable: true,
            value: newValue,
        });
        return newValue;
    };
}

// tslint:disable-next-line: typedef
function bind(fn, context) {
    if (fn.bind) {
        return fn.bind(context);
    } else {
        return function __autobind__() {
            return fn.apply(context, arguments);
        };
    }
}

export function getUrlParam(search:string, name:string) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const r = search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
}

export function getUrlParams(url: string) {
    const queryIndex = url.indexOf('?');
    const tempStr = url.substr(queryIndex + 1);
    const paramObj = {};
    tempStr.split('&').forEach(item => {
        let key = item.split('=')[0];
        let val = item.split('=')[1];
        paramObj[key] = val;
    });
    return paramObj;
}

export function trim(str: string) {
    return str.replace(/\s+/g, '');
}

/**
 * 小数位四舍五入
 * @param val 传入的值
 * @param n 精度
 */
export function toFixed(val: number, n: number) {
    const numA = 20;
    const numB = 21;
    if (n > numA || n < 0) {
        throw new RangeError('toFixed() digits argument must be between 0 and 20');
    }
    if (isNaN(val) || val >= Math.pow(10, numB)) {
        return val.toString();
    }
    if (typeof n === 'undefined' || n === 0) {
        return Math.round(val).toString();
    }

    let result = val.toString();
    const arr = result.split('.');

    // 整数的情况
    if (arr.length < 2) {
        result += '.';
        for (let i = 0; i < n; i += 1) {
            result += '0';
        }
        return result;
    }

    const integer = arr[0];
    const decimal = arr[1];
    if (decimal.length === n) {
        return result;
    }
    if (decimal.length < n) {
        for (let i = 0; i < n - decimal.length; i += 1) {
            result += '0';
        }
        return result;
    }
    result = integer + '.' + decimal.substr(0, n);
    const last = decimal.substr(n, 1);

    // 四舍五入，转换为整数再处理，避免浮点数精度的损失
    if (parseInt(last, 10) >= 5) {
        const x = Math.pow(10, n);
        result = ((Math.round(parseFloat(result) * x) + 1) / x).toFixed(n);
    }

    return result;
}

/**
 * 计算字符的字节长度
 * @param str 要计算字节长度的字符串
 * @returns number 返回字符串的字节长度
 */
export function countWordCharNum(str: string): number {
    let pureValuesLength = 0;
    /** 某些特殊字符在QP上是双字节 */
    let specialNum = 183;
    let totalNum = 255;
    let icodeA = 0xFF61;
    let icodeB = 0xFF9F;
    const specialCode = [specialNum];
    for (let i = 0; i < str.length; i++) {
        let iCode = str.charCodeAt(i);
        if (specialCode.includes(iCode)) {
            pureValuesLength += 2;
        } else if ((iCode >= 0 && iCode <= totalNum) || (iCode >= icodeA && iCode <= icodeB)) {
            pureValuesLength += 1;
        } else {
            pureValuesLength += 2;
        }
    }
    return pureValuesLength;
}

export function subStringByLimitByte(str: string, limitByte: number | string):string {
    if (!limitByte) return str
    let resStr = ''
    let pureValuesLength = 0;
    let specialNum = 183;
    let totalNum = 255;
    let icodeA = 0xFF61;
    let icodeB = 0xFF9F;
    /** 某些特殊字符在QP上是双字节  */
    const specialCode = [specialNum];
    for (let i = 0; i < str.length; i++) {
      let iCode = str.charCodeAt(i);
      if (specialCode.includes(iCode)) {
        pureValuesLength += 2;
      } else if ((iCode >= 0 && iCode <= totalNum) || (iCode >= icodeA && iCode <= icodeB)) {
        pureValuesLength += 1;
      } else {
        pureValuesLength += 2;
      }
      if (pureValuesLength <= Number(limitByte)) {
        resStr += str[i];
      }
    }
    return resStr
  }

/**
 * 取出css module中指定样式名称的值
 * @param styleFile 样式文件
 * @param styleName 样式名称
 */
export function computeStyle(styleFile: object | object[], styleName: string | Array<string>) {
    let styleTxt = '';
    let tempStyleFile = {};
    function compute(name: string) {
        if (tempStyleFile[name]) {
            return tempStyleFile[name];
        } else {
            return '';
        }
    }

    if (Array.isArray(styleFile)) {
        styleFile.forEach(style => {
            tempStyleFile = { ...tempStyleFile, ...style };
        });
    } else {
        tempStyleFile = styleFile;
    }

    if (Array.isArray(styleName)) {
        styleTxt = styleName
            .map(name => {
                return compute(name);
            })
            .join(' ');
    } else {
        styleTxt = compute(styleName);
    }
    return styleTxt;
}

interface IFormFields {
    [a: string]: {
        value: unknown;
    };
}

/**
 * 把store里的值转换成form里mapPropsToFields的结构
 * @param storeData 需要转换的store对象
 * @param isTransformAll 是否全部转换
 * @param transformMap 转换时需要对key时行映射的map，当isTransformAll为false时，此项必填。（根据这个map来指定需要转换哪些字段）
 */
// tslint:disable-next-line: typedef
export function transformStoreToForm(storeData: object, isTransformAll: boolean = true, transformMap?): IFormFields {
    const tempObj = {};
    let tempKeyArr = Object.keys(storeData);
    if (!isTransformAll) {
        if (!transformMap) {
            console.error('当isTransformAll为false时，transformMap不能为空！');
        } else {
            tempKeyArr = Object.keys(transformMap);
        }
    }
    tempKeyArr.forEach(key => {
        const val = storeData[key];
        let tempKey = key;
        if (transformMap && transformMap[key]) {
            tempKey = transformMap[key];
        }
        tempObj[tempKey] = {
            value: val,
        };
    });
    return tempObj;
}

// tslint:disable-next-line: typedef
export function transformObject(formData: object, isTransformAll: boolean = true, transformMap?): object {
    const tempObj = {};
    let tempKeyArr = Object.keys(formData);
    if (!isTransformAll) {
        if (!transformMap) {
            console.error('当isTransformAll为false时，transformMap不能为空！');
        } else {
            tempKeyArr = Object.keys(transformMap);
        }
    }
    tempKeyArr.forEach(key => {
        const val = formData[key];
        let tempKey = key;
        if (transformMap && transformMap[key]) {
            tempKey = transformMap[key];
        }
        tempObj[key] = val;
    });
    return tempObj;
}
