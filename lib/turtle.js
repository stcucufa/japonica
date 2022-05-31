import { create, svg } from "./util.js";

const cos = th => Math.cos(th * Math.PI / 180);
const sin = th => Math.sin(th * Math.PI / 180);

export const Canvas = {
    create: create({
        padding: 0
    }),

    init() {
        this.root = svg("svg");
        this.canvas = this.root.appendChild(svg("g", {
            "stroke-linejoin": "round",
            "stroke-linecap": "round",
            fill: "none"
        }));
    },

    updateViewBox(x1, y1, x2, y2) {
        const p = this.padding;
        const pp = 2 * p;
        this.root.setAttribute("viewBox", `${x1 - p} ${y1 - p} ${x2 - x1 + pp} ${y2 - y1 + pp}`);
    }
};

export const Turtle = {
    create: create({
        x: 0,
        y: 0,
        heading: 0,
        isPendown: true,
        pencolor: "#111d35",
        pensize: 1,
    }),

    init() {
        console.assert(this.canvas?.canvas instanceof SVGGElement)
        this.newPath();
        this.bounds = [this.x, this.y, this.x, this.y];
    },

    newPath() {
        this.path = this.canvas.canvas.appendChild(svg("path", {
            fill: "none",
            stroke: this.pencolor,
            "stroke-width": this.pensize,
            d: `M${this.x},${this.y}`
        }));
    },

    forward(d) {
        this.x += d * cos(this.heading);
        this.y += d * sin(this.heading);
        if (this.isPendown) {
            this.path.setAttribute("d", this.path.getAttribute("d") + `L${Math.round(this.x)},${Math.round(this.y)}`);
        } else {
            this.path.setAttribute("d", this.path.getAttribute("d") + `M${Math.round(this.x)},${Math.round(this.y)}`);
        }
        this.bounds[0] = Math.min(this.bounds[0], this.x);
        this.bounds[1] = Math.min(this.bounds[1], this.y);
        this.bounds[2] = Math.max(this.bounds[2], this.x);
        this.bounds[3] = Math.max(this.bounds[3], this.y);
        this.canvas.updateViewBox(...this.bounds);
    },

    left(a) {
        this.heading -= a;
    },

    penup() {
        this.isPendown = false;
    },

    pendown() {
        this.isPendown = true;
    },

    right(a) {
        this.heading += a;
    },

    setheading(a) {
        this.heading = a;
    },

    setpencolor(color) {
        if (color !== this.pencolor) {
            this.pencolor = color;
            this.newPath();
        }
    },

    setpensize(size) {
        if (size !== this.pensize) {
            this.pensize = size;
            this.newPath();
        }
    }
};
