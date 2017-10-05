window.addEventListener('load', function () {
    const svg = d3.select('svg'),
        box = svg.node().getBoundingClientRect(),
        width = box.width,
        height = box.height;

    const data = new Array(40);

    data[0] = new Body(ri(0, width), ri(0, height), ri(width/50, width/10));


    //  this is linear average time, 0(n^2) worst case
    let r = 20;
    for (let i = 1; i < data.length; i++) {
        //  create a toddler circle which is not contained by a circle
        //  the minimum radius is enforced here
        //  This is a strict while loop. If the data does not satisfy
        //  the conditions, the map cannot be made
        do {
            data[i] = new Body(ri(0, width), ri(0, height), r);
        } while (isContained(data, i));
        // expand this toddler circle out as far as possible, but still
        // randomly
        data[i].radius = ri(width/10, width/20);
        for (let rad = width/10; rad > r && isContained(data, i); rad -= 10)
            data[i].radius = rad;
    }


    //  on each shape, create the vertices
    for (let c of data) {
        arr = [];
        for (let i = 0; i < c.sides; i++) {
            let count = 0;
            do {
                let angle = Math.random() * Math.PI * 2,
                    x = Math.cos(angle) * c.radius,
                    y = Math.sin(angle) * c.radius;
                c.vertices[i] = {
                    x : Math.floor(x) + c.x,
                    y : Math.floor(y) + c.y
                };
                arr[i] = new Vertex(x, y, c.radius);
                if (count++ > 100 &&
                    !pointIsntOnMap(c.vertices[i].x, c.vertices[i].y))
                    break;
            } while (pointIsntOnMap(c.vertices[i].x, c.vertices[i].y) || 
                isContained(arr, i));
        }
        let start;
        for (let e of c.vertices) {
            let ang = Math.atan2(e.y - c.y, e.x - c.x);
            if (!start)
                start = ang;
            else if (ang < start)
                ang += Math.PI * 2;
            e.angle = ang;
        }
        //  sort into clockwise order for rendering
        c.vertices.sort(function (a, b) {
            return a.angle - b.angle;
        });
    }

    console.log(data)
    render(data);

    function isContained (data, index) {
        for (let i = 0; i < index; i++)
            if (data[i].overlaps(data[index]))
                return true;
    }

    function pointIsntOnMap(x, y) {
        return !(x > 0 && x < width && y > 0 && y < height);
    }

    function render (data) {
        let circles = svg.selectAll('circle.outline').data(data);
        circles.enter()
            .append('circle')
            .classed('outline', true)
            .attr('fill', 'none')
            .attr('stroke', '#ccc')
            .attr('stroke-width', 1)
            .merge(circles)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', d => d.radius)
            .each(function (d) {
                for (let i = 0; i < d.vertices.length; i++) {
                    svg.append('line')
                        .attr('x1', d.vertices[i].x)
                        .attr('y1', d.vertices[i].y)
                        .attr('x2', d.vertices[i + 1 == d.vertices.length ? 0 : i + 1].x)
                        .attr('y2', d.vertices[i + 1 == d.vertices.length ? 0 : i + 1].y)
                        .attr('fill', 'none')
                        .attr('stroke', '#F00')
                        .attr('stroke-width', 1)
                    svg.append('circle')
                        .attr('cx', d.vertices[i].x)
                        .attr('cy', d.vertices[i].y)
                        .attr('r', 2)
                        .attr('stroke-width', 0)
                        .attr('fill', '#00F')
                }
            });
    }

    window.render = render;
    window.data = data;
});

function ri (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Vertex {
    constructor (x, y, d) {
        this.x = x;
        this.y = y;
        this.d = d;
    }

    overlaps (o) {
        let dx = o.x - this.x,
            dy = o.y - this.y,
            distance = Math.sqrt(dx*dx + dy*dy)
        return distance <= this.d - 1;
    }
}


class Body {

    constructor (x, y, r) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = r;
        this.sides = ri(3,6);
        this.vertices = [];
    }

    overlaps (o) {
        let dx = o.x - this.x,
            dy = o.y - this.y,
            distance = Math.sqrt(dx*dx + dy*dy)
        return distance <= o.radius + this.radius + 3;
    }

    equals (o) {
        return this.x == o.x && this.y == o.y && this.vx == o.vx && this.vy == o.vy
            && this.radius == o.radius;
    }

}
