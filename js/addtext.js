function addtext()
{
    var textfarm = document.getElementById("textfarm");
    var ntext = document.getElementById("btnaddtext").value;
    var itextgroup = document.createElement("div");
    itextgroup.id = "text" + ntext;
    textfarm.appendChild(itextgroup);
    var textsvgid = "text" + ntext + "svg";

    var iminus = document.createElement("i");
    iminus.setAttribute("class", "fa-solid fa-trash-can");
    iminus.setAttribute("style", "margin: 0 0.3rem; cursor: pointer;");
    iminus.setAttribute('onclick', 'document.getElementById("'+itextgroup.id+'").remove(); document.getElementById("'+textsvgid+'").remove();');
    itextgroup.appendChild(iminus);

    var iinput = document.createElement("input");
    iinput.setAttribute('type', 'text');
    iinput.id = "text" + ntext + "content";
    iinput.value = "eg. D<sup>0</sup>, J/&psi;, p<sub>T</sub>";
    iinput.setAttribute('onkeyup', 'changecontent("'+textsvgid+'", this.value)');
    itextgroup.appendChild(iinput);

    var ibold = document.createElement("i");
    ibold.setAttribute("class", "fa-solid fa-bold");
    ibold.setAttribute("style", "margin: 0 0.3rem; cursor: pointer;");
    ibold.setAttribute('onclick', 'switchbold("'+textsvgid+'")');
    itextgroup.appendChild(ibold);

    var iitalic = document.createElement("i");
    iitalic.setAttribute("class", "fa-solid fa-italic");
    iitalic.setAttribute("style", "cursor: pointer;");
    iitalic.setAttribute("style", "margin: 0 0.3rem 0 0; cursor: pointer;");
    iitalic.setAttribute('onclick', 'switchitalic("'+textsvgid+'")');
    itextgroup.appendChild(iitalic);

    var itsize = document.createElement("input");
    itsize.setAttribute('type', 'number');
    itsize.setAttribute('min', '0');
    itsize.setAttribute('onchange', 'changetsize("'+textsvgid+'", this.value)');
    itsize.setAttribute('style', 'width: 4vw;');
    itsize.setAttribute('value', '50');
    itsize.setAttribute('step', '5');
    itsize.id = "text" + ntext + "tsize";
    itextgroup.appendChild(itsize);

    var ifa2 = document.createElement("i");
    ifa2.setAttribute("class", "fa-solid fa-arrows-left-right");
    ifa2.setAttribute("style", "margin: 0 0.3rem;");
    itextgroup.appendChild(ifa2);

    var itx = document.createElement("input");
    itx.setAttribute('type', 'range');
    itx.setAttribute('class', 'slider');
    itx.setAttribute('min', '10');
    itx.setAttribute('max', '99');
    itx.setAttribute('value', '15');
    itx.setAttribute('oninput', 'changetxx("'+textsvgid+'", this.value)');
    itx.id = "text" + ntext + "itx";
    itextgroup.appendChild(itx);

    var ifa3 = document.createElement("i");
    ifa3.setAttribute("class", "fa-solid fa-arrows-up-down");
    ifa3.setAttribute("style", "margin: 0 0.3rem;");
    itextgroup.appendChild(ifa3);

    var ity = document.createElement("input");
    ity.setAttribute('type', 'range');
    ity.setAttribute('class', 'slider');
    ity.setAttribute('min', '10');
    ity.setAttribute('max', '99');
    ity.setAttribute('value', '15');
    ity.setAttribute('oninput', 'changetyy("'+textsvgid+'", this.value)');
    ity.id = "text" + ntext + "ity";
    itextgroup.appendChild(ity);

    addtexttosvg(textsvgid, itx.value, ity.value, itsize.value, iinput.value);
    document.getElementById("btnaddtext").value = parseInt(ntext) + 1;
}

function addtexttosvg(name, xx, yy, tsize, content)
{
    var ttext = svg.append("text")
        .attr("x", getx0(xx))
        .attr("y", gety0(yy))
        .attr("id", name)
        .style("font-size", gettsize(tsize)+"em")
        .style("text-anchor", "start");

    changecontent(name, content);
}

function drawtext(name)
{
    var xx = document.getElementById(name + "itx").value,
        yy = document.getElementById(name + "ity").value,
        tsize = document.getElementById(name + "tsize").value,
        content = document.getElementById(name + "content").value;
    addtexttosvg(name + "svg", xx, yy, tsize, content);
}

function drawalltext()
{
    var children = document.getElementById("textfarm").children;
    for (var i = 0; i < children.length; i++)
    {
        var itext = children[i];
        drawtext(itext.id);
    }
}

function changecontent(name, content)
{
    document.getElementById(name).innerHTML = '';
    var contents = parsescript(content);
    for(var p in contents)
    {
        svg.select('#' + name).append('tspan')
            .attr("class", contents[p].cl)
            .attr("dominant-baseline", "middle")
            .text(decodehtml(contents[p].content));
    }
    settsuptsub(name);
}

function changetsize(name, tsize)
{
    svg.select('#' + name).style("font-size", gettsize(tsize)+"em");
}

function changetxx(name, xx)
{
    svg.select('#' + name).attr("x", getx0(xx));
}

function changetyy(name, yy)
{
    svg.select('#' + name).attr("y", gety0(yy));
}

function switchbold(name)
{
    document.getElementById(name).style.fontWeight = (document.getElementById(name).style.fontWeight=="bold"?"normal":"bold");
}

function switchitalic(name)
{
    document.getElementById(name).style.fontStyle = (document.getElementById(name).style.fontStyle=="italic"?"normal":"italic");
}
