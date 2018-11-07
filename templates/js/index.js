


function Platform(_x1, _x2, h, args = {}) {
  function arg(key, def) {
    if (key in args) return args[key];
    else if (undefined !== def) return def;
    throw(`Argument has no default value for key '${key}'.`);
  }

  const x1 = _x1 < _x2 ? _x1 : _x2;
  const x2 = _x1 < _x2 ? _x2 : _x1;
  const transparent = arg('transparent', false);
  const ceiling = arg('ceiling', false);

  const colors = [ '#800000', '#008000', '#808000', '#000080', '#800080', '#008080', '#c0c0c0', ];

  function is_near_by(x, y, size) {
    if (x > x1 - size && x < x2)
      if (y > h && y - size < h)
        return true;
    return false;
  }

  function is_near_by_ceiling(x, y, size, from_what_side) {
    if (ceiling && x > x1 - size && x < x2) {
      if (from_what_side < 0 && y > h && y - size < h) // from down
        return true;
    }
    return false;
  }

  function draw(ctx) {
    if (transparent) return;
    ctx.strokeStyle = 'white';//colors[Math.random() * colors.length | 0];
    ctx.beginPath();
    ctx.moveTo(x1, h);
    ctx.lineTo(x2, h);
    ctx.stroke();
  }

  this.is_near_by_ceiling = is_near_by_ceiling;
  this.is_near_by = is_near_by;
  this.draw = draw;
  this.height = h;
}


function Wall(w, _y1, _y2, args = {}) {
  function arg(key, def) {
    if (key in args) return args[key];
    else if (undefined !== def) return def;
    throw(`Argument has no default value for key '${key}'.`);
  }

  const y1 = _y1 < _y2 ? _y1 : _y2;
  const y2 = _y1 < _y2 ? _y2 : _y1;
  const transparent = arg('transparent', false);

  const colors = [ '#800000', '#008000', '#808000', '#000080', '#800080', '#008080', '#c0c0c0', ];

  function is_near_by(x, y, size, from_what_side) {
    if (y >= y1 && y <= y2) {
      if (x < w && x + size > w)
          return true;

      if (from_what_side > 0) { // from left
        if (x < w && x + size + size / 2 > w)
          return true;
      } else { // from right
        if (x - size / 2 < w && x + size > w)
          return true;
      }
    }
    return false;
  }

  function draw(ctx) {
    if (transparent) return;
    ctx.strokeStyle = colors[Math.random() * colors.length | 0];
    ctx.beginPath();
    ctx.moveTo(w, y1);
    ctx.lineTo(w, y2);
    ctx.stroke();
  }

  this.is_near_by = is_near_by;
  this.width = w;
  this.draw = draw;
}


function Pixel(args) {
  function arg(key, def) {
    if (key in args) return args[key];
    else if (undefined !== def) return def;
    throw(`Argument has no default value for key '${key}'.`);
  }

  const colors = arg('colors', [ '#800000', '#008000', '#808000', '#000080', '#800080', '#008080', '#c0c0c0', ]);
  const size = 9;
  const pos = arg('pos');                     // position
  const spd = { x: 0, y: 0 };                 // speed
  const acc = { x: 0.03, y: 0.01 };           // acceleration (const)
  const inh = { x: 0.015, y: 0.008 };         // inhibition (const)
  const max_spd = { x: 0.15, y: 0.5 };         // max speed (const)
  const jump_strength = 0.17;
  const platforms = arg('platforms');
  const walls = arg('walls');
  let falling = false;
  let accelerating = false;
  let jumping = false;
  let acc_echo = 0; // last non-zero spd.x value (in porc. walls)

  function proc_gravity() {
    if (spd.y < 0) return; // no need to proc gravity if entity jumps up
    const on_platform = platforms.find(e => e.is_near_by(pos.x, pos.y, size));
    if (on_platform) {
      if (falling) {
        jumping = false;
        falling = false;
        spd.y = 0;
        pos.y = on_platform.height;
      }
    } else {
      falling = true;
      if (spd.y < max_spd.y) spd.y += acc.y;
    }
  }

  function proc_moving(e) {
    if (!accelerating && spd.x !== 0) {
      if (spd.x > 0) spd.x -= inh.x;
      else if (spd.x < 0) spd.x += inh.x;
      if (Math.abs(spd.x) <= inh.x) {
        spd.x = 0;
        //pos.x |= 0; // for better drawing
      }
    }
    if (spd.y < 0) {
      spd.y += inh.y;
    }
    accelerating = false;
    pos.x += spd.x * e;
    pos.y += spd.y * e;
    const wall = walls.find(e => e.is_near_by(pos.x, pos.y, size, acc_echo));
    if (wall) {
      pos.x = acc_echo > 0 ? wall.width - size - 1 : wall.width + 1;
      spd.x = 0;
    }
    const ceiling = platforms.find(e => e.is_near_by_ceiling(pos.x, pos.y, size, spd.y));
    if (ceiling) {
      pos.y = ceiling.height + size;
      spd.y = 0;
    }
  }

  function proc(e) {
    proc_gravity();
    proc_moving(e);
  }

  function accelerate(x) {
    accelerating = true;
    if (x > 0 && spd.x < max_spd.x) {
      spd.x += acc.x;
    } else if (x < 0 && spd.x > -max_spd.x) {
      spd.x -= acc.x;
    }
    acc_echo = spd.x;
  }

  function jump() {
    if (!jumping) {
      jumping = true;
      spd.y = -jump_strength;
    }
  }

  function draw(ctx) {
    ctx.fillStyle = colors[Math.random() * colors.length | 0];
    ctx.fillRect(pos.x | 0, pos.y | 0, size, -size);
  }

  this.draw = draw;
  this.proc = proc;
  this.accelerate = accelerate;
  this.jump = jump;
}




function PixelPattern(args) {


}





(function() {
  //console.log('\n'.charCodeAt(0));
  function onload() {
    const cvs = document.getElementsByClassName('canvas')[0];
    const ctx = cvs.getContext('2d');
    const kb = { };

    {
      const width = 640;
      const height = 320;
      const scale = 0.5;
      const ratio = height / width;

      cvs.style.width = `${width}px`;
      cvs.style.height = `${height}px`;
      cvs.width = (width * scale) | 0;
      cvs.height = (cvs.width * ratio) | 0;

      ctx.imageSmoothingEnabled = false;
    }

    {
      const kb_codes = [
        { codes: [68, 39], key: 'right' },
        { codes: [65, 37], key: 'left' },
        { codes: [87, 38], key: 'jump' },
        { codes: [69, 13], key: 'use' },
      ];

      function set(key_code, flg) {
        for (let k of kb_codes) {
          if (k.codes.find(c => c === key_code)) {
            kb[k.key] = flg;
            break;
          }
        }
      }
      
      window.addEventListener('keyup', e => set(e.keyCode, false), false);
      window.addEventListener('keydown', e => set(e.keyCode, true), false);
    }

    {
      const platforms = [
        new Platform(0, cvs.width, 0, { transparent: true, ceiling: true }),
        new Platform(0, cvs.width, cvs.height, { transparent: true }),

        new Platform(0, cvs.width, cvs.height - 10),

        // chamber for crazy
        //new Platform(200, 250, 30, { ceiling: true }),
        //new Platform(200, 250, 50, { ceiling: true }),

      ];

      const walls = [
        new Wall(0, 0, cvs.height, { transparent: true }),
        new Wall(cvs.width, 0, cvs.height, { transparent: true }),
        

        // chamber for crazy
        //new Wall(200, 30, 50),
        //new Wall(250, 30, 50),


      ];

      const pixel = new Pixel({
        pos: { x: 220, y: 80 },
        platforms: platforms,
        walls: walls,
        colors: [ 'red' ],
      });


      const crazy = new Pixel({
        pos: { x: 220, y: 40 },
        platforms: platforms,
        walls: walls,
      });


      const box = new px.RotatingBox();


      const crazy_keys = [
        { key: 'right', min: 100, max: 200, },
        { key: 'left', min: 100, max: 200, },
        { key: 'jump', min: 50, max: 100, },
      ];
      let crazy_current = null;
      function crazy_get_key() {
        if (crazy_current) {
          return crazy_current.key;
        } else {
          crazy_current = crazy_keys[Math.random() * crazy_keys.length | 0];
          const time = crazy_current.min + (Math.random() * crazy_current.max | 0);
          setTimeout(() => { crazy_current = null; }, time);
        }
      }

      const flying_figure = new px.FlyingFigure({
        points_count: 10,
      });

      let fps = 0;
      let elapsed = 0;
      let old_time = Date.now();
      setInterval(() => { fps = 1000 / elapsed | 0; }, 500);
      (function render() {
        const new_time = Date.now();
        elapsed = new_time - old_time;
        old_time = new_time;


        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        //builds.forEach(e => e.draw(ctx));

        /*
        towns.forEach((e) => {
          e.proc(elapsed);
          e.draw(ctx);
        });
        */


        //platforms.forEach(e => e.draw(ctx));
        //walls.forEach(e => e.draw(ctx));
        
        ctx.fillStyle = 'white';
        flying_figure.proc(elapsed);
        flying_figure.draw(ctx);


        /*
        if (kb.left) pixel.accelerate(-1);
        if (kb.right) pixel.accelerate(+1);
        if (kb.jump) pixel.jump();
        pixel.proc(elapsed);
        pixel.draw(ctx);
        
        
        const crazy_key = crazy_get_key();
        if (crazy_key === 'left') crazy.accelerate(-1);
        if (crazy_key === 'right') crazy.accelerate(+1);
        if (crazy_key === 'jump') crazy.jump();
        crazy.proc(elapsed);
        crazy.draw(ctx);
        

        //box.rotate(elapsed);
        box.draw(ctx);

        px.utils.text.print(ctx, 'Let me out!', 252, 30);
        //px.utils.text.print(ctx, 'Привет, мой воздушный мир,\nсотканный из приключений.', 10, 80);
        //px.utils.text.test(ctx);
        */

        ctx.fillStyle = 'white';
        px.utils.text.print(ctx, `${fps}`, 5, 5);

        window.requestAnimationFrame(render);
      })();
    }

    //create a synth and connect it to the master output (your speakers)
    //var synth = new Tone.Synth().toMaster();

    //play a middle 'C' for the duration of an 8th note
    //synth.triggerAttackRelease('C4', '8n');
/*
    const synthB = new Tone.Synth({
      oscillator : {
        type : 'triangle4'
      },
      envelope : {
        attack : 0.4,
        decay : 0.3,
        sustain: 0.2,
        release: 0.2,
      },
      //volume: -0.5,
    }).toMaster();
*/
    //synthB.triggerAttack('C3');

  }


  window.addEventListener('load', onload, false);



  

})();