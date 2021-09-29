import tracker from '../ utils/tracker';
export default function injectXHR() {
    let XMLHttpRequest = window.XMLHttpRequest;
    let oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async) {
        //除去sock是为了防止开发时的bug
        if (!url.match(/logstores/)&&!url.match(/sockjs/)) {
            this.logData = {
                method,
                url,
                async
            };
        }


        return oldOpen.apply(this, arguments);
    }
    let oldSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        if (this.logData) {
            let startTime = Date.now(); //在发送之前记录一下开始的时间let handler = (type) => (event) ->{
            let duration = Date.now() - startTime;
            let status = this.statusText;
            let statusText = this.statusText; // oK Servel
            tracker.send({
                kind: "stability",
                type: 'xhr',
                eventType: event.type, //load error
                abortpathname: this.logData.url, //请求路径
                status: status + '-' + statusText, //状态码
                duration, //持续时间
                response: this.response ? JSON.stringify(this.response) : "", //响应体
                params: body || ''
            });

            this.addEventListener('load', handler('load'), false);
            this.addEventListener('error', handler('error'), false);
            this.addEventListener('abort', handler('abort'), false);
        }
        return oldSend.apply(this, arguments);
    }
}