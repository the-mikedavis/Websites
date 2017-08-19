window.addEventListener('load', function () {
    console.log('loaded');
    var svg = d3.select('svg#classes');

    d3.json('dist/progression.json', function (error, data) {
        console.log(data)

        var years = svg.selectAll('g')
            .data(data.years)
            .enter()
            .append('g')
            .attr('class', 'semester');
        years.append('text')
            .text(function (d, i) {
                return "Year " + (i + 1);
            })
            .attr('x', function (d, i, l) {
                return (i * (100 / l.length)) + "%";
            })
            .attr('y', 40)
            .style('font-family', 'Consolas, monospace')
        years.selectAll('rect')
            .data(function (d, i) {
                console.log(arguments)
                return d;
            })
            .enter()
            .append('rect')
            .attr('x', function (
    })
});
