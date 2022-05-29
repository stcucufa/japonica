// Inspired by https://frontend.horse/articles/generative-grids/

import { K, lerp, range, svg } from "../lib/util.js";
import { RNG, Urn } from "../lib/random.js";

function hexToRGB(color) {
    const m = color.match(/^#(..)(..)(..)$/);
    return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

const RGBtoHex = color => `#${color.map(c => c.toString(16).padStart(2, "0")).join("")}`;

const mixRGB = (c1, c2, p = 0.5) => [
    Math.round(lerp(c1[0], c2[0], p)),
    Math.round(lerp(c1[1], c2[1], p)),
    Math.round(lerp(c1[2], c2[2], p))
];

const always = K(true);

(async function() {

    const seed = parseInt(new URLSearchParams(window.location.search).get("seed"));
    const rng = RNG.create(seed);
    console.info(`Seed: ${rng.state}`);
    const columnCount = rng.randomInt(4, 8);
    const rowCount = rng.randomInt(4, 8);
    const squareSize = 120;
    const m = 40;

    const root = document.querySelector("svg");
    root.setAttribute(
        "viewBox",
        `${-m} ${-m} ${columnCount * squareSize + 2 * m} ${rowCount * squareSize + 2 * m}`
    );

    // Generate a clip path with the square size for patterns that can overflow
    root.appendChild(svg("clipPath", {
        id: "square-clip"
    }, svg("rect", {
        width: squareSize,
        height: squareSize
    })));

    // The main grid
    const grid = root.appendChild(svg("g"));

    // TODO our own colors
    const colors = rng.randomItem(
        await fetch("https://unpkg.com/nice-color-palettes@3.0.0/100.json").then(
            response => response.json()
        )
    );

    if (columnCount > rowCount) {
        const width = squareSize * columnCount / colors.length;
        root.appendChild(svg("g", {
            transform: `translate(0, ${rowCount * squareSize + m / 2})`
        }, colors.map((color, i) => svg("rect", {
            x: i * width,
            width,
            height: m / 2,
            fill: color
        }))));
    } else {
        const height = squareSize * rowCount / colors.length;
        root.appendChild(svg("g", {
            transform: `translate(${columnCount * squareSize + m / 2}, 0)`
        }, colors.map((color, i) => svg("rect", {
            y: i * height,
            width: m / 2,
            height,
            fill: color
        }))));
    }

    const colorUrn = Urn.create(colors, rng);
    const bgColor = mixRGB(
        mixRGB(hexToRGB(colorUrn.pick()), hexToRGB(colorUrn.pick())),
        [255, 255, 255],
        0.75
    );
    document.body.style.backgroundColor = RGBtoHex(bgColor);

    const patterns = [
        // Circle (filled/donut)
        [(g, fgColor, bgColor) => {
            g.appendChild(svg("circle", {
                cx: squareSize / 2,
                cy: squareSize / 2,
                r: squareSize / 2,
                fill: fgColor
            }));
            if (rng.coinToss()) {
                g.appendChild(svg("circle", {
                    cx: squareSize / 2,
                    cy: squareSize / 2,
                    r: squareSize / rng.randomInt(3, 6),
                    fill: bgColor
                }));
            }
        }, always],

        // Two circles (clipped)
        [(g, color) => {
            const flip = rng.coinToss();
            g.appendChild(svg("circle", {
                cx: flip ? squareSize : 0,
                cy: 0,
                r: squareSize / 2,
                fill: color,
                "clip-path": "url(#square-clip)",
            }));
            g.appendChild(svg("circle", {
                cx: flip ? 0 : squareSize,
                cy: squareSize,
                r: squareSize / 2,
                fill: color,
                "clip-path": "url(#square-clip)",
            }));
        }, always],

        // Dots
        [(g, color) => {
            const n = rng.randomItem([1, 2, 2, 3, 3, 3, 4, 4, 5, 6, 7]);
            const s = squareSize / n;
            const r = s / 4;
            for (let x of range(0, n - 1)) {
                for (let y of range(0, n - 1)) {
                    g.appendChild(svg("circle", {
                        cx: x * s + s / 2,
                        cy: y * s + s / 2,
                        r,
                        fill: color
                    }));
                }
            }
        }, always],

        // Bars
        [(g, color) => {
            const horizontal = rng.coinToss();
            const n = rng.randomInt(2, 10);
            const s = squareSize / n;
            for (let i = 0; i < n; i += 2) {
                g.appendChild(svg("rect", {
                    x: horizontal ? 0 : i * s,
                    y: horizontal ? i * s : 0,
                    width: horizontal ? squareSize : s,
                    height: horizontal ? s : squareSize,
                    fill: color
                }));
            }
        }, always],

        // Cross
        [(g, color) => {
            const r = squareSize / 2;
            const s = squareSize / 4;
            const angle = 45 * rng.randomInt(0, 1);
            g.appendChild(svg("path", {
                fill: color,
                d: `M${3 * squareSize / 8},${squareSize / 8}h${s}v${s}h${s}v${s}h${-s}v${s}h${-s}v${-s}h${-s}v${-s}h${s}z`,
                transform: `translate(${r}, ${r}) rotate(${angle}) translate(${-r}, ${-r})`
            }));
        }, always],

        // Diagonal
        [(g, color) => {
            g.appendChild(svg("path", {
                d: rng.randomItem([
                    `M0,0H${squareSize}V${squareSize}z`,
                    `M0,0H${squareSize}L0,${squareSize}z`
                ]),
                fill: color,
            }));
        }, always],

        // Letter
        [(g, color) => {
            const angle = 90 * rng.randomInt(0, 3);
            const s = squareSize / 2;
            g.appendChild(svg("text", {
                "font-family": "ui-monospace",
                "font-weight": 800,
                "font-size": squareSize * 1.1,
                "text-anchor": "middle",
                "alignment-baseline": "central",
                "dominant-baseline": "middle",
                x: s,
                y: s,
                fill: color,
                transform: `translate(${s}, ${s}) rotate(${angle}) translate(${-s}, ${-s})`
            }, rng.randomItem("ABCDEFGHIJKLMNOPRSTUVWXYZbdfhiklt0123456789!#$%&*?<>".split(""))));
        }, always],

        // Smaller block
        [g => {
            block(g, 0, 0, 0.5);
            block(g, 0.5, 0, 0.5);
            block(g, 0, 0.5, 0.5);
            block(g, 0.5, 0.5, 0.5);
        }, scale => scale === 1],

        // Large block
        [g => {
            block(g, 0, 0, 2);
        }, (scale, x, y) => scale === 1 && x < columnCount - 1 && y < rowCount - 1 &&
            !filled[x + 1][y] && !filled[x][y + 1] && !filled[x + 1][y + 1]
        ]
    ];

    const filled = range(1, columnCount).map(() => range(1, rowCount).map(K(false)));

    for (let x of range(1, columnCount)) {
        for (let y of range(1, rowCount)) {
            block(grid, x - 1, y - 1);
        }
    }

    function block(parent, x, y, scale = 1) {
        if (scale === 1 && filled[x][y]) {
            return;
        }

        const bgColor = colorUrn.pick();
        const fgColor = colorUrn.pick();
        const g = parent.appendChild(svg("g", {
            transform: `translate(${x * squareSize}, ${y * squareSize}) scale(${scale})`,
        }));

        if (scale === 1) {
            filled[x][y] = g;
        } else if (scale === 2) {
            let xp, yp;
            searchXY: {
                for (xp = 0; xp < columnCount; ++xp) {
                    for (yp = 0; yp < rowCount; ++yp) {
                        if (filled[xp][yp] === parent) {
                            break searchXY;
                        }
                    }
                }
            }
            filled[xp + 1][yp] = parent;
            filled[xp][yp + 1] = parent;
            filled[xp + 1][yp + 1] = parent;
        }

        g.appendChild(svg("rect", {
            width: squareSize,
            height: squareSize,
            fill: bgColor,
        }));

        let [f, p] = rng.randomItem(patterns);
        while (!p(scale, x, y)) {
            [f, p] = rng.randomItem(patterns);
        }
        f(g, fgColor, bgColor);
    }

})();
