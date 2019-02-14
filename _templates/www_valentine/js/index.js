
function onload() {
  let cvs = document.getElementById('canvas');
  if (!cvs) {
    cvs = document.createElement('canvas');
    document.body.appendChild(cvs);
  }
  cvs.width = 400;
  cvs.height = 300;
  const ctx = cvs.getContext('2d');

  const offset_x = 200;
  const offset_y = 150;
  const radius = 75;

  const stroke_codrioid = (points_number) => {
    ctx.save();
    ctx.translate(offset_x, offset_y);

    const points = [...Array(points_number)].map((_, i) => [
      Math.sin(2 * Math.PI / points_number * i) * radius,
      Math.cos(2 * Math.PI / points_number * i) * radius,
    ]);

    ctx.beginPath();
    ctx.moveTo(...points[points.length - 1]);
    points.forEach(e => ctx.lineTo(...e));

    for (let i = 2; i < points_number - 1; ++i) {
      ctx.moveTo(...points[i % points_number]);
      ctx.lineTo(...points[(i * 2) % points_number]);
    }

    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'white';

  let points_number = 1;
  setInterval(() => {
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    stroke_codrioid(++points_number);
    ctx.strokeText('с днём святого валентина', 140, 250);
  }, 150);
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
('www_valentine/js/', [

]);
