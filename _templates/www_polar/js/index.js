
function onload() {

  function to_polar(x, y) {
    const r = Math.sqrt(x * x + y * y);
    let a = 0;
    // [0; 2pi]
    /*
    if (r !== 0) {
      if (x > 0 && y >= 0) a = Math.atan(y / x);
      else if (x > 0 && y < 0) a = Math.atan(y / x) + 2 * Math.PI;
      else if (x < 0) a = Math.atan(y / x) + Math.PI;
      else if (x === 0 && y > 0) a = Math.PI / 2;
      else if (x === 0 && y < 0) a = 3 * Math.PI / 2;
    }
    */
    // [-pi; +pi]
    a = Math.atan2(y, x);
    return [r, a];
  }

  function to_cartesian(r, a) {
    const x = r * Math.cos(a);
    const y = r * Math.sin(a);
    return [x, y];
  }

  console.log('hello polar');

  const m = [
    '*   * ***** *     *     *****',
    '*   * *     *     *     *   *',
    '***** ***** *     *     *   *',
    '*   * *     *     *     *   *',
    '*   * ***** ***** ***** *****',
  ];

  const ctx = create_canvas(400, 400);
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  let a = 0;
  let c = `rgb(${Math.random() * 255 | 0},${Math.random() * 255 | 0},${Math.random() * 255 | 0})`;
  let rs = 2;

  setInterval(() => {
    
    rs = Math.random() * 5;

    for(;;) {

      a += 0.1;
      //ctx.fillStyle = 'lightgrey';
      //ctx.fillRect(-ctx.canvas.width / 2, -ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height);

      ctx.fillStyle = c; //'black';
      
      for (let y = 0; y < m.length; ++y)
        for (let x = 0; x < m[y].length; ++x)
          if (m[y][x] !== ' ') {
            let p = to_polar(x, y);
            let c = to_cartesian(p[0], p[1] + a);
            //console.log(c);
            ctx.fillRect(c[0] * rs | 0, c[1] * rs | 0, rs - 1, rs - 1);
            //ctx.fillRect(x * rs, y * rs, rs - 1, rs - 1);
          }

      if (a >= 2 * Math.PI) {
        a = a - 2 * Math.PI;
        c = `rgb(${Math.random() * 255 | 0},${Math.random() * 255 | 0},${Math.random() * 255 | 0})`;
        break;
      }


    }

  }, 50);

}

/*
 * Loader
 */
((path, a) => {
  function loadjs(src, async = true) {
    return new Promise((res, rej) => 
      document.head.appendChild(Object.assign(document.createElement('script'), {
        src,
        async,
        onload: _ => res(src),
        onerror: _ => rej(src)
      }))
    )
  }
  Promise.all(a.map(e => loadjs(path + e)))
    .then(_ => window.addEventListener('load', onload))
    .catch(src => console.log(`File "${src}" not loaded`));
})
('www_polar/js/', [
  
]);

/*
 * Useful global functions 
 */
function sample(a) {
  return a[Math.random() * a.length | 0];
}
function alloc(size, fill = null) {
  return [...Array(size[0])].map(() =>  size.length > 1 
    ? alloc(size.slice(1, size.length), fill)
    : fill
  );
}
function last(a) {
  return a[a.length - 1];
}
function create_canvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'lightgrey';
  //ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  return ctx;
}