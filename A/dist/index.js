/*  Pocket-Watch Object
 *  
 *  This will be helpfull in pushing the ball along the stages of a path
 */
(function (w) {
    //  Counter object
    var c = {};
    //  Start the counter at 0
    c.now = 0;
    //  Update the counter and return it's new value
    c.update = function () {
        return ++c.now;
    };
    c.x = 0;

    //  Positions of the ball
    c.positions = [[500, 500], [1000, 500], [500, 1000]];

    //  Attach the counter to the window
    w.pw = c;
})(window);

window.addEventListener('load', function () {
    var s = d3.select('div#me')
        .append('svg')
        .attr('width', 200)
        .attr('height', 200)
        .attr('x', 500)
        .attr('y', 500);

    var defs = s.append('defs');
    var glow = defs.append('filter')
        .attr('x', '-20%')
        .attr('y', '-20%')
        .attr('width', '200%')
        .attr('height', '200%')
        .attr('id', 'glow');

    glow.append('feGaussianBlur')
        .attr('result', 'coloredBlur')
        .attr('stdDeviation', 5);

    var m = glow.append('feMerge');
    m.append('feMergeNode')
        .attr('in', 'coloredBlur')

    m.append('feMergeNode')
        .attr('in', 'SourceGraphic')
    
    var shadow = defs.append('filter')
        .attr('x', '-20%')
        .attr('y', '-20%')
        .attr('width', '200%')
        .attr('height', '200%')
        .attr('id', 'shadow');

    shadow.append('feGaussianBlur')
        .attr('result', 'coloredBlur')
        .attr('stdDeviation', 10);

    var merge = glow.append('feMerge');
    merge.append('feMergeNode')
        .attr('in', 'coloredBlur')

    merge.append('feMergeNode')
        .attr('in', 'SourceGraphic')

    s.append('circle').attr('r', 40)
        .attr('id', 'backdrop-2')
        .attr('cx', 100)
        .attr('cy', 100)
        .attr('fill', 'rgba(0, 0, 0, 0.3)')
        .style('filter', 'url("#shadow")');

    s.append('circle').attr('r', 35)
        .attr('id', 'backdrop-1')
        .attr('cx', 100)
        .attr('cy', 100)
        .attr('fill', '#999315')
        .style('filter', 'url("#shadow")');


    s.append('circle').attr('r', 20)
        .attr('id', 'ball')
        .attr('cx', 100)
        .attr('cy', 100)
        .attr('fill', '#fff624')
        .style('filter', 'url("#glow")');

    d3.select('circle#backdrop-2').on('mouseover', function () {
        console.log(d3.event.x + ', ' + d3.event.y);
        d3.select('svg').transition().style('transform', 
            'translate('+(pw.x += 50)+'px,0px)')
    })
});
