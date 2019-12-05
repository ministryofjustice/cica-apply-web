function createPolyfills() {
    // for legacy versions of IE.
    function forEach(array, callback, scope) {
        for (let i = 0; i < array.length; i += 1) {
            callback.call(scope, array[i], i);
        }
    }

    // old IE support.
    function addEventListener(element, eventType, handler) {
        if (window.addEventListener) {
            element.addEventListener(eventType, handler, false);
        } else if (window.attachEvent) {
            window.attachEvent(eventType, handler);
        }
    }

    function hasClass(elem, classToCheck) {
        return ` ${elem.className} `.indexOf(` ${classToCheck} `) > -1;
    }

    if (typeof Object.assign !== 'function') {
        // Must be writable: true, enumerable: false, configurable: true.
        Object.defineProperty(Object, 'assign', {
            // eslint-disable-next-line no-unused-vars
            value: function assign(target, varArgs) {
                // .length of function is 2

                if (target == null) {
                    // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                const to = Object(target);

                for (let index = 1; index < arguments.length; index += 1) {
                    // eslint-disable-next-line prefer-rest-params
                    const nextSource = arguments[index];

                    if (nextSource != null) {
                        // Skip over if undefined or null
                        // eslint-disable-next-line no-restricted-syntax
                        for (const nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        });
    }

    return Object.freeze({
        forEach,
        addEventListener,
        hasClass
    });
}

// eslint-disable-next-line import/prefer-default-export
export {createPolyfills};
