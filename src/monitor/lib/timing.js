import tracker from '../utils/tracker';
import onload from '../utils/onLoad';
export function timing() {
    let FMP, LCP;
    //增加一个性能条目的观察者
   if(PerformanceObserver){
    new PerformanceObserver((entryList, observer) => {
        let perfEntries = entryList.getEntries();
        FMP = perfEntries[0]
        observer.disconnect(); //不再观察了
    }).observe({
        entryTypes: ['element']
    }); //观察页面中的意义的元素
    new PerformanceObserver((entryList, observer) => {
        let perfEntries = entryList.getEntries();
        LCP = perfEntries[0];
        observer.disconnect(); //不再观察了
    }).observe({
        entryTypes: ['largest-contentful-paint']
    }); //观察页面中的意义的元素
    new PerformanceObserver((entryList, observer) => {
        let firstInput = entryList.getEntries()[0];
        if (firstInput) {
            //processingstart开始处理的时间startTime开点击的时间差值就是处理的延迟
            let inputDelay = firstInput.processingStart - firstInput.startTime;
            let duration = firstInput.duration; //处理的耗时
            if (inputDelay > 0 || duration > 0) {
                tracker.send({
                    kind: 'experience', //用户体验指标
                    type: 'firstInputDelay', //首次输入延迟
                    inputDelay, //延时的时间
                    duration, //处理的时间
                    startTime: firstInput.startTime,
                    selector: lastEvent ? getselector(lastEvent.path || lastEvent.target) : ''
                })


            }
        }
        observer.disconnect(); //不再观察了
    }).observe({
        type: 'first-input ',
        buffered: true
    }); //观察页面中的意义的元素

   }
    onload(function () {
        setTimeout(() => {
            const {
                fetchStart,
                connectStart,
                connectEnd,
                requestStart,
                responseStart,
                responseEnd,
                domLoading,
                domInteractive,
                domContentLoadedEventStart,
                domContentLoadedEventEnd,
                loadEventStart
            } = performance.timing;//目前所有浏览器都支持，但mdn不支持。。。
            tracker.send({
                kind: 'experience', //用户体验指标
                type: 'timing', //统计每个阶段的时间
                connectTime: connectEnd - connectStart, //连接时间
                ttfbTime: responseStart - requestStart, //首字节到达时间
                responseTime: responseEnd - responseStart, //响应的读取时间
                parseDOMTime: loadEventStart - domLoading, //DOM解析的时间
                domContentLoadedTime = domContentLoadedEventEnd - domContentLoadedEventStart,
                timeToInteractive: domInteractive - fetchStart, //首次可交互时间
                loadTIme: loadEventStart - fetchStart //完整加载时间
            });
            let FP = performance.getEntriesByName('first-paint')[0];
            let FCP = performance.getEntriesByName('first-contentful-paint')[0];
            tracker.send({
                kind: 'experience', //用户体验指标
                type: 'paint', //统计每个阶段的时间
                firstPaint: FP.startTime,
                firstContentfulPaint: FCP.startTime,
                firstMeaningfulPaint: FMP.startTime,
                largestContentfulPaint: LCP.startTime
            });


        }, 3000);

    })
}
//这个好像还有点问题