
async function onload() {
  const wrapper = document.getElementsByClassName('wrapper')[0];

  const images = ImageList();
  await images.load('www_3d/img/', [
    'ground_0.png',
    'build/0.png',
    'build/1.png',
    'build/2.png',
    'roof/0.png',
    'roof/1.png',
    'roof/2.png',
  ]);

  const mat4 = glMatrix.mat4;

  const screen_width = 400;
  const screen_height = 400;

  const projection = mat4.create();
  mat4.perspective(projection, Math.PI / 4, screen_width / screen_height, 0.1, 1000);

  const webgl = WebGL(screen_width, screen_height, projection, wrapper);

  const textures = images.map(e => webgl.create_texture(e));

  const build_textures = [
    null,
    textures.build_0,
    textures.build_1,
    textures.build_2,
  ];

  const roof_textures = [
    null,
    textures.roof_0,
    textures.roof_1,
    textures.roof_2,
  ];

  const vbo_cube = webgl.create_vbo_cube();

  const map = [
    [1, 0, 1, 1, 1, 1],
    [0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1],
  ].map((e, x) => e.map((e, y) => e * (1 + ~~(Math.random() * 3))));

  const radius = 2.5;
  const height = 2.0;


  let rotation = 0;
  setInterval(() => {
    webgl.clear();

    /*
    const modelview = mat4.create();
    mat4.translate(modelview, modelview, [0, 0, -30]);
    mat4.rotateX(modelview, modelview, Math.PI / 6);
    mat4.rotateY(modelview, modelview, rotation);
    //mat4.translate(modelview, modelview, [0, 0, 0]);
    //mat4.scale(modelview, modelview, [1.0, 1.0, 1.0]);
    vbo_cube.draw('cube', textures.build_0, modelview);
    */

    const modelview = mat4.create();
    mat4.translate(modelview, modelview, [0, 0, -15]);
    mat4.rotateX(modelview, modelview, Math.PI / 6);
    mat4.rotateY(modelview, modelview, rotation);

    for (let x = 0; x < map.length; ++x) for (let y = 0; y < map[0].length; ++y) {
      const pos = [(x - (map.length >> 1)) * radius, height, (y - (map[0].length >> 1)) * radius];

      // ground
      const mv_ground = mat4.create();
      mat4.translate(mv_ground, modelview, pos);
      mat4.scale(mv_ground, mv_ground, [radius / 2, height, radius / 2]);
      mat4.rotateX(mv_ground, mv_ground, Math.PI / 2);
      vbo_cube.draw('plate', textures.ground_0, mv_ground);

      if (map[x][y]) {
        // roof
        const mv_roof = mat4.create();
        mat4.translate(mv_roof, modelview, [pos[0], 3 * height, pos[2]]);
        mat4.scale(mv_roof, mv_roof, [1.0, height, 1.0]);
        mat4.rotateX(mv_roof, mv_roof, Math.PI / 2);
        vbo_cube.draw('plate', roof_textures[map[x][y]], mv_roof);

        // build
        const mv_build = mat4.create();
        mat4.translate(mv_build, modelview, pos);
        mat4.scale(mv_build, mv_build, [1.0, height, 1.0]);
        vbo_cube.draw('box', build_textures[map[x][y]], mv_build);
      }
    }

    rotation += 0.005;
  }, 20);







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
('www_3d/js/', [
  //'mat.js',
  'webgl.js',
  'image-list.js',
  'gl-matrix-min.js',
]);
