function ri (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.addEventListener('load', function () {
    const svg = d3.select('svg'),
        box = svg.node().getBoundingClientRect(),
        width = box.width,
        height = box.height;

    let count = ri(8, 50);

    data = window.rpg.render(width, height, count);

    render(data);

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

});
