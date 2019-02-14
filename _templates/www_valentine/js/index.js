
function onload() {
  let cvs = document.getElementById('canvas');
  if (!cvs) {
    cvs = document.createElement('canvas');
    document.body.appendChild(cvs);
  }
  cvs.width = 800;
  cvs.height = 600;
  const ctx = cvs.getContext('2d');

  const offset_x = cvs.width / 2;
  const offset_y = cvs.height / 2;
  const radius = 200;

  const stroke_codrioid = (points_number, factor, angle) => {
    ctx.save();
    ctx.translate(offset_x, offset_y);

    const points = [...Array(points_number)].map((_, i) => [
      Math.sin(2 * Math.PI / points_number * i + angle) * radius,
      Math.cos(2 * Math.PI / points_number * i + angle) * radius,
    ]);

    ctx.beginPath();
    ctx.moveTo(...points[points.length - 1]);
    points.forEach(e => ctx.lineTo(...e));

    for (let i = 2; i < points_number - 1; ++i) {
      ctx.moveTo(...points[i % points_number]);
      ctx.lineTo(...points[~~(i * factor) % points_number]);
    }

    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'white';
  ctx.font = '24px Courier New';

  let points_number = 3;
  let factor = 2;
  let angle = 0;
  let dangle = 0;
  setInterval(() => {
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    stroke_codrioid(~~points_number, factor, angle);
    ctx.strokeText('с днём святого валентина', 225, 550);
    if (points_number < 250) {
      points_number *= 1.02;
    } else {
      factor += 0.03;
      if (factor > 5 && dangle < 0.05) dangle += 0.001;
      angle += dangle;
    }
  }, 60);
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
