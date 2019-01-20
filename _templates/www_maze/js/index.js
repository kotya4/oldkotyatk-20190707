
function onload() {
  const ctx = U.canvas(600, 400);
  const depth = 1;  // trip depth
  const rnum = 100;  // radius (height)
  const anum = 200; // angles (width)
  const maze = Maze(rnum * depth, anum, 0);
  const or = 4;    // radius offset
  const oa = Math.PI * 2 / anum;
  const ox = ctx.canvas.width / 2 | 0;
  const oy = ctx.canvas.height / 2 | 0;
  let di = 0;       // depth index
  let dr = 0;       // radius delta
  let rs = 1;       // radius speed
  let rot = 0;      // rotation
  let rts = 0.001;  // rotation speed
  setInterval(() => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let ri = rnum - 1; ri > 1; --ri) {
      const r = ri * or;
      const alpha = r / (rnum * or) - 0.08;
      ctx.strokeStyle = `rgba(200,200,200,${alpha})`;  
      ctx.beginPath();
      for (let ai = 0; ai < anum; ++ai) {
        const a = oa * ai + rot;
        const [x1, y1] = U.cartesian(dr + r, a);
        const [x2, y2] = maze.map[(ri + di) % maze.map.length][ai]
          ? U.cartesian(dr + r - or, a)
          : U.cartesian(dr + r, a + oa);
        ctx.moveTo(ox + x1, oy + y1);
        ctx.lineTo(ox + x2, oy + y2);
      }
      ctx.stroke();
    }
    rot += rts;
    if ((dr -= rs) <= -or) {
      dr = 0;
      ++di;
    }
  }, 50);
}
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
('www_maze/js/', [
  'utils.js',
  'maze.js',
]);
