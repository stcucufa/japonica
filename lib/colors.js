import { lerp, mod } from "./util.js";

export function hexToRGB(color) {
    const m = color.match(/^#(..)(..)(..)$/);
    return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

export const RGBtoHex = color => `#${color.map(c => c.toString(16).padStart(2, "0")).join("")}`;

export const mixRGB = (c1, c2, p = 0.5) => [
    Math.round(lerp(c1[0], c2[0], p)),
    Math.round(lerp(c1[1], c2[1], p)),
    Math.round(lerp(c1[2], c2[2], p))
];

// Cf. https://en.wikipedia.org/wiki/HSL_and_HSV

export function RGBtoHSV([r, g, b]) {
    const v = Math.max(r, g, b);
    const m = Math.min(r, g, b);
    const c = v - m;
    const h = 60 * (
        c === 0 ? 0 :
        v === r ? mod(((g - b) / c), 6) :
        v === g ? (b - r) / c + 2 :
            (r - g) / c + 4
    );
    const s = v === 0 ? 0 : c / v;
    return [h, s, v / 255];
}

export function HSVtoRGB([h, s, v]) {
    const c = v * s;
    const hh = h / 60;
    const x = c * (1 - Math.abs(hh % 2 - 1));
    const rgb =
        hh < 1 ? [c, x, 0] :
        hh < 2 ? [x, c, 0] :
        hh < 3 ? [0, c, x] :
        hh < 4 ? [0, x, x] :
        hh < 5 ? [x, 0, c] :
            [c, 0, x];
    const m = v - c;
    return rgb.map(k => Math.round((k + m) * 255));
}
