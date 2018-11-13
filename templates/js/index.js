
(function() {
  //console.log('\n'.charCodeAt(0));
  function onload() {
    const cvs = document.getElementsByClassName('canvas')[1];
    const ctx = cvs.getContext('2d');

    const cvs_slow = document.getElementsByClassName('canvas')[0];
    const ctx_slow = cvs_slow.getContext('2d');

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

      cvs_slow.style.width = cvs.style.width;
      cvs_slow.style.height = cvs.style.height;
      cvs_slow.width = cvs.width;
      cvs_slow.height = cvs.height;
      ctx_slow.imageSmoothingEnabled = false;
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
        new px.Platform(0, cvs.width, 0, { transparent: true, ceiling: true }),
        new px.Platform(0, cvs.width, cvs.height, { transparent: true }),

        new px.Platform(0, cvs.width, cvs.height - 10),

        // chamber for crazy
        new px.Platform(200, 250, 30, { ceiling: true }),
        new px.Platform(200, 250, 50, { ceiling: true }),

      ];

      const walls = [
        new px.Wall(0, 0, cvs.height, { transparent: true }),
        new px.Wall(cvs.width, 0, cvs.height, { transparent: true }),
        

        // chamber for crazy
        new px.Wall(200, 30, 50),
        new px.Wall(250, 30, 50),


      ];

      const pixel = new px.Creature({
        position: { x: 220, y: 80 },
        platforms: platforms,
        walls: walls,
        color: 'red',
      });


      const crazy = new px.Creature({
        position: { x: 220, y: 40 },
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


      const golem_city = new px.GolemCity({
        boundaries: [cvs.width, cvs.height],
        center: [cvs.width * 2 / 3, cvs.height - 10],
      });


      const canvas = new px.Canvas();
      
      canvas.render_fast((ctx, elapsed) => {
        // proc
        if (kb.left) pixel.accelerate(-1);
        if (kb.right) pixel.accelerate(+1);
        if (kb.jump) pixel.jump();
        pixel.proc(elapsed);
        const crazy_key = crazy_get_key();
        if (crazy_key === 'left') crazy.accelerate(-1);
        if (crazy_key === 'right') crazy.accelerate(+1);
        if (crazy_key === 'jump') crazy.jump();
        crazy.proc(elapsed);
        // draw
        pixel.draw(ctx);
        crazy.draw(ctx);
      });

      canvas.render_slow((ctx, elapsed) => {
        // proc
        flying_figure.proc(elapsed);
        box.rotate(elapsed);
        // draw
        platforms.forEach(e => e.draw(ctx));
        walls.forEach(e => e.draw(ctx));
        golem_city.draw(ctx);
        ctx.fillStyle = 'white';
        flying_figure.draw(ctx);
        box.draw(ctx);
        ctx.fillStyle = 'white';
        px.utils.text.print(ctx, `${canvas.get_fps()}`, 5, 5);
        px.utils.text.print(ctx, 'Привет, мой воздушный мир,\nсотканный из приключений.', 30, 10);
      });

      canvas.exec();

      let fps = 0; /*
      let elapsed_time = 0;
      let old_time = 0;
      (function render(time) {
        elapsed_time += time - old_time | 0;
        old_time = time;
        fps = 1000 / elapsed_time | 0;
        if (elapsed_time >= 15) {
          elapsed_time = 0;
          const elapsed = 20;

          ctx.clearRect(0, 0, cvs.width, cvs.height);

 
          
          
          

          

          px.utils.text.print(ctx, ''+time, 252, 30);
          //px.utils.text.print(ctx, 'Привет, мой воздушный мир,\nсотканный из приключений.', 10, 80);
          //px.utils.text.test(ctx);
          

          if (kb.left) pixel.accelerate(-1);
          if (kb.right) pixel.accelerate(+1);
          if (kb.jump) pixel.jump();
          pixel.proc(elapsed);
          pixel.draw(ctx);

          
        }
        window.requestAnimationFrame(render);
      })();
      */

      /*
      // render slow
      setInterval(() => {
        const ctx = ctx_slow;
        const cvs = cvs_slow;
        const elapsed = 500;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        platforms.forEach(e => e.draw(ctx));
        walls.forEach(e => e.draw(ctx));
        
        golem_city.draw(ctx);
        
        ctx.fillStyle = 'white';
        flying_figure.proc(elapsed);
        flying_figure.draw(ctx);

        box.rotate(elapsed);
        box.draw(ctx);

        ctx.fillStyle = 'white';
        px.utils.text.print(ctx, `${fps}`, 5, 5);

      }, 500);
      */
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