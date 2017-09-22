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
    c.positions = [];

    //  Update the positions to reflect the window sizes
    c.scale = function () {
        if (document.readyState === "complete") {
            var div = d3.select('div.col-xs-12'),
                width = div.node().getBoundingClientRect().width,
                center = width / 2 - 100;
            c.positions = [
                300,
                800,
                1300,
                1800,
                1850
            ];
        }
    }
    //  Attach the counter to the window
    w.pw = c;
})(window);

window.addEventListener('load', function () {
    for (var i = 0; i < 4; i++)
        $('div#content-' + i).hide();
    pw.scale();

    var s = d3.select('div.col-xs-12')
        .append('svg')
        .style('position', 'absolute')
        .attr('width', 200)
        .attr('height', 200)
        .style('left', (d3.select('div.col-xs-12')
            .node().getBoundingClientRect().width) / 2 - 100)
        .style('top', pw.positions[pw.now]);

    var defs = s.append('defs');
    var glow = defs.append('filter')
        .attr('x', '-70%')
        .attr('y', '-70%')
        .attr('width', '200%')
        .attr('height', '200%')
        .attr('id', 'glow');

    glow.append('feGaussianBlur')
        .attr('result', 'coloredBlur')
        .attr('stdDeviation', 3);

    var m = glow.append('feMerge');
    m.append('feMergeNode')
        .attr('in', 'coloredBlur')

    m.append('feMergeNode')
        .attr('in', 'SourceGraphic')
    
    var shadow = defs.append('filter')
        .attr('x', '-50%')
        .attr('y', '-50%')
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

    s.append('circle').attr('r', 20)
        .attr('id', 'backdrop-1')
        .attr('cx', 100)
        .attr('cy', 100)
        .attr('fill', '#999315')
        .style('filter', 'url("#shadow")')
        .call(radiate, 1000);


    s.append('circle').attr('r', 8)
        .attr('id', 'ball')
        .attr('cx', 100)
        .attr('cy', 100)
        .attr('fill', '#fff624')
        .style('filter', 'url("#glow")');

    d3.select('circle#ball').on('click', function () {
        //  increment the counter
        pw.update();
        if (pw.positions[pw.now]) {
            //  if there's somewhere to go, transition there
            d3.select('svg').transition('move')
                .duration(800)
                .ease(d3.easeCubic)
                .style('top', pw.positions[pw.now])

            $('div#content-' + (pw.now - 1)).fadeIn('slow');
        } else {
            //  otherwise, transition out
            d3.selectAll('circle').transition('out')
                .duration(2000)
                .style('opacity', 0)
                .on("end", function () {
                    //  Redirect to site B
                    console.log('redirect')
                })
                .transition().delay(2001)
                .remove();
            window.removeEventListener('resize', scaleToWindow)
        }
    })
});

window.addEventListener('resize', scaleToWindow)

function scaleToWindow () {
    pw.scale();

    d3.select('svg')
        .style('left', (d3.select('div.col-xs-12')
            .node().getBoundingClientRect().width) / 2 - 100)
        .style('top', pw.positions[pw.now]);
}

function radiate (element, duration) {
    element.transition('radiate')
        .duration(duration)
        .attr('r', 30)
        .transition()
        .duration(duration)
        .attr('r', 20)
        .on("end", function () {
            element.call(radiate, duration);
        });
}

