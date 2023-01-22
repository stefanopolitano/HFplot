
function clearitems()
{
    var datainput = document.getElementById('datainput');
    while(datainput.firstChild)
    {
        datainput.removeChild(datainput.firstChild);
    }
}

function loaditem(ifsPHENIX = false)
{
    var datainput = document.getElementById('datainput');
    clearitems();
    var obs = document.getElementById('observable').value;
    var xvar = document.getElementById('xvariable').value;

    for(var da in dataset)
    {
        var thisitem = dataset[da];

        var ifdrawx = thisitem.xtitle == xvar ||
            (xvar == "y" && (thisitem.xtitle == "absy" || thisitem.xtitle == "ycm" || thisitem.xtitle == "absycm")) ||
            (xvar == "absy" && (thisitem.xtitle == "absycm")) ||
            false;
        var ifdrawy = thisitem.observable == obs ||
	    (obs == "vn" && (thisitem.observable == "v2" || thisitem.observable == "v3" || thisitem.observable == "v1" || thisitem.observable == "Deltav1")) ||
	    (obs == "RAB" && (thisitem.observable == "RpA" || thisitem.observable == "RAA" || thisitem.observable == "RAB")) ||
	    (obs == "DsToD" && (thisitem.observable == "DsToD0" || thisitem.observable == "DsToDplusmn" || thisitem.observable == "DsToDstar")) ||
	    (obs == "Ratio" && thisitem.observable.includes("To")) ||
            (obs == "DoubleRatio" && thisitem.observable == "DoubleRatio") ||
            false;

        if(!ifdrawx || !ifdrawy || (thisitem.collab === "sPHENIX" && !ifsPHENIX)) { continue; }

        var iline = document.createElement("tr");
        iline.id = "tr_" + da;
        datainput.appendChild(iline);

        var itnew = document.createElement("td");
        itnew.setAttribute('class', 'hideinmobile new');
        let diffday = (new Date().getTime() - new Date(thisitem.update).getTime())/(1000 * 3600 * 24);
        let qmday = (new Date(thisitem.update).getTime() - new Date('2022-04-04').getTime())/(1000 * 3600 * 24);
        // if(qmday > 0 && qmday < 10)
        //     itnew.innerHTML = "QM'22!";
        if(diffday < 120)
            itnew.innerHTML = "New!";
        else
            itnew.innerHTML = "";
        iline.appendChild(itnew);

        var itcheck = document.createElement("td");
        itcheck.innerHTML = '<i class="far fa-square fa-fade" style="--fa-animation-iteration-count: 1; --fa-fade-opacity: 0.5;"></i>';
        itcheck.setAttribute('class', 'checkb');
        itcheck.id = "check_" + da;
        itcheck.alt = 'false';
        iline.appendChild(itcheck);

        if(obs == "vn")
        {
            var itobs = document.createElement("td");
            var iobs = document.createElement("span");
            iobs.innerHTML = thisitem.observable;
            itobs.appendChild(iobs);
            iline.appendChild(itobs);
        }

        var itparticle = document.createElement("td");
        var iparticle = document.createElement("span");
        iparticle.innerHTML = thisitem.particle;
        itparticle.appendChild(iparticle);
        iline.appendChild(itparticle);

        var itcollision = document.createElement("td");
        itcollision.innerHTML = thisitem.collision;
        iline.appendChild(itcollision);

        var itenergy = document.createElement("td");
        itenergy.innerHTML = thisitem.energy;
        iline.appendChild(itenergy);

        var itcollab = document.createElement("td");
        itcollab.innerHTML = thisitem.collab;
        iline.appendChild(itcollab);

        var itcentrality = document.createElement("td");
        itcentrality.innerHTML = thisitem.kinea;
        iline.appendChild(itcentrality);

        var itrapidity = document.createElement("td");
        itrapidity.innerHTML = thisitem.kineb;
        iline.appendChild(itrapidity);

        var itcolor = document.createElement("td");
        iline.appendChild(itcolor);
        var icolor = document.createElement("input");
        icolor.setAttribute('type', 'color');
        icolor.id = "color_" + da;
        icolor.value = "#" + Math.floor(Math.random()*16777215).toString(16);
        icolor.setAttribute('class', 'colorpicker');
        icolor.setAttribute('onchange', "changethis('" + da + "'); ");
        itcolor.appendChild(icolor);
        
        var itmarker = document.createElement("td");
        itmarker.setAttribute('class', 'hideinmobile');
        iline.appendChild(itmarker);
        var imarker = document.createElement("select");
        for(var key of vorders) {
            var opt = document.createElement('option');
            opt.value = key;
            opt.innerHTML = vopt[key].option;
            imarker.appendChild(opt);
        }
        imarker.id = "marker_" + da;
        imarker.setAttribute('class', 'markerpicker');
        imarker.setAttribute('onchange', "changethis('" + da + "'); ");
        imarker.title = "marker styles";
        itmarker.appendChild(imarker);

        var itdisplay = document.createElement("td");
        itdisplay.setAttribute('class', 'hideinmobile');
        iline.appendChild(itdisplay);
        var idisplay = document.createElement("button");
        idisplay.setAttribute('type', 'submit');
        idisplay.id = "display_" + da;
        idisplay.innerHTML = '<i class="fa-solid fa-brush"></i>';
        idisplay.value = '3';
        idisplay.setAttribute('class', 'btnaction');
        idisplay.setAttribute('onclick', "changedisplay('" + da + "');");
        idisplay.title = "display styles";
        itdisplay.appendChild(idisplay);
        
        var itforward = document.createElement("td");
        itforward.setAttribute('class', 'hideinmobile');
        iline.appendChild(itforward);
        var iforward = document.createElement("button");
        iforward.setAttribute('type', 'submit');
        iforward.id = "forward_" + da;
        iforward.innerHTML = '<i class="fa-solid fa-angles-up"></i>';
        iforward.setAttribute('class', 'btnaction');
        iforward.setAttribute('onclick', "drawone('" + da + "');");
        iforward.title = "to front";
        itforward.appendChild(iforward);
        
        itcheck.setAttribute('onclick', "checkthis('"+da+"')");
        itparticle.setAttribute('onclick', "checkthis('"+da+"')");
        itcollision.setAttribute('onclick', "checkthis('"+da+"')");
        itenergy.setAttribute('onclick', "checkthis('"+da+"')");
        itcollab.setAttribute('onclick', "checkthis('"+da+"')");
        itcentrality.setAttribute('onclick', "checkthis('"+da+"')");
        itrapidity.setAttribute('onclick', "checkthis('"+da+"')");
        itnew.setAttribute('onclick', "checkthis('"+da+"')");
    }
    
    keyfilter();
}

var changedisplay = function(da, transt = 400)
{
    changetonext('display_'+da);
    drawdisplay(da, transt);
}

function checkb(da)
{
    return document.getElementById('check_' + da).alt=='true';
}

function swapcheckb(da)
{
    var icheck = document.getElementById('check_' + da);
    if(icheck.alt == 'true')
    {
        icheck.alt = 'false';
        icheck.innerHTML = '<i class="fa-regular fa-square fa-fade" style="--fa-animation-iteration-count: 1; --fa-fade-opacity: 0.5;"></i>';
    }
    else
    {
        icheck.alt = 'true';
        icheck.innerHTML = '<i class="fa-solid fa-square-check fa-beat" style="--fa-animation-iteration-count: 1; --fa-beat-scale: 1.5;"></i>';
    }
}

function checkthis(da)
{
    swapcheckb(da);
    drawone(da);
    legone(da);
    refone(da);
}

function changethis(da)
{
    if(checkb(da))
    {
        changeone(da);
        changeoneleg(da);
        changeoneref(da);
    }
}

