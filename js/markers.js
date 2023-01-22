var marker_size = function() { return width*width/4.e+3; }

var vorders = [20, 24, 21, 25, 33, 27, 22, 26, 29, 30, 34, 28];

var vopt = {
    // Circle
    20 : {
        type : d3.symbolCircle,
        // option : '&#x29F3;',
        option : '&#x25CF;',
        fill : 1,
        offset : [1.1, 0.6, 0.6, 0.6],
        rotate : 0
    },
    24 : {
        type : d3.symbolCircle,
        // option : '&#x29F2;',
        option : '&#x25CB;',
        fill : 0,
        offset : [1.1, 0.6, 0.6, 0.6],
        rotate : 0
    },
    // Square
    21 : {
        type : d3.symbolSquare,
        // option : '&#x29EF;',
        option : '&#x25A0;',
        fill : 1,
        offset : [1.1, 0.6, 0.6, 0.6],
        rotate : 0
    },
    25 : {
        type : d3.symbolSquare,
        // option : '&#x29EE;',
        option : '&#x25A1;',
        fill : 0,
        offset : [1.1, 0.6, 0.6, 0.6],
        rotate : 0
    },
    // Diamond
    33 : {
        type : d3.symbolDiamond,
        // option : '&#x29F1;',
        // option : '&#x29EB;',
        // option : '&#x2B27;',
        option : '&#x2666;',
        fill : 1,
        offset : [1., 0.6, 0.6, 0.5],
        rotate : 0
    },
    27 : {
        type : d3.symbolDiamond,
        // option : '&#x29F0;',
        // option : '&#x25CA;',
        // option : '&#x2B28;',
        option : '&#x2662;',
        fill : 0,
        offset : [1., 0.6, 0.6, 0.5],
        rotate : 0
    },
    // Triangle-up
    22 : {
        type : d3.symbolTriangle,
        // option : '&#x25B4;',
        option : '&#x25B2;',
        fill : 1,
        offset : [0.85, 0.6, 0.5, 0.6],
        rotate : 0
    },
    26 : {
        type : d3.symbolTriangle,
        // option : '&#x25B5;',
        option : '&#x25B3;',
        fill : 0,
        offset : [0.85, 0.6, 0.5, 0.6],
        rotate : 0
    },
    // Star
    29 : {
        type : d3.symbolStar,
        // option : '&#x272D;',
        option : '&#x2605;',
        fill : 1,
        offset : [0.6, 0.6, 0.5, 0.6],
        rotate : 0
    },
    30 : {
        type : d3.symbolStar,
        // option : '&#x272B;',
        option : '&#x2606;',
        fill : 0,
        offset : [0.6, 0.6, 0.5, 0.6],
        rotate : 0
    },
    // Cross
    34 : {
        type : d3.symbolCross,
        option : '&#x271A;',
        fill : 1,
        offset : [1.1, 0.6, 0.6, 0.6],
        rotate : 0
    },
    28 : {
        type : d3.symbolCross,
        option : '&#x2719;',
        // option : '&#x271C;',
        fill : 0,
        offset : [1.1, 0.6, 0.6, 0.6],
        rotate : 0
    },
};
