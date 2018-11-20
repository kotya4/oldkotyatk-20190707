
(function(){
  // checks answer correctness (event)
  function check(right) {
    // checks every input
    for (let y = 0; y < right.length; ++y) {
      for (let x = 0; x < right[y].length; ++x) {
        const el = document.getElementById(`mat-${y}-${x}`);
        const v1 = right[y][x];
        const v2 = 0 | el.value;
        // changes input color
        el.style.backgroundColor = v1 === v2 ? 'green' : 'red';
  } } }
  // window onload event listener
  window.addEventListener('load', function onload() {
    // if checkout-button exists ..
    const checkout = document.getElementById('checkout');
    if (checkout) {
      // parses raw constant from heroku
      const right = eval(RIGHT_MATRIX_RAW
        .split(/\s/)
        .filter(e => e.length)
        .join()
        .replace(/\]\[/g, '],[')
      ).filter(e => e).map(e => e.filter(e => e));
      // sets event listener
      checkout.addEventListener('click', () => check(right), false);
    }
  }, false);
})();