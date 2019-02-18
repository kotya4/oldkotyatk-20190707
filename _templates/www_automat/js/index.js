
function onload() {
  const cvs = document.createElement('canvas');
  cvs.width = 400;
  cvs.height = 400;
  document.body.appendChild(cvs);
  const ctx = cvs.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = 'white';

  const rw = 3;
  const rh = 3;
  const ro = 1;
  const ww = ~~(cvs.width / rw);
  const wh = ~~(cvs.height / rh);
  const buffer1 = [...Array(ww)].map(() => [...Array(wh)].map(() => Math.random() > 0.1 ? 1 : 0));
  const buffer2 = [...Array(ww)].map(() => [...Array(wh)]);
  let map = buffer1;
  let buffer = buffer2;

  const draw_map = () => {
    const fill_rect = (e, x, y) => {
      ctx.fillStyle = [
        'black',
        'white',
        'blue',
        'red'
      ][e];
      ctx.fillRect(x * rw, y * rh, rw - ro, rh - ro);
    }
    map.map((e, x) => e.map((e, y) => fill_rect(e, x, y)));
  }

  const logic = (x, y, min, max) => {
    //const min = 2;
    //const max = 3;
    const radius = 1;
    let num = 0;
    for (let ox = 0; ox <= radius * 2; ++ox) for (let oy = 0; oy <= radius * 2; ++oy) {
      let _x = x - radius + ox;
      let _y = y - radius + oy;
      if (_x < 0) _x = map.length + _x; else if (_x >= map.length) _x = _x - map.length;
      if (_y < 0) _y = map[0].length + _y; else if (_y >= map[0].length) _y = _y - map[0].length;
      if (_x === x && _y === y) continue;
      num += map[_x][_y];
    }
    if (num < min || num > max) buffer[x][y] = 0; else buffer[x][y] = 1;
    return num;
  }

  let min = 2;
  let max = 3;
  let inv = false;
  const swap = () => {
    if (map === buffer1) {
      map = buffer2;
      buffer = buffer1;
    } else {
      buffer = buffer2;
      map = buffer1;
    }
  }

  let num = 0;
  setInterval(() => {

    num = 0;

    for (let x = 0; x < map.length; ++x)
      for (let y = 0; y < map[0].length; ++y)
        num += logic(x, y, min, max);

    swap();

    draw_map();

    if (num < 3 || num > 55000 && num < 60000) {
      if (num === 0) {
        map.forEach((e, x) => e.forEach((_, y) => map[x][y] = Math.random() > 0.1 ? 1 : 0));
        return;
      }
      if (!inv) {
        min = 4;
        max = 6;
        inv = true;
      }
    }

    if (inv) {
      if (num < 1500) {
        min = 2;
        max = 3;
        inv = false;
        map.forEach((e, x) => e.forEach((_, y) => map[x][y] = Math.random() > 0.1 ? 1 : 0));
      }
    }


  }, 100);

  //setInterval(() => console.log(num), 1000);
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
('www_automat/js/', [

]);
