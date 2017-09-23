const colors = {
    "Brainfuck": "#2F2530",
    "C": "#555555",
    "CSS": "#563d7c",
    "Go": "#375eab",
    "HTML": "#e34c26",
    "Java": "#b07219",
    "JavaScript": "#f1e05a",
    "Processing": "#0096D8",
    "Python": "#3572A5",
    "Ruby": "#701516",
    "Shell": "#89e051",
    "TeX": "#3D6117"
};

window.addEventListener('load', function () {
    const svg = d3.select('svg');
    if (!window.margin)
        svg.on('click', function() {
            window.location.href = "/language-graph"
        });

    const margin = window.margin || {left: 40, right: 20, top: 20, bottom: 30};

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

        const keys = Object.keys(data),
            vals = Object.values(data),
            largest = Math.max.apply(Math, vals);

        //  set the domains of the scales
        x.domain(keys);
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
            .data(keys)
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', d => x(d))
            .attr('y', d => y(data[d]))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(data[d]))
            .attr('stroke', '#000')
            .attr('stroke-width', 1)
            .style('fill', d => colors[d] || "#000");

    });
});
