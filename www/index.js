window.onload = function() {

  setTimeout(()=>load_external_file('cat-ascii.txt', r=>run_logo_cat(r)),3000);

  const ctx = document.getElementById('canvas').getContext('2d');
  ctx.canvas.width = 300;
  ctx.canvas.height = 200;
  (new Walls({
    width: ctx.canvas.width, 
    height: ctx.canvas.height, 
    depth: 10
  })).demo(ctx);
}

function load_external_file(url, func) {
  const a = new XMLHttpRequest();
  a.open('GET', url);
  a.send();
  a.onreadystatechange = function() {
    if (a.readyState === 4 && a.status === 200) {
      func(a.responseText);
    }
  };
}

function run_logo_cat(r) {
  const str = r
    .split('\n')
    .map(e => e
      .slice(1, -1)
      .slice(1, 30) + ' '
        .repeat(e.length < 32 ? 32 - e.length : 0));
  
  let k = 1;
  const walk = [...Array(5)].map(e => e = [...str.slice(k + 1, k += 10)]);
  const stretch = [...Array(4)].map(e => e = [...str.slice(k + 1, k += 10)]);
  
  function alter(o, flag = true) {
    if (!flag) {
      return o;
    }
    let s = '';
    for (let i in o) {
      const c = o[o.length - 1 - i];
      switch (c) {
      case '\\': s += '/'; break;
      case '/': s += '\\'; break;
      default: s += c;
      }
    }
    return s;
  }

  const main = document.getElementsByClassName('main')[0];
  const logo_cat = document.getElementsByClassName('logo-cat')[0];
  const logo_text = document.getElementsByClassName('logo-text')[0];
  const logo_info = document.getElementsByClassName('logo-info')[0];
  
  const fsize = window.getComputedStyle(logo_cat, null) // font width
      .getPropertyValue('font-size').slice(0, -2) | 0;
  const plen = (main.offsetWidth - logo_text.offsetLeft // path length 
      - logo_text.offsetWidth) / fsize | 0;
  
  let spos = (Math.random() * 2 | 0) // stretching position
      ? (15 + (Math.random() * (plen - 30)) | 0) : -1; 
  let body_i = 0; // index
  let body_s = 0; // size
  let pos = 0; // position
  let stretching = true; // stretch flag
  let stretch_delay = 0; // stretch delay
  let iid = null;

  function terminate_the_cat() {
    window.removeEventListener('resize', terminate_the_cat);
    logo_info.style.display = 'block';
    logo_cat.style.display = 'none';
    if (null !== iid) {
      clearInterval(iid);
      iid = null;
    }
  };
  window.addEventListener('resize', terminate_the_cat);

  iid = setInterval(function() {
    let body_str = '';
    if (body_s >= 30) {
      logo_info.style.display = 'block';
      if (pos !== spos) {
        ++pos;
      } else {
        if (stretch_delay === 0) {
          body_i = 0;
          ++stretch_delay;
        } else if (stretching) {
          ++body_i;
          if (body_i + 1 === stretch.length) {
            stretching = false;
          }
        } else if (stretch_delay < 15) {
          ++stretch_delay;
        } else {
          --body_i;
          if (body_i === 0) {
            spos = -1;
          }
        }
        logo_cat.innerHTML = `<pre>${stretch[body_i]
            .map(e=>alter(e)).join('\n')}</pre>`;
        return;
      }
      logo_cat.style.right = (pos * fsize) + 'px';
      if (pos >= plen) {
        terminate_the_cat();
      }
    }
    body_s += 2;
    body_i = (body_i + 1) % walk.length;
    logo_cat.innerHTML = `<pre>${walk[body_i]
        .map(e=>alter(e).slice(0,body_s)).join('\n')}</pre>`;
  }, 100);
}
