// From Véra Molnar, Une rétrospective 1942/2012, Bernard Chauveau Éditeur, p. 76

import { svg } from "../lib/util.js";
import { RNG } from "../lib/random.js";

const seed = parseInt(new URLSearchParams(window.location.search).get("seed"));
const rng = RNG.create(seed);
console.info(`Seed: ${rng.state}`);

const root = document.querySelector("svg");
const g = root.querySelector("g");
const randomMod = n => rng.randomInt(- n + 1, n - 1);
const cos = a => Math.cos(a * Math.PI / 180);
const sin = a => Math.sin(a * Math.PI / 180);

let xmin = 0;
let xmax = 0;
let ymin = 0;
let ymax = 0;

function W(x, y) {
    let d = `M${x},${y}`;

    const L = m => {
        x += Math.round(m * cos(heading));
        y += Math.round(m * sin(heading));
        xmin = Math.min(xmin, x);
        xmax = Math.max(xmax, x);
        ymin = Math.min(ymin, y);
        ymax = Math.max(ymax, y);
        return `L${x},${y}`;
    };

    // 8-9
    let heading = 125 + randomMod(70);
    d += L(100 + randomMod(42));

    // 10-11
    heading += -165 + randomMod(5);
    d += L(80 + randomMod(42));

    // 12-13
    heading += 165 + randomMod(5);
    d += L(80 + randomMod(42));

    // 14-15
    heading += -165 + randomMod(5);
    d += L(180 + randomMod(42));

    g.appendChild(svg("path", {
        "stroke-width": 2 + randomMod(2),
        d
    }));

    return [x, y];
}

let x = 0;
let y = 0;
for (let i = 0; i < 17; ++i) {
    [x, y] = W(x, y);
}

const m = 40 + randomMod(20);
const w = xmax - xmin + 2 * m;
const h = ymax - ymin + 2 * m;
root.setAttribute("viewBox", `${xmin - m} ${ymin - m} ${w} ${h}`);
root.style.height = `${100 * h / w}vw`
