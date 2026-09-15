// légères particules d'embrasement qui remontent — commun à toutes les pages
(function(){
  const canvas = document.getElementById('embers');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', resize);
  resize();

  const COLORS = ['200,60,50', '224,90,40', '160,40,40'];
  const COUNT = window.innerWidth < 700 ? 12 : 22;
  const particles = [];

  function spawn(p){
    p.x = Math.random() * w;
    p.y = h + Math.random() * 60;
    p.r = 0.6 + Math.random() * 1.4;
    p.speed = 0.25 + Math.random() * 0.55;
    p.drift = (Math.random() - 0.5) * 0.4;
    p.wobble = Math.random() * Math.PI * 2;
    p.wobbleSpeed = 0.01 + Math.random() * 0.02;
    p.life = 0;
    p.maxLife = h / p.speed * (0.85 + Math.random() * 0.3);
    p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    p.baseAlpha = 0.16 + Math.random() * 0.22;
  }

  for(let i=0;i<COUNT;i++){
    const p = {};
    spawn(p);
    p.y = Math.random() * h;
    p.life = Math.random() * p.maxLife;
    particles.push(p);
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.life += 1;
      p.wobble += p.wobbleSpeed;
      p.y -= p.speed;
      p.x += p.drift + Math.sin(p.wobble) * 0.3;

      const lifeRatio = p.life / p.maxLife;
      let alpha = p.baseAlpha;
      if(lifeRatio < 0.12) alpha *= lifeRatio / 0.12;
      else if(lifeRatio > 0.75) alpha *= Math.max(0, 1 - (lifeRatio - 0.75) / 0.25);

      if(p.y < -20 || p.life >= p.maxLife){
        spawn(p);
        continue;
      }

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      grad.addColorStop(0, `rgba(${p.color},${alpha})`);
      grad.addColorStop(1, `rgba(${p.color},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255,220,190,${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
