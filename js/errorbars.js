// set scale
function setscale()
{
    setbasic();
    svg = d3.select('svg').attr('width', width).attr('height', height)
        .attr('font-family', 'sans-serif')
        .attr('font-weight', '400')
        .attr('font-size', width/100.);

    xmin = Math.min(document.getElementById('pxmin').value,
                    document.getElementById('pxmax').value);
    xmax = Math.max(document.getElementById('pxmin').value,
                    document.getElementById('pxmax').value);
    ymin = Math.min(document.getElementById('pymin').value,
                    document.getElementById('pymax').value);
    ymax = Math.max(document.getElementById('pymin').value,
                    document.getElementById('pymax').value);
    changerangewlog();

    if(checklogx())
        x = d3.scaleLog().range([0, chartWidth]).domain([xmin, xmax]);
    else
        x = d3.scaleLinear().range([0, chartWidth]).domain([xmin, xmax]);
    if(checklogy())
        y = d3.scaleLog().range([chartHeight, 0]).domain([ymin, ymax]);
    else
        y = d3.scaleLinear().range([chartHeight, 0]).domain([ymin, ymax]);
    
}

// create svg
function setsvg()
{
    setscale();
    var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    drawaxisgrid();
}

// axes and grid
var drawaxisgrid = function()
{
    var ticksx = checklogx()?10:5, ticksy = checklogy()?10:5;
    var ticksizex = -chartWidth/40., ticksizey = -chartWidth/40.;
    var labelsize = width/26.;

    // ==> Grid <==
    d3.select("svg").select("g").append('g')
        .attr('transform', 'translate(0,' + chartHeight + ')')
        .attr("class", "grid")
        .attr('opacity', document.getElementById('btngrid').value)
        .attr('stroke-width', stroke_width_axis())
        .call( d3.axisBottom(x).tickSize(-chartHeight).tickFormat("").ticks(ticksx).tickSizeOuter(0) );
    d3.select("svg").select("g").append('g')
        .attr('transform', 'translate(0,0)')
        .attr("class", "grid")
        .attr('opacity', document.getElementById('btngrid').value)
        .attr('stroke-width', stroke_width_axis())
        .call( d3.axisLeft(y).tickSize(-chartWidth).ticks(ticksy).tickFormat("").tickSizeOuter(0) );

    // ==> Axis <==
    var addminor = function (theaxis, ticksn, islog) {
        var orgticks = theaxis.scale().ticks(ticksn, "");
        var nticks = islog?ticksn:ticksn*5;
        var ntickval = [];
        if(!islog) ntickval = orgticks;
        else
        {
            for(var i=0; i<orgticks.length; i++)
            {
                var log = Math.log(orgticks[i]) / Math.LN10;
                if(Math.abs(Math.round(log) - log) < 1e-6) ntickval.push(orgticks[i]); 
            }
        }
        theaxis.tickFormat(function (d, i) { return ntickval.includes(d)?d:""; }).ticks(nticks);
        return ntickval;
    }
    var xaxis = d3.axisBottom(x).tickSize(ticksizex).tickSizeOuter(0).tickPadding(6*Math.pow(document.documentElement.clientWidth/document.documentElement.clientHeight, 0.3)).ticks(ticksx, "");
    var xaxismajor = addminor(xaxis, ticksx, checklogx());
    var yaxis = d3.axisLeft(y).tickSize(ticksizey).tickSizeOuter(0).tickPadding(5*Math.pow(document.documentElement.clientWidth/document.documentElement.clientHeight, 0.6)).ticks(ticksy, "");
    var yaxismajor = addminor(yaxis, ticksy, checklogy());
    var shortenminor = function(the_axis, naxismajor, ticksizen)
    {
        the_axis.selectAll("g")
            .filter(function (d, i) { return !naxismajor.includes(d); })
            .style("stroke-dasharray", (0-ticksizen*0.5) + ", " + (0-ticksizen));
    }
    // xaxis
    var x_axis = d3.select("svg").select("g").append('g')
        .attr('transform', 'translate(0,' + chartHeight + ')')
        .attr('stroke-width', stroke_width_axis())
        .style('font-size', labelsize)
        .call( xaxis );
    // yaxis
    var y_axis = d3.select("svg").select("g").append('g')
        .attr('transform', 'translate(0,0)')
        .attr('stroke-width', stroke_width_axis())
        .style('font-size', labelsize)
        .call( yaxis );
    // xframe
    var x_frame = d3.select("svg").select("g").append('g')
        .attr('transform', 'translate(0,0)')
        .attr('stroke-width', stroke_width_axis())
        .call( xaxis.tickFormat("").tickSize(0-ticksizex) );
    // yframe
    var y_frame = d3.select("svg").select("g").append('g')
        .attr('transform', 'translate(' + chartWidth + ',0)')
        .attr('stroke-width', stroke_width_axis())
        .call( yaxis.tickFormat("").tickSize(0-ticksizey) );

    shortenminor(x_axis, xaxismajor, ticksizex);
    shortenminor(y_axis, yaxismajor, ticksizey);
    shortenminor(x_frame, xaxismajor, ticksizex);
    shortenminor(y_frame, yaxismajor, ticksizey);

    var xtitle = svg.append("text")
        .attr("transform",
              "translate(" + (chartWidth/2. + margin.left) + " ," +
              (chartHeight + margin.top + margin.bottom/1.3) + ")")
        .style("text-anchor", "middle")
    var ytitle = svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left / 3.8)
        .attr("x", 0 - (margin.top + chartHeight / 2.))
        .style("text-anchor", "middle")
    addaxistitle(xtitle, ytitle);

    // ==> Unity/Zero line <==
    var vline = d3.select("svg").select("g")
        .append('line')
        .attr('id', 'vline')
        .attr('x1', x(xmin))
        .attr('x2', x(xmax))
        .attr('y1', y(unityzero()))
        .attr('y2', y(unityzero()))
        .attr('stroke', '#000')
        .attr('stroke-dasharray', '5,3')
        .attr('stroke-width', stroke_width_axis())
        .attr('opacity', document.getElementById('btnvline').value)
        .attr('display', function() { return (unityzero() > ymin && unityzero() < ymax)?'default':'none'; });

    // ==> Watermark <==
    var tmark = svg.append("text")
        .attr("transform",
              "translate(" + (margin.left*0.1) + " ," +
              (height-width*0.022) + ")")
        .style("text-anchor", "start")
        .style("fill", "#bbbbbb")
        .style("font-family", "'Courier New', monospace")
        .style("font-weight", "400")
        .style("font-size", "2.2em")    
        .text("boundino.github.io/hinHFplot");
}

var drawdisplay = function(da, transt = 400)
{
    d3.select("svg").select("g").selectAll('.rectd3'+da).transition().attr('opacity', shadowopacity*drawornot(da, 'rect')).duration(transt);
    d3.select("svg").select("g").selectAll('.rectld3'+da).transition().attr('opacity', 1.*drawornot(da, 'rectl')).duration(transt);
    d3.select("svg").select("g").selectAll('.rectvd3'+da).transition().attr('opacity', shadowopacity*drawornot(da, 'rectv')).duration(transt);
    d3.select("svg").select("g").selectAll('.rectvld3'+da).transition().attr('opacity', 1.*drawornot(da, 'rectvl')).duration(transt);
    d3.select("svg").select("g").selectAll('.linevd3'+da).transition().attr('opacity', 1.*drawornot(da, 'linev')).duration(transt);
}

var addData = function(da, data, thecolor, kmarker, transt = 500) {
    addDataRects(da, data, thecolor, transt);
    addDataLines(da, data, thecolor, transt);
    addDataPoints(da, data, thecolor, kmarker, transt);
}

var addDataRects = function(da, data, thecolor, transt = 500) {
    var fill, strokewidth, group;

    // Narrow shadow
    fill = thecolor;
    strokewidth = 0;
    group = 'rect';
    opac = shadowopacity;
    d3.select("svg").select("g").selectAll('.'+group+'d3'+da)
        .data(data)
        .enter().append('rect')
        .attr('class', group+'d3'+da)
    // .merge(rects)
        .attr('x', function(d) { return xoverflow( x(d.x) - chartWidth/80. ); }) // 
        .attr('width', function(d) { return xoverflow( x(d.x) + chartWidth/80. ) - xoverflow( x(d.x) - chartWidth/80. ); }) //
        .attr('y', function(d) { return yoverflow(y(d.y + d.systh)); })
        .attr('height', function(d) { return yoverflow(y(d.y - d.systl)) - yoverflow(y(d.y + d.systh)); }) 
        .attr('fill', fill)
        .attr('stroke', thecolor)
        .attr('stroke-width', strokewidth)
        .attr('opacity', 0).transition()
        .attr('opacity', opac*drawornot(da, group))
        .duration(transt);        

    // Wide shadow
    fill = thecolor;
    strokewidth = 0;
    group = 'rectv';
    opac = shadowopacity;
    d3.select("svg").select("g").selectAll('.'+group+'d3'+da)
        .data(data)
        .enter().append('rect')
        .attr('class', group+'d3'+da)
    // .merge(rectvs)
        .attr('x', function(d) { return xoverflow( x(d.xl) ); }) // 
        .attr('width', function(d) { return xoverflow( x(d.xh) ) - xoverflow( x(d.xl) ); }) //
        .attr('y', function(d) { return yoverflow(y(d.y + d.systh)); })
        .attr('height', function(d) { return yoverflow(y(d.y - d.systl)) - yoverflow(y(d.y + d.systh)); }) 
        .attr('fill', fill)
        .attr('stroke', thecolor)
        .attr('stroke-width', strokewidth)
        .attr('opacity', 0).transition()
        .attr('opacity', opac*drawornot(da, group))
        .duration(transt);        

    // Narrow outline
    fill = 'transparent';
    strokewidth = stroke_width()*0.85;
    group = 'rectl';
    opac = 1.0;
    d3.select("svg").select("g").selectAll('.'+group+'d3'+da)
        .data(data)
        .enter().append('rect')
        .attr('class', group+'d3'+da)
    // .merge(rectls)
        .attr('x', function(d) { return xoverflow( x(d.x) - chartWidth/80. ); }) // 
        .attr('width', function(d) { return xoverflow( x(d.x) + chartWidth/80. ) - xoverflow( x(d.x) - chartWidth/80. ); }) //
        .attr('y', function(d) { return yoverflow(y(d.y + d.systh)); })
        .attr('height', function(d) { return yoverflow(y(d.y - d.systl)) - yoverflow(y(d.y + d.systh)); }) 
        .attr('fill', fill)
        .attr('stroke', thecolor)
        .attr('stroke-width', strokewidth)
        .attr('opacity', 0).transition()
        .attr('opacity', opac*drawornot(da, group))
        .duration(transt);        

    // Wide outline
    fill = 'transparent';
    strokewidth = stroke_width()*0.85;
    group = 'rectvl';
    opac = 1.0;
    d3.select("svg").select("g").selectAll('.'+group+'d3'+da)
        .data(data)
        .enter().append('rect')
        .attr('class', group+'d3'+da)
    // .merge(rectvls)
        .attr('x', function(d) { return xoverflow( x(d.xl) ); }) // 
        .attr('width', function(d) { return xoverflow( x(d.xh) ) - xoverflow( x(d.xl) ); }) //
        .attr('y', function(d) { return yoverflow(y(d.y + d.systh)); })
        .attr('height', function(d) { return yoverflow(y(d.y - d.systl)) - yoverflow(y(d.y + d.systh)); }) 
        .attr('fill', fill)
        .attr('stroke', thecolor)
        .attr('stroke-width', strokewidth)
        .attr('opacity', 0).transition()
        .attr('opacity', opac*drawornot(da, group))
        .duration(transt);        
}

var addDataLines = function(da, data, thecolor, transt = 500) {
    var kmarker = document.getElementById('marker_'+da).value;
    var delta_up = Math.sqrt(marker_size())*vopt[kmarker].offset[1],
        delta_down = Math.sqrt(marker_size())*vopt[kmarker].offset[2],
        delta_lr = Math.sqrt(marker_size())*vopt[kmarker].offset[3];

    // Error line
    var lines = d3.select("svg").select("g").selectAll('.lined3'+da)
        .data(data);
    // --> error line 1
    lines.enter().append('line')
        .attr('class', 'lined3' + da)
        .attr('x1', function(d) { return xthrow(x(d.x)); })
        .attr('x2', function(d) { return xthrow(x(d.x)); })
        .attr('y1', function(d) { return yoverflow( y(d.y + d.stath) ); })
        .attr('y2', function(d) { return yoverflow( Math.max(y(d.y) - delta_up, y(d.y + d.stath)) ); })
        .attr('stroke', thecolor)
        .attr('stroke-width', stroke_width())
        .attr('opacity', 0).transition()
        .attr('opacity', 1.0*drawornot(da, 'line'))
        .duration(transt);
    // --> error line 2
    lines.enter().append('line')
        .attr('class', 'lined3' + da)
        .attr('x1', function(d) { return xthrow(x(d.x)); })
        .attr('x2', function(d) { return xthrow(x(d.x)); })
        .attr('y1', function(d) { return yoverflow( Math.min(y(d.y) + delta_down, y(d.y - d.statl)) ); })
        .attr('y2', function(d) { return yoverflow( y(d.y - d.statl) ); })
        .attr('stroke', thecolor)
        .attr('stroke-width', stroke_width())
        .attr('opacity', 0).transition()
        .attr('opacity', 1.0*drawornot(da, 'line'))
        .duration(transt);

    // Horizontal line
    var linevs = d3.select("svg").select("g").selectAll('.linevd3'+da)
        .data(data);
    // --> horizontal line 1
    linevs.enter().append('line')
        .attr('class', 'linevd3' + da)
        .attr('x1', function(d) { return xoverflow( x(d.xl) ); })
        .attr('x2', function(d) { return xoverflow( Math.max(x(d.x) - delta_lr, x(d.xl)) ); })
        .attr('y1', function(d) { return ythrow(y(d.y)); })
        .attr('y2', function(d) { return ythrow(y(d.y)); })
        .attr('stroke', thecolor)
        .attr('stroke-width', stroke_width())
        .attr('opacity', 0).transition()
        .attr('opacity', 1.0*drawornot(da, 'linev'))
        .duration(transt);
    // --> horizontal line 2
    linevs.enter().append('line')
        .attr('class', 'linevd3' + da)
        .attr('x1', function(d) { return xoverflow( Math.min(x(d.x) + delta_lr, x(d.xh)) ); })
        .attr('x2', function(d) { return xoverflow( x(d.xh) ); })
        .attr('y1', function(d) { return ythrow(y(d.y)); })
        .attr('y2', function(d) { return ythrow(y(d.y)); })
        .attr('stroke', thecolor)
        .attr('stroke-width', stroke_width())
        .attr('opacity', 0).transition()
        .attr('opacity', 1.0*drawornot(da, 'linev'))
        .duration(transt);
}

var addDataPoints = function(da, data, thecolor, kmarker, transt = 500) {
    // Marker
    var points = d3.select("svg").select("g").selectAll('.pointd3'+da)
        .data(data)
        .enter()
        .append('path')
        .attr("d", d3.symbol().type(vopt[kmarker].type).size(marker_size()*vopt[kmarker].offset[0]))
        .attr("transform", function(d) { return "translate(" + xthrow(x(d.x)) + "," + ythrow(y(d.y)) + ")"; })
        .attr('class', 'pointd3' + da)
        .attr('fill', vopt[kmarker].fill==1?thecolor:'transparent')
        .attr('stroke', thecolor)
	.attr('stroke-width', stroke_width())
        .attr('opacity', 0).transition()
        .attr('opacity', 1.).duration(transt);
};

// ==> ONE functions
var rmone = function(da)
{
    d3.select("svg").select("g").selectAll('.rectd3'+da).remove();
    d3.select("svg").select("g").selectAll('.rectld3'+da).remove();
    d3.select("svg").select("g").selectAll('.rectvd3'+da).remove();
    d3.select("svg").select("g").selectAll('.rectvld3'+da).remove();
    d3.select("svg").select("g").selectAll('.lined3'+da).remove();
    d3.select("svg").select("g").selectAll('.linevd3'+da).remove();
    d3.select("svg").select("g").selectAll('.pointd3'+da).remove();
}

var clearone = function(da, transt = 500)
{
    d3.select("svg").select("g").selectAll('.rectd3'+da).transition().attr('opacity', 0).duration(transt);
    d3.select("svg").select("g").selectAll('.rectld3'+da).transition().attr('opacity', 0).duration(transt);
    d3.select("svg").select("g").selectAll('.rectvd3'+da).transition().attr('opacity', 0).duration(transt);
    d3.select("svg").select("g").selectAll('.rectvld3'+da).transition().attr('opacity', 0).duration(transt);
    d3.select("svg").select("g").selectAll('.lined3'+da).transition().attr('opacity', 0).duration(transt);
    d3.select("svg").select("g").selectAll('.linevd3'+da).transition().attr('opacity', 0).duration(transt);
    d3.select("svg").select("g").selectAll('.pointd3'+da).transition().attr('opacity', 0).duration(transt);
}

var drawone = function(da, transt = 500)
{
    if(checkb(da))
    {
        rmone(da);
        var thisitem = dataset[da];
        addData(da, thisitem.data, document.getElementById('color_'+da).value, document.getElementById('marker_'+da).value);
    }
    else
    {
        clearone(da);
    }
}

function changeone(da, transt = 500)
{
    var kmarker = document.getElementById("marker_"+da).value;
    var cc = document.getElementById("color_"+da).value;

    d3.select("svg").select("g").selectAll('.rectd3'+da).transition().attr('fill', cc).attr('stroke', cc).duration(transt);
    d3.select("svg").select("g").selectAll('.rectld3'+da).transition().attr('stroke', cc).duration(transt);
    d3.select("svg").select("g").selectAll('.rectvd3'+da).transition().attr('fill', cc).attr('stroke', cc).duration(transt);
    d3.select("svg").select("g").selectAll('.rectvld3'+da).transition().attr('stroke', cc).duration(transt);
    d3.select("svg").select("g").selectAll('.lined3'+da).transition().attr('stroke', cc).duration(transt);
    d3.select("svg").select("g").selectAll('.linevd3'+da).transition().attr('stroke', cc).duration(transt);

    d3.select("svg").select("g").selectAll('.pointd3'+da)
        .attr("d", d3.symbol().type(vopt[kmarker].type).size(marker_size()*vopt[kmarker].offset[0]))
        .transition()
        .attr('stroke', cc)
        .attr('fill', vopt[kmarker].fill==1?cc:'transparent')
        .duration(transt);
}

// ONE functions <==

var drawall = function(transt = 500)
{
    d3.selectAll("svg > *").remove();
    setsvg();

    var checkbs = document.getElementsByClassName("checkb");
    for(var i=0; i<checkbs.length; i++)
    {
        var da = checkbs[i].id.replace("check_", "");
        if(!checkb(da)) continue;
        var thisitem = dataset[da];
        addData(da, thisitem.data, document.getElementById('color_'+da).value, document.getElementById('marker_'+da).value, transt);
    }

    drawalltext();
}

