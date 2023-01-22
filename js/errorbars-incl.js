var width, height;
var svg;
var margin, chartWidth, chartHeight;

var xmin, xmax, ymin, ymax;
var x, y;

// legend -->
var x0, y0, dy, dxmark;
var legsize;
var legs = [];

// <-- legend

var getx0 = function(x0value) { return margin.left + chartWidth/89.*(x0value-10); }
var gety0 = function(y0value) { return margin.top + chartWidth/89.*(y0value-10); }
var gettsize = function(t0value) { return 2. + t0value/30.; }

// set basic
function setbasic()
{
    width = document.getElementById('rightpad').clientWidth*0.95;
    height = width * document.getElementById('ratiorange').value;
    margin = { top: width*0.72*0.06, right: width*0.07, bottom: width*0.72*0.15, left: width*0.13 },
    chartWidth = width - margin.left - margin.right,
    chartHeight = height - margin.top - margin.bottom;
    x0 = getx0(document.getElementById('x0range').value);
    y0 = gety0(document.getElementById('y0range').value);
    dxmark = chartWidth/40.; //
    legsize = gettsize(document.getElementById('legsizerange').value);
    dy = legsize*chartWidth*0.017; //

    document.getElementById('tx0').innerText = " " + document.getElementById('x0range').value;
    document.getElementById('ty0').innerText = " " + document.getElementById('y0range').value;
    document.getElementById('tfsize').innerText = " " + document.getElementById('legsizerange').value;
    document.getElementById('tratio').innerText = parseFloat(document.getElementById('ratiorange').value).toFixed(2);
}

//
var styles = { "rect":0,  "rectl":1,  "line":2,  "linev":3,  "rectv":4,  "rectvl":5 };
var styles_mapping = {
    0 : [1, 0, 1, 1, 0, 0],  // |-- (.) --|
    1 : [1, 0, 1, 0, 0, 0],  // |   (.)   |
    2 : [1, 1, 1, 0, 0, 0],  // |  [(.)]  |
    3 : [1, 1, 1, 1, 0, 0],  // |--[(.)]--|
    4 : [0, 1, 1, 1, 0, 0],  // |--[ . ]--|
    5 : [0, 1, 1, 0, 0, 0],  // |  [ . ]  |
    6 : [0, 0, 1, 0, 1, 0],  // | (  .  ) |
    7 : [0, 0, 1, 1, 1, 0],  // | (--.--) |
    8 : [0, 0, 1, 1, 1, 1],  // |[(--.--)]|
    9 : [0, 0, 1, 0, 1, 1],  // |[(  .  )]|
    10 : [0, 0, 1, 0, 0, 1], // |[   .   ]|
    11 : [0, 0, 1, 1, 0, 1]  // |[ --.-- ]|
};
var changetonext = function(idd) {
    function next(i) {
        if(document.getElementById('xvariable').value != "Npart")
            return (parseInt(i)+1) % Object.keys(styles_mapping).length; 
        else
        {
            if(parseInt(i) == 1) return 2;
            else if(parseInt(i) == 2) return 5;
            else if(parseInt(i) == 5) return 6;
            else return 1;
        }
    }
    // console.log(document.getElementById(idd).value, ', ', next(document.getElementById(idd).value))
    document.getElementById(idd).value = next(document.getElementById(idd).value);
    
}
function checkandremove(id) { if( document.getElementById(id) ) { document.getElementById(id).remove(); } }
var drawornot = function(da, name) { return styles_mapping[document.getElementById('display_'+da).value][styles[name]]; }
var shadowopacity = 0.12;
var stroke_width = function() { return width/100.*0.28; }
var stroke_width_axis = function() { return width/100.*0.23; }

var xoverflow = function(x)
{
    var val = Math.min(x, chartWidth);
    val = Math.max(val, 0);
    return val;
}
var yoverflow = function(y)
{
    var val = Math.min(y, chartHeight);
    val = Math.max(val, 0);
    return val;
}
var xthrow = function(x)
{
    if(x >=0 && x <= chartWidth) return x;
    else return 0-chartWidth*2;
}
var ythrow = function(y)
{
    if(y >=0 && y <= chartHeight) return y;
    else return 0-chartHeight*2;
}

var addaxistitle = function(xtitle, ytitle) {
    var titlesize = width/23.,
        subsize = titlesize*0.6,
        subshift = "-40%",
        supshift = "60%";
    // xtitle
    if(document.getElementById('xvariable').value === "pT")
    {
        xtitle.append('tspan').style('font-size', titlesize)
            .text('p')
            .append('tspan').style('font-size', subsize).attr('baseline-shift', subshift)
            .style('font-size', subsize).attr('baseline-shift', subshift)
            .text('T');
        xtitle.append('tspan').style('font-size', titlesize)
            .text(' (GeV/c)');
    }
    else if(document.getElementById('xvariable').value === "y")
    {
        xtitle.append('tspan').style('font-size', titlesize)
            .text('y')
            .append('tspan').style('font-size', subsize).attr('baseline-shift', subshift)
            .text('CM');
    }
    else if(document.getElementById('xvariable').value === "absy")
    {
        xtitle.append('tspan').style('font-size', titlesize)
            .text('|y')
            .append('tspan').style('font-size', subsize).attr('baseline-shift', subshift)
            .text('CM');
        xtitle.append('tspan').style('font-size', titlesize)
            .text('|');
    }
    else if(document.getElementById('xvariable').value === "cent")
    {
        xtitle.append('tspan').style('font-size', titlesize)
            .text('Centrality');
    }
    else if(document.getElementById('xvariable').value === "Npart")
    {
        xtitle.append('tspan').style('font-size', titlesize)
            .text(decodehtml('&#10216;N'))
            .append('tspan').style('font-size', subsize).attr('baseline-shift', subshift)
            .text('part');
        xtitle.append('tspan').style('font-size', titlesize)
            .text(decodehtml('&#10217;'));
    }
    else if(document.getElementById('xvariable').value === "Ncoll")
    {
        xtitle.append('tspan').style('font-size', titlesize)
            .text(decodehtml('&#10216;N'))
            .append('tspan').style('font-size', subsize).attr('baseline-shift', subshift)
            .text('coll');
        xtitle.append('tspan').style('font-size', titlesize)
            .text(decodehtml('&#10217;'));
    }

    // ytitle
    if(document.getElementById('observable').value === "Ratio")
    {
        ytitle.append('tspan').style('font-size', titlesize)
            .text('Yield ratio');
    }
    else if(document.getElementById('observable').value.startsWith("R"))
    {
        ytitle.append('tspan').style('font-size', titlesize)
            .text('R')
            .append('tspan').style('font-size', subsize).attr('baseline-shift', subshift)
            .text(document.getElementById('observable').value.substring(1));
    }
    else if(document.getElementById('observable').value.startsWith("v"))
    {
        ytitle.append('tspan').style('font-size', titlesize)
            .text('v')
            .append('tspan').style('font-size', subsize).attr('baseline-shift', subshift)
            .text(document.getElementById('observable').value.substring(1));
    }
    else if(document.getElementById('observable').value === "LcToD0")
    {
        ytitle.append('tspan').style('font-size', titlesize)
            .text(decodehtml('&Lambda;'))
            .append('tspan').style('font-size', subsize).attr('baseline-shift', subshift)
            .text('c');
        ytitle.append('tspan').style('font-size', titlesize)
            .text(' / D')
            .append('tspan').style('font-size', subsize).attr('baseline-shift', supshift)
            .text('0');
    }
    else if(document.getElementById('observable').value === "DoubleRatio") // improvable if one can access the yield ratio name
    {
        ytitle.append('tspan').style('font-size', titlesize)
            .text('(Yield ratio)')
            .append('tspan').style('font-size', subsize).attr('baseline-shift', subshift)
            .text('AA');
        ytitle.append('tspan').style('font-size', titlesize)
            .text(' / (Yield ratio)')
            .append('tspan').style('font-size', subsize).attr('baseline-shift', subshift)
            .text('pp');
    }
}

var checklogx = function()
{
    return (document.getElementById('logx').value == 1);
}

var checklogy = function()
{
    return (document.getElementById('logy').value == 1);
}

function changerangewlog()
{
    var iiobs = iobs(document.getElementById('observable').value),
        iivar = ivar(document.getElementById('xvariable').value);
    if(checklogx() && xmin <= 0)
    {
        xmin = iivar.pxmin_log;
        document.getElementById('pxmin').value = xmin;
    }
    if(checklogx() && xmax <= 0)
    {
        xmax = 1;
        document.getElementById('pxmax').value = xmax;
    }
    if(checklogy() && ymin <= 0)
    {
        ymin = iiobs.pymin_log;
        document.getElementById('pymin').value = ymin;
    }
    if(checklogy() && ymax <= 0)
    {
        ymax = 1;
        document.getElementById('pymax').value = ymax;
    }
}


function settsuptsub(textid)
{
    var childtspan = document.querySelectorAll('#'+textid+' > tspan');
    for (var i = 0; i < childtspan.length; i++) {
        var itspan = childtspan[i];
        if(itspan.classList.contains("tsup"))
        {
            itspan.style.fontSize = "0.6em";
            itspan.style.baselineShift = "60%";
        }
        if(itspan.classList.contains("tsub"))
        {
            itspan.style.fontSize = "0.6em";
            itspan.style.baselineShift = "-50%";
        }
    }
}
