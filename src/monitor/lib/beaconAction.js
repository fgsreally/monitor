//如果是uvpv之类对信息量没要求的，可以采用这个方法
export const beaconAction = (apiUrl, params) => {
    /** 如果参数不是字符串则转换为query-string  */
    let _params = typeof params === 'string' ? params :String(params);
    /** 创建Image对象来发送请求  */
    let img = new Image(1, 1)
    let src = `${apiUrl}?${_params}`
    img.src = src
    return new Promise((resolve, reject) => {
        img.onload = function () {
            resolve({
                code: 200,
                data: 'success!'
            })
        }
        img.onerror = function (e) {
            reject(new Error(e.error))
        }
    })
}