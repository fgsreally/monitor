const userAgent = require('user-agent')

function getExtraData() {
    return {
        title: document.title,
        url: location.url,
        timestamp: Date.now(),
        userAgent: userAgent(userAgent.parse(navigator.userAgent)), //用户ID
    }
}


class SendTracker {
    constructor() {
        this.url = ''
        this.xhr = new XMLHttpRequest
    }
    send(data = {}) {
        let extraData = getExtraData();
        let log = {
            ...extraData,
            ...data
        };
        for (let key in log) {
            if (typeof log[key] === 'number') {
                log[key] = `${log[key]}`;
            }
        }

        this.xhr.open('POST', this.url, true);
        let body = JSON.stringify({
            __logs__: [log]
        });
        this.xhr.setRequestHeader('x-log-apiversion', '0.6.0');
        this.xhr.setRequestHeader('x-log-apiversion', '0.6.0'); //版本号
        this.xhr.setRequestHeader('x-log-bodyrawsize', body.length); //请求体的大小
        this.xhr.onload = function () {
            console.log(this.xhr.response);
        }
        this.xhr.onerror = function () {
            console.log(error);
        }
        this.xhr.send(body);

    }
}

export default new SendTracker()