// From Véra Molnar, Une rétrospective 1942/2012, Bernard Chauveau Éditeur, p. 76

import { RNG } from "../lib/random.js";
import { Canvas, Turtle } from "../lib/turtle.js";

const seed = parseInt(new URLSearchParams(window.location.search).get("seed"));
const rng = RNG.create(seed);
console.info(`Seed: ${rng.state}`);

const randomMod = n => rng.randomInt(- n + 1, n - 1);

const canvas = Canvas.create({ padding: 40 + randomMod(20) });
const turtle = Turtle.create({ canvas, pencolor: "#ff6e59" });

document.body.insertBefore(canvas.root, document.body.firstChild);

function W(turtle) {
    turtle.setpensize(2 + randomMod(2));
    turtle.setheading(0);
    turtle.right(125 + randomMod(70));
    turtle.forward(100 + randomMod(42));
    turtle.left(165 + randomMod(5));
    turtle.forward(80 + randomMod(42));
    turtle.right(165 + randomMod(5));
    turtle.forward(80 + randomMod(42));
    turtle.left(165 + randomMod(5));
    turtle.forward(180 + randomMod(42));
}

for (let i = 0; i < 17; ++i) {
    W(turtle);
}

const [_, __, w, h] = canvas.root.getAttribute("viewBox").split(" ").map(x => parseInt(x));
canvas.root.style.height = `${100 * h / w}vw`;
