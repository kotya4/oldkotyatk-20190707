
px.GolemCity = function(args = {}) {
  const arg = px.utils.create_argument_parser('px.GolemCity', args);

  const spread = 200;
  const origin = { x: cvs.width / 2, y: cvs.height - 10 };
  const sizes = { width: { min: 5, max: 15 }, height: { min: 10, max: 50 } };
  const amount = 30;

  const builds = [...Array(amount)].map((e,i,a) => {
  const width = sizes.width.min + Math.pow(Math.random(), 2) * sizes.width.max | 0;
  const height = sizes.height.min + Math.pow(Math.random(), 2) * sizes.height.max | 0;

  let x, y, z;
  {
    const s = spread - height;//Math.pow(spread / height, 2);
    x = origin.x - s / 2 + Math.random() * s | 0;
    y = cvs.height - 10;
    z = 3;
  }
  
  let color_front, color_side, color_top;
  {
    const r = 10 + Math.random() * 20;
    const g = r + Math.random() * 5;
    const b = r + Math.random() * 5;
    color_front = `rgb(${r},${g},${b})`;
    color_side = `rgb(${r * 2},${g * 2},${b * 2})`;
    color_top = `rgb(${r / 2},${g / 2},${b / 2})`;
  }

  function draw(ctx) {
    ctx.fillStyle = color_front;
    ctx.fillRect(x, y, width, -height);

    ctx.fillStyle = color_side;
    ctx.fillRect(x - z, y, z, -height - z);
    
    ctx.fillStyle = color_top;
    ctx.beginPath();
    ctx.moveTo(x, y - height);
    ctx.lineTo(x + width, y - height);
    ctx.lineTo(x - z + width, y - height - z);
    ctx.lineTo(x - z, y - height - z);
    ctx.fill();

    for (let _x = 1; _x < width - 1; _x += 2) {
      for (let _y = 1; _y < height - 1; _y += 2) {
        const r = Math.random() * 150;
        const g = r;
        const b = Math.random() * 100;
        ctx.fillStyle = `rgb(${r},${r},${b})`;
        ctx.fillRect(x + _x, y - _y, 1, 1);
      }
    }
    

  }

  return { draw };
});


}

