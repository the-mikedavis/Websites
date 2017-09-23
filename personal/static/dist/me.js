window.addEventListener('load', function () {
    const svg = d3.select('svg'),
        margin = window.margin || {left: 40, right: 20, top: 20, bottom: 30};

    let height = svg.node().getBoundingClientRect().width,
        width;

    //  make the svg square
    svg.attr('height', height);

    //  confom the borders to the margins
    width = height - margin.right - margin.left;
    height = height - margin.top - margin.bottom;

    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]),
        g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

    d3.json('dist/linguae.json', function (data) {

        const largest = Math.max.apply(Math, data.map(function (e) {
                return e.time;
            }));

        //  set the domains of the scales
        x.domain(data.map(function (e) {
            return width > 500 ? e.name : e.alias || e.name;
        }));
        y.domain([0, largest]);

        //  append the axes
        g.append('g')
            .attr('class', 'axis xaxis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append('g')
            .attr('class', 'axis yaxis')
            .call(d3.axisLeft(y).ticks(5));

        //  make the bars
        g.selectAll('rect.bar')
            .data(data)
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', d => x(width > 500 ? d.name : d.alias || d.name))
            .attr('y', d => y(d.time))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.time))
            .attr('stroke', '#000')
            .attr('stroke-width', 1)
            .style('fill', d => d.color || "#000");

    });
});
