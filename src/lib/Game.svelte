<script>
  import { onMount, tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import { config } from '../config.js';
  import Heart from './Heart.svelte';
  import Bear from './Bear.svelte';

  export let onwin = () => {};
  export let onskip = () => {};
  export let skipAfter = 0;

  const g = config.game;
  const HEART_PATH = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';
  const HEART = typeof Path2D !== 'undefined' ? new Path2D(HEART_PATH) : null;

  let canvas;
  let wrap;
  let mode = 'ready'; // ready | playing | win | lose
  let score = 0;
  let lives = g.nyawa;
  let loses = 0;

  let ctx;
  let raf = 0;
  let W = 320;
  let H = 420;
  let last = 0;
  let t = 0;
  let spawn = 0;
  let items = [];
  let parts = [];
  let pops = [];
  let keys = { left: false, right: false };
  const player = { x: 160, tx: 160, y: 350, r: 32, squash: 0 };
  const stars = Array.from({ length: 28 }, () => ({ x: Math.random(), y: Math.random(), s: 1 + Math.random() * 2, p: Math.random() * 6 }));

  const rain = Array.from({ length: 26 }, (_, i) => ({
    left: Math.random() * 100,
    size: Math.round(14 + Math.random() * 22),
    dur: (2.5 + Math.random() * 2.5).toFixed(2),
    delay: (Math.random() * 3).toFixed(2),
    c: ['#ff4d7d', '#ff8fb1', '#ffd9a0', '#ffb3c8'][i % 4]
  }));

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function resize() {
    if (!wrap || !canvas) return;
    const w = wrap.clientWidth;
    const h = Math.round(Math.max(320, Math.min(w * 1.2, window.innerHeight * 0.58)));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.height = h + 'px';
    W = w;
    H = h;
    player.r = clamp(w * 0.085, 26, 36);
    player.y = H - player.r * 1.95;
    player.x = clamp(player.x, player.r, W - player.r);
    player.tx = player.x;
    ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function start() {
    score = 0;
    lives = g.nyawa;
    items = [];
    parts = [];
    pops = [];
    spawn = 0.3;
    t = 0;
    mode = 'playing';
    last = performance.now();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  async function again() {
    cancelAnimationFrame(raf);
    mode = 'ready';
    await tick();
    resize();
  }

  function loop(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    t += dt;
    update(dt);
    draw();
    if (mode === 'playing') raf = requestAnimationFrame(loop);
  }

  function burst(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 60 + Math.random() * 140;
      parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, life: 0.7 + Math.random() * 0.4, c: color, s: 6 + Math.random() * 8 });
    }
  }

  function update(dt) {
    if (keys.left) player.tx -= 520 * dt;
    if (keys.right) player.tx += 520 * dt;
    player.tx = clamp(player.tx, player.r, W - player.r);
    player.x += (player.tx - player.x) * Math.min(1, dt * 14);
    player.squash = Math.max(0, player.squash - dt * 4);

    spawn -= dt;
    if (spawn <= 0) {
      const level = Math.min(1, score / g.target);
      spawn = 0.8 - level * 0.4 + Math.random() * 0.25;
      const roll = Math.random();
      const type = roll < 0.15 ? 'bad' : roll < 0.22 ? 'gold' : 'heart';
      items.push({
        type,
        x: 26 + Math.random() * (W - 52),
        y: -30,
        vy: 130 + Math.random() * 70 + level * 130,
        size: (type === 'gold' ? 34 : 28) + Math.random() * 6,
        rot: (Math.random() - 0.5) * 0.6,
        vr: (Math.random() - 0.5) * 1.4
      });
    }

    const keep = [];
    for (const it of items) {
      it.y += it.vy * dt;
      it.rot += it.vr * dt;
      const caught = it.y > player.y - player.r * 1.25 && it.y < player.y + player.r * 0.4 && Math.abs(it.x - player.x) < player.r + it.size * 0.25;
      if (caught) {
        player.squash = 1;
        if (it.type === 'bad') {
          lives -= 1;
          burst(it.x, it.y, '#9b6bd1', 12);
          pops.push({ x: it.x, y: it.y - 20, text: 'Aduh!', life: 0.9, c: '#c9a6ff' });
          if (navigator.vibrate) navigator.vibrate(120);
        } else {
          const add = it.type === 'gold' ? 3 : 1;
          score += add;
          burst(it.x, it.y, it.type === 'gold' ? '#ffd166' : '#ff8fb1', 10);
          pops.push({ x: it.x, y: it.y - 20, text: '+' + add, life: 0.8, c: it.type === 'gold' ? '#ffd166' : '#ffd0dc' });
        }
      } else if (it.y < H + 40) {
        keep.push(it);
      }
    }
    items = keep;

    for (const p of parts) {
      p.life -= dt;
      p.vy += 380 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    parts = parts.filter((p) => p.life > 0);
    for (const p of pops) {
      p.life -= dt;
      p.y -= 40 * dt;
    }
    pops = pops.filter((p) => p.life > 0);

    if (score >= g.target) {
      mode = 'win';
      cancelAnimationFrame(raf);
      onwin();
    } else if (lives <= 0) {
      mode = 'lose';
      loses += 1;
      cancelAnimationFrame(raf);
    }
  }

  function drawHeart(x, y, size, rot, fill, glow) {
    if (!HEART) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    const s = size / 24;
    ctx.scale(s, s);
    ctx.translate(-12, -12);
    if (glow) {
      ctx.shadowColor = glow;
      ctx.shadowBlur = 16;
    }
    ctx.fillStyle = fill;
    ctx.fill(HEART);
    ctx.restore();
  }

  function drawBroken(x, y, size, rot) {
    drawHeart(x, y, size, rot, '#6b3a86', '#9b6bd1');
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.3);
    ctx.lineTo(size * 0.1, -size * 0.05);
    ctx.lineTo(-size * 0.08, size * 0.1);
    ctx.lineTo(size * 0.06, size * 0.3);
    ctx.stroke();
    ctx.restore();
  }

  function drawBear() {
    const r = player.r;
    const open = player.squash > 0.4;
    const blink = t % 3.4 < 0.12;
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.scale(1 + 0.14 * player.squash, 1 - 0.14 * player.squash);

    ctx.fillStyle = '#d9a273';
    ctx.beginPath();
    ctx.ellipse(0, r * 1.15, r * 0.8, r * 0.62, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f6dcc0';
    ctx.beginPath();
    ctx.ellipse(0, r * 1.22, r * 0.5, r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    for (const s of [-1, 1]) {
      ctx.fillStyle = '#c98b5e';
      ctx.beginPath();
      ctx.arc(s * r * 0.72, -r * 0.7, r * 0.34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f4b8a0';
      ctx.beginPath();
      ctx.arc(s * r * 0.72, -r * 0.7, r * 0.18, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#d9a273';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f6dcc0';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.3, r * 0.42, r * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4a2c1d';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.12, r * 0.13, r * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();

    for (const s of [-1, 1]) {
      if (blink) {
        ctx.strokeStyle = '#2b170e';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s * r * 0.45 - r * 0.1, -r * 0.14);
        ctx.lineTo(s * r * 0.45 + r * 0.1, -r * 0.14);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#2b170e';
        ctx.beginPath();
        ctx.arc(s * r * 0.45, -r * 0.14, r * 0.11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(s * r * 0.45 + r * 0.04, -r * 0.18, r * 0.04, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = 'rgba(255,143,177,0.75)';
      ctx.beginPath();
      ctx.ellipse(s * r * 0.64, r * 0.26, r * 0.16, r * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (open) {
      ctx.fillStyle = '#8a3b3b';
      ctx.beginPath();
      ctx.ellipse(0, r * 0.5, r * 0.14, r * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = '#4a2c1d';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, r * 0.34, r * 0.16, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }
    ctx.restore();
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    const gr = ctx.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, '#3a0a24');
    gr.addColorStop(1, '#7a1442');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, W, H);

    for (const s of stars) {
      ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.5 + s.p));
      ctx.fillStyle = '#ffe9c9';
      ctx.fillRect(s.x * W, s.y * H, s.s, s.s);
    }
    ctx.globalAlpha = 1;

    for (const it of items) {
      if (it.type === 'bad') drawBroken(it.x, it.y, it.size, it.rot);
      else if (it.type === 'gold') drawHeart(it.x, it.y, it.size, it.rot, '#ffd166', '#ffd166');
      else drawHeart(it.x, it.y, it.size, it.rot, '#ff4d7d', '#ff4d7d');
    }

    for (const p of parts) {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6));
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    drawBear();

    ctx.font = '600 18px Poppins, sans-serif';
    ctx.textAlign = 'center';
    for (const p of pops) {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.5));
      ctx.fillStyle = p.c;
      ctx.fillText(p.text, p.x, p.y);
    }
    ctx.globalAlpha = 1;
  }

  function onPointer(e) {
    if (mode !== 'playing' || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    player.tx = clamp(e.clientX - rect.left, player.r, W - player.r);
  }

  function onKeyDown(e) {
    if (mode !== 'playing') return;
    if (e.key === 'ArrowLeft') { keys.left = true; e.preventDefault(); }
    if (e.key === 'ArrowRight') { keys.right = true; e.preventDefault(); }
  }
  function onKeyUp(e) {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
  }

  onMount(() => {
    resize();
    return () => cancelAnimationFrame(raf);
  });
</script>

<svelte:window on:resize={resize} on:keydown={onKeyDown} on:keyup={onKeyUp} />

<section class="head">
  <p class="eyebrow">Misi kecil</p>
  <h2>Tangkap Cinta</h2>
  <p class="sub">Kumpulkan {g.target} cinta untuk dapat hadiah spesial</p>
</section>

{#if mode === 'win'}
  <section class="reward">
    <div class="rain" aria-hidden="true">
      {#each rain as r}
        <span class="drop" style="left:{r.left}%;width:{r.size}px;height:{r.size}px;animation-duration:{r.dur}s;animation-delay:{r.delay}s;color:{r.c}"><Heart /></span>
      {/each}
    </div>
    <div class="bearwrap">
      <Bear mood="happy" size={150} />
    </div>
    <h3 class="script">Misi selesai!</h3>
    <p class="win">{g.pesanMenang}</p>
    <div class="voucher">
      <span class="vlabel">Hadiah untukmu</span>
      <strong>{g.hadiahJudul}</strong>
      <span class="vtext">{g.hadiahIsi}</span>
    </div>
    <button class="btn ghost again" on:click={again}>Main lagi</button>
  </section>
{:else}
  <section class="card">
    <div class="hud">
      <div class="bar"><span style="width:{Math.min(100, (score / g.target) * 100)}%"></span></div>
      <div class="stat">
        <span class="count">{score}/{g.target}</span>
        <span class="lives">
          {#each Array(g.nyawa) as _, i}
            <span class="life" class:lost={i >= lives}><Heart /></span>
          {/each}
        </span>
      </div>
    </div>

    <div class="arena" bind:this={wrap}>
      <canvas bind:this={canvas} on:pointermove={onPointer} on:pointerdown={onPointer}></canvas>

      {#if mode === 'ready'}
        <div class="overlay" transition:fade={{ duration: 200 }}>
          <Bear mood="happy" size={110} />
          <p class="otitle script">Geser untuk menangkap</p>
          <p class="otext">Tangkap hati merah dan emas. Hindari hati retak ungu.</p>
          <button class="btn" on:click={start}>Mulai</button>
        </div>
      {:else if mode === 'lose'}
        <div class="overlay" transition:fade={{ duration: 200 }}>
          <Bear mood="sad" size={110} />
          <p class="otitle script">Yah, hampir!</p>
          <p class="otext">Skor kamu {score} dari {g.target}. Ayo coba lagi.</p>
          <button class="btn" on:click={start}>Coba lagi</button>
          {#if skipAfter > 0 && loses >= skipAfter}
            <button class="btn ghost skip" on:click={onskip}>Lewati game</button>
          {/if}
        </div>
      {/if}
    </div>
  </section>
{/if}

<style>
  .head { text-align: center; padding: 0 var(--pad); }
  .eyebrow { font-size: 0.72rem; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); }
  h2 { margin-top: 6px; font-size: var(--fs-h2); }
  .sub { margin-top: 6px; font-size: clamp(0.85rem, 0.8rem + 0.25vw, 1.05rem); color: var(--muted); }

  .card {
    max-width: 30rem;
    margin: 22px auto 0;
    padding: 14px;
    border-radius: 24px;
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
    border: 1px solid var(--glass-b);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
    width: calc(100% - 2 * var(--pad));
  }
  .hud { padding: 2px 4px 12px; }
  .bar { height: 10px; border-radius: 999px; background: rgba(255, 255, 255, 0.12); overflow: hidden; }
  .bar span { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, #ff8fb1, #ff4d7d); box-shadow: 0 0 12px rgba(255, 77, 125, 0.8); transition: width 0.3s; }
  .stat { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
  .count { font-weight: 600; font-size: 0.95rem; color: var(--gold); }
  .lives { display: flex; gap: 6px; }
  .life { width: 20px; height: 20px; color: var(--rose); filter: drop-shadow(0 0 6px rgba(255, 77, 125, 0.8)); transition: all 0.3s; }
  .life.lost { color: rgba(255, 255, 255, 0.2); filter: none; transform: scale(0.8); }

  .arena { position: relative; border-radius: 18px; overflow: hidden; }
  canvas { display: block; width: 100%; touch-action: none; cursor: ew-resize; }

  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 16px;
    text-align: center;
    background: rgba(27, 6, 18, 0.72);
    backdrop-filter: blur(4px);
  }
  .otitle { font-size: 1.9rem; color: var(--pink); }
  .skip { margin-top: 6px; padding: 10px 20px; font-size: 0.85rem; }
  .otext { max-width: 250px; margin-bottom: 8px; font-size: 0.85rem; line-height: 1.5; color: var(--muted); }

  .reward {
    position: relative;
    max-width: 30rem;
    margin: 22px auto 0;
    padding: 24px 18px 26px;
    width: calc(100% - 2 * var(--pad));
    text-align: center;
    overflow: hidden;
    border-radius: 24px;
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.05));
    border: 1px solid var(--glass-b);
    box-shadow: 0 0 80px rgba(255, 77, 125, 0.4), 0 24px 60px rgba(0, 0, 0, 0.45);
    animation: rpop 0.8s cubic-bezier(0.2, 1.4, 0.4, 1);
  }
  @keyframes rpop { from { opacity: 0; transform: scale(0.7); } }
  .rain { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .drop { position: absolute; top: -40px; animation: fall linear infinite; opacity: 0.8; }
  @keyframes fall { to { transform: translateY(520px) rotate(40deg); } }
  .bearwrap { position: relative; display: flex; justify-content: center; }
  .reward h3 { position: relative; margin-top: 4px; font-size: 2.4rem; color: #fff; text-shadow: 0 0 24px rgba(255, 77, 125, 0.9); }
  .win { position: relative; margin-top: 4px; font-size: 0.92rem; color: var(--cream); }
  .voucher {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 18px auto 18px;
    padding: 18px 16px;
    border-radius: 18px;
    background: linear-gradient(135deg, #fff4ee, #ffd9e4);
    border: 2px dashed #e11d48;
    color: #4c0519;
    transform: rotate(-2deg);
    animation: vin 0.9s 0.5s cubic-bezier(0.2, 1.6, 0.4, 1) backwards;
  }
  @keyframes vin { from { opacity: 0; transform: translateY(40px) rotate(8deg) scale(0.6); } }
  .vlabel { font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: #e11d48; }
  .voucher strong { font-family: 'Playfair Display', serif; font-size: 1.25rem; line-height: 1.25; }
  .vtext { font-size: 0.82rem; line-height: 1.5; color: #881337; }
  .again { position: relative; }
</style>
