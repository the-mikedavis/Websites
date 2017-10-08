if (getWidth() > 800) {
    window.addEventListener('load', function () {
        const svg = d3.select('svg#glasspane').style('pointer-events', 'none'),
            node = svg.node().getBoundingClientRect(),
            width = node.width,
            height = node.height;

        svg.each(function () {
            this.parentNode.appendChild(this);
        });

        d3.select('body')
            .on('mousemove', function () {
                clearTimeout(timer);
                let coor = d3.mouse(this),
                    scrollNode = document.scrollingElement || document.documentElement,
                    x = coor[0],
                    y = coor[1] - scrollNode.scrollTop;
                timer = setTimeout(function(){timeout(x, y)}, 1000);
            });

        let timer;
        const timeout = function (x, y) {
            if (arguments.length === 0)
                return;
            renderPoly(x, y, ri(3, 7));
        }

        timer = setTimeout(timeout, 2000);

        function renderPoly (x, y, sides) {
            let points = newPolyCoors(x, y, sides);
            svg.append('circle')
                .style('fill', 'none')
                .style('stroke', '#555')
                .style('stroke-width', 1)
                .attr('r', 5)
                .attr('cx', x)
                .attr('cy', y)
                .transition().duration(2000).delay(500)
                .attr('r', points.radius)
                .on('end', function () {
                    svg.selectAll('vertex').data(points)
                        .enter()
                        .append('circle')
                        .style('fill', 'none')
                        .style('stroke', '#555')
                        .style('stroke-width', 1)
                        .attr('r', 1)
                        .attr('cx', d => d.x)
                        .attr('cy', d => d.y)
                        .transition().duration(1000)
                        .attr('r', 4);
                    svg.selectAll('edge').data(points)
                        .enter()
                        .append('line')
                        .style('stroke', '#555')
                        .style('stroke-width', 1)
                        .attr('x1', d => d.x)
                        .attr('y1', d => d.y)
                        .attr('x2', (d, i) => points[i + 1 == points.length ? 0 : i + 1].x)
                        .attr('y2', (d, i) => points[i + 1 == points.length ? 0 : i + 1].y)
                        .style('opacity', 0)
                        .transition().delay(1000).duration(1000)
                        .style('opacity', 1)
                        .on('end', function () {
                            svg.selectAll('*')
                                .style('opacity', 1)
                                .transition().delay(500).duration(1000)
                                .style('opacity', 0)
                                .transition().remove();
                        });
                });
        }

        function newPolyCoors (x, y, sides) {
            let points = [];
            let radius = ri(width/40, width/20);

            let angle = Math.random() * Math.PI * 2;
            for (let i = 0; i < sides; i++) {
                let count = 0;
                do {
                    angle = Math.random() * Math.PI * 2; 
                    points[i] = new Vertex(Math.cos(angle) * radius + x,
                        Math.sin(angle) * radius + y, radius);

                    if (count++ > 20)
                        break;
                    //  repeat if the point is too close to others or off the map
                } while (isContained(points, i));
            }
            let start;
            for (let e of points) {
                let ang = Math.atan2(e.y - y, e.x - x);
                if (!start)
                    start = ang;
                else if (ang < start)
                    ang += Math.PI * 2;
                e.angle = ang;
            }

            //  sort into clockwise order for rendering
            points.sort((a, b) => a.angle - b.angle);

            points.radius = radius;

            return points;
        }

        function isContained (data, index) {
            for (let i = 0; i < index; i++)
                if (data[i].overlaps(data[index]))
                    return true;
        }

        function pointIsntOnMap(x, y) {
            return !(x > 0 && x < width && y > 0 && y < height);
        }

    });
}

class Vertex {
    constructor (x, y, d) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.angle = 0;
    }

    overlaps (o) {
        let dx = o.x - this.x,
            dy = o.y - this.y,
            distance = Math.sqrt(dx*dx + dy*dy)
        return distance <= this.d - 1;
    }
}

function ri (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getWidth () {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        width = w.innerWidth || e.clientWidth || g.clientWidth;
    return width;
}
