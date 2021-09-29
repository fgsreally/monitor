export default function (callback) {
    if (document.readystate === 'complete') {
        callback();
    } else {
        window.addEventListener('load ', callback)
    }
}