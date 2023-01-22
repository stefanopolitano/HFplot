// http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177
// https://gist.github.com/Rokotyan/0556f8facbaf344507cdc45dc3622177
// https://stackoverflow.com/questions/36303964/save-d3-chart-as-image

d3.select('#saveButton').on('click', function()
                            {
                                var svgString = getSVGString(svg.node());
                                svgString2Image( svgString, 2*width, 2*height, 'png', save );

                                function save( dataBlob, filesize )
                                {
	                            saveAs( dataBlob, 'hinHFplot.png' );
                                }
                            });

function getSVGString( svgNode )
{
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var cssStyleText = getCSSStyles( svgNode );
    // console.log(cssStyleText);
    appendCSS( cssStyleText, svgNode );

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;
    // ======> return;

    function getCSSStyles( parentElement )
    {
	var selectorTextArr = [];

	// Add Parent element Id and Classes to the list
	selectorTextArr.push( '#'+parentElement.id );
	for (var c = 0; c < parentElement.classList.length; c++)
	    if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
		selectorTextArr.push( '.'+parentElement.classList[c] );

	// Add Children element Ids and Classes to the list
	var nodes = parentElement.getElementsByTagName("*");
	for (var i = 0; i < nodes.length; i++)
        {
	    var id = nodes[i].id;
	    if ( !contains('#'+id, selectorTextArr) )
		selectorTextArr.push( '#'+id );

	    var classes = nodes[i].classList;
	    for (var c = 0; c < classes.length; c++)
		if ( !contains('.'+classes[c], selectorTextArr) )
		    selectorTextArr.push( '.'+classes[c] );
	}
        
	// Extract CSS Rules
	var extractedCSSText = "";
	for (var i = 0; i < document.styleSheets.length; i++)
        {
	    var s = document.styleSheets[i];
            if(s.href === null) continue;
            if(!s.href.includes("svg.css")) continue;

	    try {
		if(!s.cssRules) continue;
	    } catch( e ) {
		if(e.name !== 'SecurityError') throw e; // for Firefox
		continue;
	    }

	    var cssRules = s.cssRules;
	    for (var r = 0; r < cssRules.length; r++)
            {
		// if ( contains( cssRules[r].selectorText, selectorTextArr ) ) // will not work with ,
		extractedCSSText += cssRules[r].cssText;
	    }
	}
	
	return extractedCSSText;

	function contains(str,arr) {
	    return arr.indexOf( str ) === -1 ? false : true;
	}

    }

    function appendCSS( cssText, element )
    {
	var styleElement = document.createElement("style");
	styleElement.setAttribute("type","text/css"); 
	styleElement.innerHTML = cssText;
	var refNode = element.hasChildNodes() ? element.children[0] : null;
	element.insertBefore( styleElement, refNode );
    }
}


function svgString2Image( svgString, width, height, format, callback )
{
    var format = format ? format : 'png';

    var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;
    canvas.style = 'background-color: white';

    var image = new Image();
    image.onload = function() {
	context.clearRect ( 0, 0, width, height );
	context.drawImage(image, 0, 0, width, height);

	canvas.toBlob( function(blob) {
	    var filesize = Math.round( blob.length/1024 ) + ' KB';
	    if ( callback ) callback( blob, filesize );
	});

	
    };

    image.src = imgsrc;
}
