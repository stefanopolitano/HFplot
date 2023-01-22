function filtermatch(idd)
{
    var input = document.getElementById('filterinput').value.toLowerCase();

    var findmatch = idd;
    if(idd.indexOf("psi") > -1) // quarkonia
    {
        findmatch += " quarkonium quarkonia hidden closed";
        if(idd.indexOf("upsilon") > -1)
            findmatch += " bottomonium bottomonia beauty";
        else
            findmatch += " charmonium charmonia";
    }
    else if(idd.indexOf("toe_") > -1 || idd.indexOf("tomu_") > -1) // semileptonic
    {
        findmatch += " semileptonic";
    }
    else if(idd.indexOf("ks0") > -1 || idd.indexOf("light") > -1) // light
        findmatch += " light";
    else // open
    {
        findmatch += " open";
        if(idd.indexOf("lambda") > -1)
            findmatch += " baryon";
        if(idd.indexOf("bplus") > -1 || idd.indexOf("bsubs") > -1 || idd.indexOf("b0") > -1 || idd.indexOf("bc") > -1)
            findmatch += " beauty"
    }        
    if(idd.indexOf("bto") > -1)
        findmatch += " nonprompt beauty";
    let re = /cent-([0-9]+)-([0-9]+)/;
    findmatch = findmatch.replace(re, 'cent-$1-$2%');

    if(input == "" || findmatch.indexOf(input) > -1) { return true; }
    else { return false; }
}

function keyfilter()
{
    var lines = document.getElementById('datainput').getElementsByTagName('tr');
    var btncheck = document.getElementById('btncheckedonly');
    for(var i=0; i<lines.length; i++)
    {
        var da = lines[i].id.replace('tr_', '');
        if(filtermatch( lines[i].id.toLowerCase() ) &&
           (btncheck.value == 0 || checkb(da)))
            lines[i].style.display = "";
        else
            lines[i].style.display = "none";        
    }
}

function checkedonly()
{
    var lines = document.getElementById('datainput').getElementsByTagName('tr');
    var btncheck = document.getElementById('btncheckedonly');
    btncheck.value = 1 - btncheck.value;

    btncheck.style.backgroundColor = (btncheck.value == 1?"#0072D0":"#f5f5f5");
    btncheck.style.color = (btncheck.value == 1?"white":"black");
    
    for(var i=0; i<lines.length; i++)
    {
        var da = lines[i].id.replace('tr_', '');
        if(filtermatch( lines[i].id.toLowerCase() ) &&
           (btncheck.value == 0 || checkb(da)))
            lines[i].style.display = "";
	else
            lines[i].style.display = "none";
    }
}
