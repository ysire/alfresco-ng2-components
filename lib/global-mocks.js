const mock = () => {
    let storage = {};
    return {
        getItem: key => key in storage ? storage[key] : null,
        setItem: (key, value) => storage[key] = value || '',
        removeItem: key => delete storage[key],
        clear: () => storage = {},
};
};

Object.defineProperty(window, 'localStorage', {value: mock()});
Object.defineProperty(window, 'sessionStorage', {value: mock()});
Object.defineProperty(document, 'doctype', {
    value: '<!DOCTYPE html>'
});
Object.defineProperty(window, 'getComputedStyle', {
    value: () => {
    return {
        display: 'none',
        appearance: ['-webkit-appearance']
    };
}
});

[HTMLElement, HTMLTableCellElement, HTMLTableRowElement].forEach(nodeType =>
Object.defineProperty(nodeType.prototype, 'innerText', {
    get: function() {
        return [... this.childNodes]
    .map(node => {
            if (node.nodeType === node.TEXT_NODE) {
            return node.textContent.trim();
        } else if (node.innerText) {
            return node.innerText;
        } else {
            return '';
        }
    })
    .filter(content => content !== '')
    .join(' ')
            .split('\n')
            .map(line => line.trim())
    .join('');
    }
})
);

const getPrototypeOf = Object.getPrototypeOf;
Object.getPrototypeOf = function(obj) {
    if (!obj) {
        return null;
    }

    return getPrototypeOf.apply(Object, [obj]);
};

Object.defineProperty(document.body.style, 'transform', {
    value: () => {
    return {
        enumerable: true,
        configurable: true
    };
},
});

Object.defineProperty(window, "matchMedia", {
    value: jest.fn(() => { return { matches: true } })
});

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
