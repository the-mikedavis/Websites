window.addEventListener('load', function () {
    var width = 50;
    var svg = d3.select('body').append('svg')
        .attr('id', 'backbutton')
        .attr('width', width)
        .attr('title', 'Go back')
        .attr('height', width)
        .style('position', 'fixed')
        .style('top', '50px')
        .style('left', '20px')
        .style('cursor', 'pointer')
        .on('click', function () {
            window.history.back();
        });

    var data = [
        {x1: .2 * width, x2: .5 * width, y1 : .5 * width, y2: .25 * width},
        {x1: .2 * width, x2: .5 * width, y1 : .5 * width, y2: .75 * width},
        {x1: .2 * width, x2: .9 * width, y1 : .5 * width, y2: .5 * width}
    ];
    svg.selectAll('line').data(data).enter()
        .append('line')
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2)
        .attr('stroke', '#888')
        .attr('stroke-width', 2)
        .attr('stroke-linejoin', 'miter');
});
