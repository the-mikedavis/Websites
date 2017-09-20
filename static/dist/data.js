window.addEventListener('load', function () {
    const svg = d3.select('svg#classes');

    d3.json('dist/progression.json', function (error, data) {
        const years = svg.selectAll('svg.years')
            .data(data.years)
            .enter()
            .append('svg')
            .classed('years', true)
            .attr('x', (d, i, l) => 100 * i / l.length + "%")
            .attr('y', '40px')
            .attr('width', '33.33333%')
            .each(function (d, i) {
                const svg = d3.select(this);
                svg.append('rect')
                    .attr('x', '2%')
                    .attr('y', '0%')
                    .attr('width', '96%')
                    .attr('height', '80%')
                    .style('fill', '#888');

                svg.append('text')
                    .text("Year " + (i + 1))
                    .attr('x', '40%')
                    .attr('y', 20)
                    .style('stroke', 0)
                    .style('font-family', 'Consolas, monospace')
            });

        const plate = svg.append('svg')
            .attr('id', 'plate')
            .attr('x', '0%')
            .attr('y', '0%')
            .attr('width', '100%')
            .attr('height', '100%')

        const semesters = years.selectAll('svg')
            .data(d => d.semesters)
            .enter()
            .append('svg')
            .attr('x', (d, i) => i * 50 + '%')
            .attr('y', 30)
            .attr('width', '50%')
            .each(function(d, i) {
                d3.select(this).append('text')
                    .text(`Semester ${i % 2 + 1}`)
                    .attr('x', '15%')
                    .attr('y', 10)
            });

        const classes = semesters.selectAll('rect.classblocks')
            .data(d => d)
            .enter()
            .append('rect')
            .classed('classblocks', true)
            .attr('width', '90%')
            .attr('x', '5%')
            .attr('y', (d, i) => 100 * i + 25)
            .attr('height', 75)
            .style('fill', '#bbb')
            .style('stroke', 0)
            .on('click', function (d, i, l, self) {
                //if this is the first link in the chain
                let dim;
                if (!self) {
                    //clean the plate
                    plate.selectAll('*').remove();
                    self = this;
                } else {
                    let me = self.getBoundingClientRect(),
                        off = svg.node().getBoundingClientRect();
                    //save the dimensions of this rect for the arrow head.
                    dim = {
                        x: me.left - off.left,
                        y: me.top - off.top,
                        w: me.width,
                        h: me.height
                    }
                }
                if (dim) {
                    plate.append('polygon')
                        .attr('fill', '#000')
                        .attr('stroke-width', 0)
                        .attr('points', 
                            `${dim.x+dim.w},${dim.y+(9*dim.h/16)} ${dim.x+(15*dim.w/16)},${dim.y+dim.h/2} ${dim.x+dim.w},${dim.y+(7*dim.h/16)}`);
                }

                //  if there are no good prereqs, leave
                if (!d || d.prereq == null || d3.selectAll('rect.classblocks')
                    .filter(r => d.prereq.indexOf(r.name) > -1).size() < 1)
                    return;

                /*
                 * foreach req in prereq :
                 *     draw_arrow (from: this, to: req);
                 */

                for (let i = 0; i < d.prereq.length; i++) {
                    let other = semesters.selectAll('rect.classblocks')
                        .filter(r => d.prereq[i] == r.name)
                        .node().getBoundingClientRect(),
                        me = self.getBoundingClientRect(),
                        off = svg.node().getBoundingClientRect();
                    let x1 = me.left - off.left,
                        x2 = other.right - off.left,
                        y1 = me.top + me.height / 2 - off.top,
                        y2 = other.top + other.height / 2 - off.top;


                    let path = `M${x1} ${y1} `;

                    //ease the curve for classes on same horizontal
                    if (y1 == y2 && x1 - x2 > 30)
                        path += 'Q ' + ((x1 + x2) / 2) + ' ' +
                            (me.top - off.top) + ' ';
                    else //ease curve for far away classes
                        path += 'Q ' + ((x1 + x2) / 2) + ' ' + (y2) + ' ';


                    path += x2 + ' ' + y2;

                    plate.append('path')
                        .style('fill', 'none')
                        .attr('stroke', '#000')
                        .attr('stroke-width', 2)
                        .attr('d', path)

                }

                //make a recursive call to prereq blocks
                semesters.selectAll('rect.classblocks')
                    .filter(r => d.prereq.indexOf(r.name) > -1)
                    .each(function (d, i, l) {
                        d3.select(this).on('click')(d, i, l, this);
                    });
            });

        const text = semesters.selectAll('text.classnames')
            .data(d => d)
            .enter()
            .append('text')
            .classed('classnames', true)
            .attr('x', '15%')
            .attr('y', (d, i) => 100 * i + 65)
            .style('stroke', 0)
            .text(d => d.name)

        window.addEventListener('resize', function () {
            d3.select('svg#plate').selectAll('*').remove()
        });
    })
});
