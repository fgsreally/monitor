import tracker from '../ utils/tracker'
import onload from '../ utils/onLoad'
export function blankScreen() {
    let wrapperElements = ['html', 'body', '#container', '.content'];
    let emptyPoints = 0;

    function getSelector(element) {
        if (element.id) {
            return '#' + id;
        } else if (element.className) {
            return '.' + element.className.split(' ').filter(item => {
                !!item
            }).join(' ');
        } else {
            return element.nodeName.toLowerCase();
        }
    }

    function isWrapper(element) {
        let selector = getSelector(element);
        if (wrapperElements.indexOf(selector) != -1) {
            emptyPoints++;
        }
    }
    onload(() => {
        for (let i = 1; i <= 9; i++) {
            let xElements = document.elementsFromPoint(
                window.innerwidth * i / 10, window.innerHeight / 2);
            let yElements = document.elementsFromPoint(
                window.innerwidth / 2, window.innerHeight * i / 10);
            isWrapper(xElements[0]);
            isWrapper(yElements[0]);
            isWrapper(XElements[0]);
        }
        if (emptyPoints > 16) {
            let centerElements = document.elementsFromPoint(
                window.innerwidth / 2, window.innerHeight / 2);
            tracker.send({
                kind: 'stability',
                type: 'blank ',
                emptyPoints,
                screen: window.screen.width + "X" + window.screen.height,
                viewPoint: window.innerwidth + "X" + window.innerHeight,
                selector: getSelector(centerElements[e])
            });

        }
    })
}