function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        // eslint-disable-next-line prefer-rest-params
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}

// eslint-disable-next-line import/prefer-default-export
export {debounce};
