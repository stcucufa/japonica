import { hexToRGB, HSVtoRGB, RGBtoHex, RGBtoHSV } from "../lib/colors.js";
import { range, svg } from "../lib/util.js";

const cos = a => Math.cos(Math.PI * a / 180);
const sin = a => Math.sin(Math.PI * a / 180);

const PalettesURL = "https://unpkg.com/nice-color-palettes@3.0.0/500.json";
const root = document.querySelector("svg");

const hexagon = (r, properties = {}) => svg("path", {
    d: `M${r},0${range(60, 300, 60).map(a => `L${r * cos(a)},${r * sin(a)}`).join("")}z`,
    ...properties
});

root.appendChild(hexagon(100, {
    fill: "none",
    stroke: "#222",
    "stroke-width": 0.5
}));

for (let a = 0; a < 360; a += 60) {
    const x = 100 * cos(a);
    const y = 100 * sin(a);
    root.appendChild(svg("line", {
        x2: x,
        y2: y,
        stroke: "#222",
        "stroke-width": 0.5
    }));
    root.appendChild(hexagon(4, {
        transform: `translate(${x}, ${y})`,
        fill: RGBtoHex(HSVtoRGB([a, 1, 1]))
    }));
}


(async function() {
    const palettes = await fetch(PalettesURL).then(response => response.json());
    const colors = new Set(palettes.flat().map(c => [c, RGBtoHSV(hexToRGB(c))]));

    for (const [hex, hsv] of colors.values()) {
        const h = hsv[0];
        const s = hsv[1];
        const v = hsv[2];
        root.appendChild(svg("circle", {
            cx: 100 * v * cos(h),
            cy: 100 * v * sin(h),
            r: 5 * s,
            fill: hex
        }));
    }
})();
