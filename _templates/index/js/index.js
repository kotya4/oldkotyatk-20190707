
function onload() {
  const [walk, stretch] = Puss();
  const main = document.getElementsByClassName('main')[0];
  const logo_cat = document.getElementsByClassName('logo-cat')[0];
  const logo_text = document.getElementsByClassName('logo-text')[0];
  const logo_info = document.getElementsByClassName('logo-info')[0];
  const font_size = window.getComputedStyle(logo_cat, null).getPropertyValue('font-size').slice(0, -2) | 0;
  const path_length = (main.offsetWidth - logo_text.offsetLeft - logo_text.offsetWidth) / font_size | 0;
  let stretch_position = Math.random() < 0.5 ? 15 + Math.random() * (path_length - 30) | 0 : -1;
  let stretch_delay = 0;
  let stretching = true;
  let puss_index = 0;
  let puss_size = 0;
  let puss_pos = 0;
  let interval_id = null;

  window.addEventListener('resize', terminate_the_puss);
  interval_id = setInterval(proc_the_puss, 100);

  function terminate_the_puss() {
    window.removeEventListener('resize', terminate_the_puss);
    logo_info.style.display = 'block';
    logo_cat.style.display = 'none';
    if (null !== interval_id) {
      clearInterval(interval_id);
      interval_id = null;
    }
  }

  function proc_the_puss() {
    if (puss_size >= 30) {
      logo_info.style.display = 'block';
      if (puss_pos !== stretch_position) {
        ++puss_pos;
      } else {
        if (stretch_delay === 0) {
          puss_index = 0;
          ++stretch_delay;
        } else if (stretching) {
          ++puss_index;
          if (puss_index + 1 === stretch.length) {
            stretching = false;
          }
        } else if (stretch_delay < 15) {
          ++stretch_delay;
        } else {
          --puss_index;
          if (puss_index === 0) {
            stretch_position = -1;
          }
        }
        logo_cat.innerHTML = `<pre>${stretch[puss_index].join('\n')}</pre>`;
        return;
      }
      logo_cat.style.right = (puss_pos * font_size) + 'px';
      if (puss_pos >= path_length) {
        terminate_the_puss();
      }
    }
    puss_size += 2;
    puss_index = (puss_index + 1) % walk.length;
    logo_cat.innerHTML = `<pre>${walk[puss_index].map(e => e.slice(0, puss_size)).join('\n')}</pre>`;
  }
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
('index/js/', [
  'puss.js'
]);
