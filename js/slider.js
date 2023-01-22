const on = (...kinds) => (...els) => (fn) =>
      kinds.forEach(kind =>
                    els.forEach(el => el.addEventListener(kind, fn))
                   )

const a = document.getElementById('v2xmin');
const b = document.getElementById('v2xmax');
// const o = document.querySelector('output');
const omin = document.getElementById('pv2xmin');
const omax = document.getElementById('pv2xmax');

on('input', 'mousedown')(a, b)(update);
// 'mousedown' because otherwise you can "lock" the other slider in place at min=max=value

const max = 40;
const min = 0;
const range = max - min + 1; // +1 inclusive

update(); // 1x

// As the user drags on input, update the available range and visual space for both inputs
function update({target} = {}) {
    let pivot; // unless otherwise acted on
    
    if (target === a) {
	if (a.valueAsNumber >= Number(a.max)) {
	    pivot = Math.min(max - 1, Number(a.max) + 1);
        }
    }
    
    if (target === b) {
	if (b.valueAsNumber <= Number(b.min)) {
    	    pivot = Math.max(min, Number(b.min) - 2);
        }
    }
    
    if (pivot != null) {
  	a.max = pivot;
	b.min = pivot + 1;
    }
    
    a.style.flexGrow = stepsIn(a);
    b.style.flexGrow = stepsIn(b);
    
    // Print selected range
    omin.innerText = `${a.value}`;
    omax.innerText = `${b.value}`;
    // o.innerText = `${a.value} - ${b.value}`;
}

// Number of discrete steps in an input range
function stepsIn(el) {
    return Number(el.max) - Number(el.min) + 3;
}
