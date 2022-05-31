export function assign(...properties) {
    return Object.assign(Object.create(this), ...properties);
}

export function create(defaults = {}) {
    return function(...properties) {
        const o = assign.call(this, defaults, ...properties);
        if (typeof o.init === "function") {
            o.init();
        }
        return o;
    }
}

// Create a Map from a collection xs by applying a function f to every x.
// f is expected to return a [key, value] pair to be added to the Map.
export function assoc(xs, f) {
    const m = new Map();
    for (let i = 0, n = xs.length; i < n; ++i) {
        m.set(...f(xs[i], i));
    }
    return m;
}

export function element(ns, tagname, ...children) {
    const appendChild = (element, child) => {
        if (typeof child === "string") {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Element) {
            element.appendChild(child);
        } else if (Array.isArray(child)) {
            for (let ch of child) {
                appendChild(element, ch);
            }
        }
    };

    const element = document.createElementNS(ns, tagname);
    if (isObject(children[0]) && !Array.isArray(children[0]) && !(children[0] instanceof Element)) {
        for (let [attribute, value] of Object.entries(children[0])) {
            element.setAttribute(attribute, value);
        }
    }
    appendChild(element, [...children]);
    return element;
}

export const html = (...args) => element("http://www.w3.org/1999/xhtml", ...args);
export const svg = (...args) => element("http://www.w3.org/2000/svg", ...args);

// Promise of a loaded image element given its URL.
export const imagePromise = url => new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load image with URL "${url}"`));
});

const AsyncFunction = Object.getPrototypeOf(async () => {});
export const isAsync = f => Object.getPrototypeOf(f) === AsyncFunction;

export const isObject = x => typeof x === "object" && x !== null;

// K combinator: K x y = x
export const K = x => y => x;

export const lerp = (x, y, p) => (1 - p) * x + p * y;

// See floored division in https://en.wikipedia.org/wiki/Modulo_operation#Variants_of_the_definition
export const mod = (a, n) => a - n * Math.floor(a / n);

export const nop = () => {};

// Create an array with all numbers between from and to, with a given step.
export function range(from, to, step = 1) {
    const range = [];
    const s = sign(step);
    if (s !== 0 && s * from <= s * to) {
        for (let i = 0; s * (from + i) <= s * to; i += step) {
            range.push(from + i);
        }
    }
    return range;
}

export const sign = x => x < 0 ? -1 : x > 0 ? 1 : 0;
