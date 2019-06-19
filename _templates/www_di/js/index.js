
window.onload = async () => {

  const p = Perlin({ precomuted: true });

  const s = 20;

  const ddata = document.createElement('div');
  ddata.className = 'ddata';
  document.body.appendChild(ddata);

  const ndata = document.createElement('div');
  ndata.className = 'ndata';
  document.body.appendChild(ndata);

  const ctx = document.createElement('canvas').getContext('2d');
  ctx.canvas.width = 220;
  ctx.canvas.height = 100;
  document.body.appendChild(ctx.canvas);

  const cdata = document.createElement('div');
  cdata.className = 'cdata';
  document.body.appendChild(cdata);

  ddata.innerHTML = '@ RAW DATA<br><br>';
  ndata.innerHTML = '@ NORMALIZED DATA<br><br>';
  cdata.innerHTML = '@ Composed DATA<br><br>';

  let ntab = '';
  let dtab = '';

  let maps = [];

  const YY = 20;
  const ZZ = 20;

  for (let x = 0; x < 10; ++x) {
    maps.push([]);
    const dd = [...Array(YY)].map(_ => p.noise(x / s * 2, 0.5, 0.5) * -100 | 0);
    ntab += 'TIME:' + x + '<table>';
    dtab += 'TIME:' + x + '<table>';
    for (let y = 0; y < YY; ++y) {
      maps[x].push([]);
      ntab += '<tr>';
      dtab += '<tr>';
      for (let z = 0; z < ZZ; ++z) {
        let c = (p.noise(x / s, y / s, z / s) + Math.random() * 0.4) * 256 | 0;
        c = Math.abs(c);
        maps[x][y].push(c / 256);
        ctx.fillStyle = `rgb(${c},${c},${c})`;
        //ctx.fillRect(z + x * 11, y, 1, 1);
        ctx.fillRect(z + x * (ZZ + 1), y + YY + 1, 1, 1);
        ntab += '<td>' + ((c / 256 * 100) | 0) / 100 + '</td>';
        dtab += '<td>' + c * dd[y] + '</td>';
      }
      ntab += '</tr>';
      dtab += '</tr>';
    }
    ntab += '</table><br>';
    dtab += '</table><br>';
  }

  ndata.innerHTML += ntab;
  ddata.innerHTML += dtab;

  let max = 0;
  const map = [];
  for (let x = 0; x < 10; ++x) {
    map.push([]);
    for (let y = 0; y < 10; ++y) {
      map[x].push(x + y);
      if (map[x][y] > max) max = map[x][y];
    }
  }

  function draw(m, Y = 0, X = 0) {
    for (let y = 0; y < m.length; ++y) {
      for (let z = 0; z < m[0].length; ++z) {
        const c = m[y][z] * 256 | 0;
        ctx.fillStyle = `rgb(${c},${c},${c})`;
        ctx.fillRect(z + X * (ZZ + 1), y + YY + 1, 1, 1);
      }
    }
  }

  const compose = m => m.reduce((a, c) => a + (c instanceof Array ? compose(c) : c), 0) / m.length;
  const normalize = m => m / max;

  function compose2(maps, depth = 2, normal = 1) {
    let res = [];
    for (let i = 0; i < maps.length - depth; i += depth) {
      let map = maps[i | 0];
      const m2 = [];
      for (let x = 0; x < map.length - depth; x += depth) {
        m2.push([]);
        for (let y = 0; y < map[0].length - depth; y += depth) {
          let _x = x | 0;
          let _y = y | 0;
          m2[m2.length - 1].push(
            (b => {
              for (let i = 0; i < depth; ++i)
                for (let j = 0; j < depth; ++j)
                  if (_x + i < map.length && _y + j < map[0].length)
                    b += normalize(compose([map[_x + i][_y + j]])) * normal;
              return b;
            })(0) / depth
          )
        }
      }
      res.push(m2);
    }
    return res;
  }


  for (let x = 0; x < map.length; ++x) {
    for (let y = 0; y < map[0].length; ++y) {
      map[x][y] /= max;
    }
  }

  let maps2 = compose2(maps, 1.5, 10);
  let maps3 = compose2(maps2, 1.5, 10);
  let iter = 0;

  setInterval(_ => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (iter === 0) for (let i = 0; i < maps2.length; ++i) {
      draw(maps2[i], (YY + 1) * 1, i);
    }
    if (iter === 1) for (let i = 0; i < maps3.length; ++i) {
      draw(maps3[i], (YY + 1) * 2, i);
    }
    if (iter === 2) for (let i = 0; i < maps.length; ++i) {
      draw(maps[i], (YY + 1) * 0, i);
    }
    iter = (iter + 1) % 3;
  }, 2000);

  /*
  for (let i = 0; i < maps2.length; ++i) {
    draw(maps2[i], (YY + 1) * 1, i);
  }

  for (let i = 0; i < maps3.length; ++i) {
    draw(maps3[i], (YY + 1) * 2, i);
  }
  */

  let ctab = '';
  for (let x = 0; x < maps3.length; ++x) {

    ctab += 'TIME: ~~' + (maps.length - (maps.length / (x + 1) | 0)) + '<table>';

    for (let y = 0; y < maps3[0].length; ++y) {

      ctab += '<tr>';
      for (let z = 0; z < maps3[0][0].length; ++z) {

        ctab += '<td>' + maps3[x][y][z] + '</td>';
      }
      ctab += '</tr>';

    }
    ctab += '</table><br>';

  }

  cdata.innerHTML += ctab;


}




