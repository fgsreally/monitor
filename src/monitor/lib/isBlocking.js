import tracker from '../ utils/tracker';
import getLastEvent from "../utils/getLastEvent"


// var count = 0
// for (var i = 0; i < fpsList.length; i++) {
//     if (fpsList[i] && fpsList[i] < below) {
//         count++;
//     } else {
//         count = 0
//     }
//     if (count >= last) {
//         return true
//     }
// }
// return false
let lastEvent = getLastEvent()
let count = 0

function fpsCondition(fps, below, last) {
    if (fps < below && count > last) {
        tracker.send({
            kind: 'stability', //监控指标的大类
            type: 'error', //小类型这是一个错误
            errorType: 'blocking', //js执行错误
            message: 'blocking', //报错信息
            pageUrl: window.location.pathname, //哪个文件报错了
            selector: lastEvent ? getSelector(lastEvent.path) : "" //最后一个选中元素
        })
    } else {
        if (fps < below) {
            count++
        } else {
            count > below
        }
    }
}
export function isBlocking(fpsTiming = 'm', below = 20, last = 3) {
    let lastTime = performance.now();
    let frame = 0;
    let lastFameTime = performance.now();
    let loop = function (time) {
        let now = performance.now();
        frame++;
        if (fpsTiming === 's') {
            let fs = (now - lastFameTime);
            lastFameTime = now;
            let fps = Math.round(1000 / fs);
            fpsCondition(fps, below, last)
        }
        // 我不太懂为啥要加下面这一段，以及frame是什么意思？好了知道了，我tm是个弱智
        if (now > 1000 + lastTime && fpsTiming === 'm') {
            let fps = Math.round((frame * 1000) / (now - lastTime));
            frame = 0;
            lastTime = now;
            fpsCondition(fps, below, last)
        };
        window.requestAnimationFrame(loop);
    }
    loop()

}