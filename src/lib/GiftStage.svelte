<script>
  import { fade } from 'svelte/transition';
  import Heart from './Heart.svelte';
  import Lightbox from './Lightbox.svelte';

  export let photos = [];
  export let onopen = () => {};
  export let onnext = () => {};

  const base = import.meta.env.BASE_URL;
  const colors = ['#ff4d7d', '#ff8fb1', '#ffd9a0', '#ffffff', '#e11d48', '#ffb3c8'];

  let phase = 'closed'; // closed | shake | closing | open
  let stageEl;
  let boxEl;
  let flying = [];
  let confetti = [];
  let hearts = [];
  let origin = { x: 0, y: 0 };
  let showNext = false;
  let active = null;

  const rnd = (a, b) => a + Math.random() * (b - a);

  function size() {
    return {
      vw: stageEl ? stageEl.clientWidth : window.innerWidth,
      vh: stageEl ? stageEl.clientHeight : window.innerHeight
    };
  }

  // hitung ukuran & posisi akhir foto, otomatis memilih jumlah kolom terbaik untuk ukuran layar
  function targets(n, vw, vh, jit) {
    const top = vh < 520 ? 64 : 100;
    const bottomPad = vh < 520 ? 72 : 100;
    let best = null;
    for (let cols = 2; cols <= 6; cols++) {
      const rows = Math.ceil(n / cols);
      const cw = vw / cols;
      const ch = (vh - top - bottomPad) / rows;
      const pw = Math.max(48, Math.min(cw * 0.8, (ch * 0.92 - 44) / 1.25, 230));
      if (!best || pw > best.pw) best = { cols, rows, cw, ch, pw };
    }
    const { cols, rows, cw, ch, pw } = best;
    const ph = pw * 1.25 + 44;
    return Array.from({ length: n }, (_, i) => {
      const c = i % cols;
      const rIdx = Math.floor(i / cols);
      const inRow = rIdx === rows - 1 ? n - (rows - 1) * cols : cols;
      const off = ((cols - inRow) * cw) / 2;
      const j = jit && jit[i] ? jit[i] : { jx: 0, jy: 0 };
      let cx = off + (c + 0.5) * cw + j.jx * cw;
      const cy = top + (rIdx + 0.5) * ch + j.jy * ch;
      cx = Math.max(pw / 2 + 14, Math.min(vw - pw / 2 - 14, cx));
      return { pw, ph, x1: cx - pw / 2, y1: cy - ph / 2 };
    });
  }

  async function openBox() {
    if (phase !== 'closed') return;
    phase = 'shake';
    const r = boxEl.getBoundingClientRect();
    const sr = stageEl.getBoundingClientRect();
    origin = {
      x: Math.round(r.left - sr.left + r.width / 2),
      y: Math.round(r.top - sr.top + r.height * 0.3)
    };
    await onopen();

    phase = 'closing';
    setTimeout(() => {
      build(origin.x, origin.y);
      phase = 'open';
      setTimeout(() => (showNext = true), 3600);
    }, 600);
  }

  function build(ox, oy) {
    const { vw, vh } = size();
    const n = photos.length;
    const jit = photos.map(() => ({ jx: rnd(-0.025, 0.025), jy: rnd(-0.02, 0.02) }));
    const t = targets(n, vw, vh, jit);

    flying = photos.map((p, i) => {
      const { pw, ph, x1, y1 } = t[i];
      const x0 = ox - pw / 2;
      const y0 = oy - ph / 2;
      const xm = x0 + (x1 - x0) * 0.52 + rnd(-0.06, 0.06) * vw;
      const ym = Math.max(-ph * 0.2, Math.min(y0, y1) - 24 - rnd(0, 0.05) * vh);
      const d = 0.08 + i * 0.1;
      const dur = rnd(1.9, 2.4);

      return {
        src: p.src,
        caption: p.caption,
        jx: jit[i].jx,
        jy: jit[i].jy,
        w: Math.round(pw),
        x0: Math.round(x0),
        y0: Math.round(y0),
        x1: Math.round(x1),
        y1: Math.round(y1),
        xm: Math.round(xm),
        ym: Math.round(ym),
        r: Math.round(rnd(-8, 8)),
        rm: Math.round(rnd(-24, 24)),
        d: d.toFixed(2),
        dur: dur.toFixed(2),
        bd: (d + dur).toFixed(2),
        bt: rnd(4, 5.5).toFixed(2),
        ba: Math.round(rnd(4, 8))
      };
    });

    confetti = Array.from({ length: 46 }, (_, i) => ({
      dx: Math.round(rnd(-170, 170)),
      dy: Math.round(-rnd(90, 300)),
      rot: Math.round(rnd(-720, 720)),
      d: rnd(0, 0.5).toFixed(2),
      c: colors[i % colors.length]
    }));

    hearts = Array.from({ length: 14 }, (_, i) => ({
      dx: Math.round(rnd(-140, 140)),
      dy: Math.round(-rnd(120, 340)),
      s: Math.round(rnd(16, 34)),
      d: rnd(0, 0.6).toFixed(2),
      c: colors[i % colors.length]
    }));
  }

  // layar berubah (putar HP, resize jendela, buka DevTools): susun ulang foto
  function onResize() {
    if (phase !== 'open' || !flying.length) return;
    const { vw, vh } = size();
    const t = targets(flying.length, vw, vh, flying);
    flying = flying.map((f, i) => ({
      ...f,
      w: Math.round(t[i].pw),
      x1: Math.round(t[i].x1),
      y1: Math.round(t[i].y1)
    }));
  }
</script>

<svelte:window on:resize={onResize} />

<div class="stage" bind:this={stageEl}>
  <div class="spot"></div>

  <div class="head">
    {#if phase === 'open'}
      <h2 class="pop script">Surprise!</h2>
    {:else if phase === 'closing'}
      <p class="eyebrow">Satu kejutan lagi</p>
      <h2>Untuk kamu</h2>
    {:else}
      <p class="eyebrow">Hadiah buat kamuu</p>
      <h2>Buka kadonya</h2>
    {/if}
  </div>

  <div
    class="boxwrap"
    class:gone={phase === 'closing' || phase === 'open'}
    class:dismissed={phase === 'open'}
    bind:this={boxEl}
    inert={phase !== 'closed'}
    aria-hidden={phase === 'open'}
  >
    <div class="rays" class:on={phase === 'open'}></div>
    <button class="scene" class:shake={phase === 'shake'} class:opened={phase === 'open'} on:click={openBox} aria-label="Buka kado">
      <span class="shadow"></span>
      <span class="box">
        <span class="body"></span>
        <span class="inside"></span>
        <span class="lid"><span class="bow"><i></i></span></span>
      </span>
      <svg class="spark s1" viewBox="0 0 24 24"><path d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z" fill="#ffe9c9" /></svg>
      <svg class="spark s2" viewBox="0 0 24 24"><path d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z" fill="#ffe9c9" /></svg>
      <svg class="spark s3" viewBox="0 0 24 24"><path d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z" fill="#ffe9c9" /></svg>
    </button>
  </div>

  {#if phase === 'open'}
    {#each confetti as c}
      <span class="confetti" style="left:{origin.x}px;top:{origin.y}px;--dx:{c.dx}px;--dy:{c.dy}px;--rot:{c.rot}deg;--d:{c.d}s;background:{c.c}"></span>
    {/each}
    {#each hearts as h}
      <span class="hfly" style="left:{origin.x}px;top:{origin.y}px;--dx:{h.dx}px;--dy:{h.dy}px;--s:{h.s}px;--d:{h.d}s;color:{h.c}"><Heart /></span>
    {/each}
  {/if}

  {#each flying as f}
    <div
      class="fp"
      style="--x0:{f.x0}px;--y0:{f.y0}px;--x1:{f.x1}px;--y1:{f.y1}px;--xm:{f.xm}px;--ym:{f.ym}px;--w:{f.w}px;--r:{f.r}deg;--rm:{f.rm}deg;--d:{f.d}s;--dur:{f.dur}s;--bd:{f.bd}s;--bt:{f.bt}s;--ba:{f.ba}px"
    >
      <span class="bobwrap">
        <button class="polaroid" on:click={() => (active = { src: f.src, caption: f.caption })}>
          <img src="{base}{f.src}" alt={f.caption} draggable="false" />
          <span class="cap script">{f.caption}</span>
        </button>
      </span>
    </div>
  {/each}

  {#if showNext}
    <button class="btn next" on:click={onnext} transition:fade>Lihat semua kenangan</button>
  {/if}

  <Lightbox item={active} onclose={() => (active = null)} />
</div>

<style>
  .stage { position: relative; width: 100%; height: 100%; overflow: hidden; }
  .spot {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 140%;
    height: 70%;
    transform: translateX(-50%);
    background: radial-gradient(ellipse at 50% 100%, rgba(255, 77, 125, 0.35), transparent 60%);
    pointer-events: none;
  }

  .head {
    position: absolute;
    top: calc(var(--safe-t) + 34px);
    left: 0;
    right: 0;
    z-index: 6;
    text-align: center;
    pointer-events: none;
  }
  .eyebrow { font-size: 0.72rem; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); }
  .head h2 { margin-top: 6px; font-size: clamp(1.8rem, 7vw, 2.4rem); }
  .head .pop { font-size: clamp(2.8rem, 12vw, 4.4rem); color: #fff; text-shadow: 0 0 30px rgba(255, 77, 125, 0.9), 0 4px 18px rgba(0, 0, 0, 0.4); animation: pop 0.9s cubic-bezier(0.2, 1.8, 0.4, 1); }
  @keyframes pop { from { opacity: 0; transform: scale(0.2) rotate(-8deg); } }

  .boxwrap {
    position: absolute;
    left: 50%;
    bottom: max(14dvh, 80px);
    z-index: 2;
    width: 220px;
    height: 230px;
    transform: translateX(-50%) scale(1);
    transition: opacity 1s 0.7s, transform 1s 0.7s;
  }
  @media (min-width: 420px) { .boxwrap { transform: translateX(-50%) scale(1.15); } }
  @media (min-width: 700px) { .boxwrap { transform: translateX(-50%) scale(1.4); } }
  @media (min-width: 1100px) { .boxwrap { transform: translateX(-50%) scale(1.7); } }
  .boxwrap.gone {
    opacity: 0;
    transform: translateX(-50%) scale(0.72);
    pointer-events: none;
    transition: opacity 0.45s ease, transform 0.55s cubic-bezier(0.2, 0.8, 0.3, 1);
  }
  .boxwrap.dismissed { visibility: hidden; }

  .rays {
    position: absolute;
    left: 50%;
    top: 30%;
    width: 900px;
    height: 900px;
    margin: -450px 0 0 -450px;
    background: repeating-conic-gradient(from 0deg, rgba(255, 217, 160, 0.3) 0 6deg, transparent 6deg 18deg);
    -webkit-mask-image: radial-gradient(circle, #000 0%, transparent 62%);
    mask-image: radial-gradient(circle, #000 0%, transparent 62%);
    opacity: 0;
    pointer-events: none;
  }
  .rays.on { animation: rays 3s ease-out forwards; }
  @keyframes rays {
    0% { opacity: 0; transform: scale(0.3) rotate(0); }
    25% { opacity: 1; }
    100% { opacity: 0; transform: scale(1.3) rotate(50deg); }
  }

  .scene { position: absolute; inset: 0; display: block; background: none; border: 0; cursor: pointer; }
  .shadow {
    position: absolute;
    bottom: 2px;
    left: 50%;
    width: 190px;
    height: 24px;
    transform: translateX(-50%);
    background: radial-gradient(ellipse, rgba(0, 0, 0, 0.5), transparent 70%);
  }
  .box {
    position: absolute;
    left: 50%;
    bottom: 10px;
    width: 160px;
    height: 150px;
    transform: translateX(-50%);
    animation: idle 2.4s ease-in-out infinite;
  }
  .opened .box { animation: none; }
  .shake .box { animation: shake 0.8s ease-in-out; }
  @keyframes idle {
    0%, 100% { transform: translateX(-50%) translateY(0) rotate(0); }
    25% { transform: translateX(-50%) translateY(-8px) rotate(-3deg); }
    75% { transform: translateX(-50%) translateY(-8px) rotate(3deg); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(-50%) rotate(0); }
    15% { transform: translateX(-56%) translateY(-6px) rotate(-7deg); }
    30% { transform: translateX(-44%) rotate(7deg); }
    45% { transform: translateX(-55%) translateY(-4px) rotate(-6deg); }
    60% { transform: translateX(-45%) rotate(5deg); }
    80% { transform: translateX(-52%) rotate(-3deg); }
  }

  .body {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 160px;
    height: 105px;
    border-radius: 6px 6px 14px 14px;
    background: linear-gradient(160deg, #ff5d8f, #e11d48 70%);
    box-shadow: 0 0 60px rgba(255, 77, 125, 0.55), 0 18px 30px -10px rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }
  .body::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.28), transparent 32%);
  }
  .body::before,
  .lid::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 26px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, #ffe8a3, #ffd166, #ffe8a3);
    z-index: 1;
  }
  .inside {
    position: absolute;
    bottom: 98px;
    left: 6px;
    width: 148px;
    height: 14px;
    border-radius: 8px 8px 0 0;
    background: #9f1239;
    opacity: 0;
    transition: opacity 0.3s 0.2s;
  }
  .opened .inside { opacity: 1; }

  .lid {
    position: absolute;
    bottom: 98px;
    left: -8px;
    width: 176px;
    height: 48px;
    border-radius: 10px;
    background: linear-gradient(160deg, #ff7aa2, #f43f6b);
    transform-origin: left bottom;
    transition: transform 0.9s cubic-bezier(0.3, 1.5, 0.5, 1), opacity 0.5s 1.2s;
  }
  .opened .lid { transform: translate(-80px, -130px) rotate(-40deg); opacity: 0; }

  .bow { position: absolute; left: 50%; top: -22px; width: 56px; height: 28px; transform: translateX(-50%); z-index: 2; }
  .bow::before,
  .bow::after { content: ''; position: absolute; top: 0; width: 26px; height: 26px; border: 7px solid #ffd166; }
  .bow::before { left: 0; border-radius: 50% 50% 0 50%; transform: rotate(-20deg); }
  .bow::after { right: 0; border-radius: 50% 50% 50% 0; transform: rotate(20deg); }
  .bow i { position: absolute; left: 50%; top: 10px; width: 14px; height: 14px; border-radius: 50%; background: #ffc233; transform: translateX(-50%); z-index: 1; }

  .spark { position: absolute; opacity: 0; animation: twinkle 2.2s ease-in-out infinite; pointer-events: none; }
  .s1 { left: 8px; top: 40px; width: 18px; height: 18px; }
  .s2 { right: 6px; top: 70px; width: 14px; height: 14px; animation-delay: 0.7s; }
  .s3 { right: 40px; top: 18px; width: 12px; height: 12px; animation-delay: 1.4s; }
  .opened .spark { display: none; }
  @keyframes twinkle {
    0%, 100% { opacity: 0; transform: scale(0.3) rotate(0); }
    50% { opacity: 1; transform: scale(1) rotate(45deg); }
  }

  .confetti {
    position: absolute;
    z-index: 4;
    width: 9px;
    height: 14px;
    border-radius: 2px;
    opacity: 0;
    pointer-events: none;
    animation: conf 2.8s cubic-bezier(0.2, 0.7, 0.3, 1) var(--d) forwards;
  }
  @keyframes conf {
    0% { opacity: 0; transform: translate(0, 0) rotate(0) scale(0.4); }
    10% { opacity: 1; }
    45% { transform: translate(var(--dx), var(--dy)) rotate(calc(var(--rot) * 0.5)) scale(1); }
    100% { opacity: 0; transform: translate(calc(var(--dx) * 1.25), calc(var(--dy) + 380px)) rotate(var(--rot)) scale(0.9); }
  }
  .hfly {
    position: absolute;
    z-index: 4;
    width: var(--s);
    height: var(--s);
    margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);
    opacity: 0;
    pointer-events: none;
    filter: drop-shadow(0 0 8px currentColor);
    animation: hfly 2.6s cubic-bezier(0.2, 0.8, 0.3, 1) var(--d) forwards;
  }
  @keyframes hfly {
    0% { opacity: 0; transform: translate(0, 0) scale(0.2); }
    15% { opacity: 1; }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(1.2) rotate(20deg); }
  }

  .fp {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    width: var(--w);
    transform: translate(var(--x1), var(--y1)) rotate(var(--r));
    will-change: transform;
    animation: burst var(--dur) cubic-bezier(0.16, 0.75, 0.3, 1) var(--d) backwards;
  }
  .fp:hover { z-index: 5; }
  @keyframes burst {
    0% { opacity: 0; transform: translate(var(--x0), var(--y0)) scale(0.3) rotate(-2deg); }
    10% { opacity: 1; }
    55% { transform: translate(var(--xm), var(--ym)) scale(1.05) rotate(var(--rm)); }
    100% { transform: translate(var(--x1), var(--y1)) scale(1) rotate(var(--r)); }
  }
  .bobwrap { display: block; animation: bob var(--bt) ease-in-out var(--bd) infinite alternate; }
  @keyframes bob {
    from { transform: translateY(0) rotate(0); }
    to { transform: translateY(calc(var(--ba) * -1)) rotate(2.5deg); }
  }

  .polaroid {
    display: block;
    width: 100%;
    padding: 6px 6px 0;
    border: 0;
    border-radius: 3px;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45), 0 0 24px rgba(255, 143, 177, 0.25);
    transition: transform 0.25s;
  }
  .polaroid:hover,
  .polaroid:active { transform: scale(1.08); }
  .polaroid img { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; background: #ffe4ec; }
  .cap {
    display: block;
    padding: 5px 2px 7px;
    font-size: clamp(0.8rem, 0.55rem + 0.9vw, 1.15rem);
    line-height: 1.15;
    color: #881337;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .next {
    position: absolute;
    left: 50%;
    bottom: calc(var(--safe-b) + 28px);
    z-index: 8;
    transform: translateX(-50%);
    white-space: nowrap;
  }
  .next:active { transform: translateX(-50%) scale(0.95); }

  @media (max-height: 520px) {
    .boxwrap { bottom: 36px; transform: translateX(-50%) scale(0.72); }
    .head { top: calc(var(--safe-t) + 14px); }
    .head h2 { font-size: 1.6rem; }
    .head .pop { font-size: 2.4rem; }
    .eyebrow { display: none; }
    .next { bottom: calc(var(--safe-b) + 12px); }
  }
</style>
