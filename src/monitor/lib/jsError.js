import getLastEvent from "../utils/getLastEvent"
import getSelector from "../utils/getSelector"
import tracker from "../utils/tracker"
export function injectJsError() {
    window.addEventListener('error', (event) => {
        let lastEvent = getLastEvent()
        if (event.target && (event.target.src || event.target.href)) {
            tracker.send({
                kind: 'stability', //监控指标的大类
                type: 'error', //小类型这是一个错误
                errorType: 'resourceError ', //资源加载错误

                message: event.message, //报错信息
                filename: event.target.src || event.target.href, //哪个文件报错了
                tagname: event.target.tagName,
                position: `${event.lineno} : ${event.colno}`,
                stack: getLines(event.error.stack),
                selector: getSelector(lastEvent.event.target) //最后一个选中元素

            })
        }

        tracker.send({
            kind: 'stability', //监控指标的大类
            type: 'error', //小类型这是一个错误
            errorType: 'jsError ', //js执行错误
            message: event.message, //报错信息
            filename: event.filename, //哪个文件报错了
            position: `${event.lineno} : ${event.colno}`,
            stack: getLines(event.error.stack),
            selector: lastEvent ? getSelector(lastEvent.path) : "" //最后一个选中元素

        })
    })

    window.addEventListener('unhandledrejection', (event) => {
        console.log(event);
        let lastEvent = getLastEvent(); //最后一个交互事件let message;
        let filename;
        let line = 0;
        let column = 0;
        let stack = '';
        let reason = event.reason;
        if (typeof reason === 'string ') {
            message = reason;
        } else if (typeof reason === 'object') { //说明是一个错误对象
            //at http://localhost:8080/ :23:38
            if (reason.stack) {
                // let matchResult = reason.stack.match(/at http://localhost:8088/:23:38/)
                let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
                filename = matchResult[1];
                line = matchResult[2];
                column = matchResult[3];


            }
            message = reason.stack.message;
            stack = getLines(reason.stack);
        }
        tracker.send({
            kind: 'stability', //监控指标的大类
            type: 'error', //小类型这是一个错误
            errorType: 'promiseError ', //S执行错误

            message, //报错信息
            filename, //哪个文件报错了
            position: `${line} : ${column}`,
            stack,
            selector: lastEvent ? getSelector(lastEvent.path) : "" //最后一个选中元素

        })
    })


    function getLines(stack) {
        return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, "")).join("^")
    }
}