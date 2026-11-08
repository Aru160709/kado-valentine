<script>
  import { config } from '../config.js';
  import Heart from './Heart.svelte';

  export let onok = () => {};
  export let ondone = () => {};

  let nama = '';
  let tanggal = '';
  let phase = 'idle'; // idle | ok | wipe
  let wrong = 0;
  let shake = false;
  let msg = '';

  const salah = [
    'Hmm, kayaknya ada yang kurang tepat. Coba lagi ya.',
    'Belum bener nih. Pelan-pelan diingat lagi.',
    'Masa lupa sih? Coba sekali lagi.',
    'Ayo, kamu pasti ingat.'
  ];

  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();

  const colors = ['#ff4d7d', '#ff8fb1', '#ffd9a0', '#ffffff', '#e11d48'];
  const bursts = Array.from({ length: 22 }, (_, i) => {
    const a = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 150;
    return {
      dx: Math.round(Math.cos(a) * dist),
      dy: Math.round(Math.sin(a) * dist),
      s: Math.round(12 + Math.random() * 20),
      d: (0.7 + Math.random() * 0.6).toFixed(2),
      c: colors[i % colors.length]
    };
  });

  function submit() {
    if (phase !== 'idle') return;
    if (!norm(nama) || !tanggal) {
      msg = 'Isi nama dan tanggalnya dulu ya.';
      return;
    }
    const namaOk = config.namaBenar.map(norm).includes(norm(nama));
    const tglOk = tanggal === config.tanggalJadian;

    if (namaOk && tglOk) {
      phase = 'ok';
      msg = '';
      onok();
      setTimeout(() => (phase = 'wipe'), 2400);
      setTimeout(() => ondone(), 3500);
    } else {
      msg = salah[wrong % salah.length];
      wrong += 1;
      shake = false;
      setTimeout(() => (shake = true), 20);
      if (navigator.vibrate) navigator.vibrate(180);
    }
  }
</script>

<div class="gate">
  <div class="enter">
    <div class="card" class:shake class:ok={phase !== 'idle'} on:animationend={() => (shake = false)}>
      <div class="lockwrap" class:open={phase !== 'idle'}>
        <svg class="lock" viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <linearGradient id="lk" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#ff8fb1" />
              <stop offset="1" stop-color="#e11d48" />
            </linearGradient>
          </defs>
          <path class="shackle" d="M20 30V21a12 12 0 0 1 24 0v9" fill="none" stroke="#ffd9a0" stroke-width="5" stroke-linecap="round" />
          <rect x="11" y="28" width="42" height="29" rx="9" fill="url(#lk)" />
          <circle cx="32" cy="41" r="4.5" fill="#4c0519" />
          <rect x="30" y="43" width="4" height="8" rx="2" fill="#4c0519" />
        </svg>
        <span class="heartlock"><Heart /></span>

        {#if phase !== 'idle'}
          {#each bursts as b}
            <span class="fly" style="--dx:{b.dx}px;--dy:{b.dy}px;--s:{b.s}px;--d:{b.d}s;color:{b.c}"><Heart /></span>
          {/each}
          <span class="ring"></span>
          <span class="ring r2"></span>
        {/if}
      </div>

      <p class="eyebrow">Khusus untukmu</p>
      {#if phase === 'idle'}
        <h1>Siapa yang datang?</h1>
        <p class="sub">Masukkan nama dan tanggal jadian kita untuk membuka kejutan ini.</p>
      {:else}
        <h1 class="welcome">Selamat datang, {config.pasangan}</h1>
        <p class="sub">Kejutannya sudah menunggu...</p>
      {/if}

      {#if phase === 'idle'}
        <form on:submit={(e) => { e.preventDefault(); submit(); }}>
          <label>
            <span>Nama kamu</span>
            <input type="text" bind:value={nama} autocomplete="off" autocapitalize="words" placeholder="Ketik namamu" />
          </label>
          <label>
            <span>Tanggal jadian kita</span>
            <input type="date" bind:value={tanggal} />
          </label>
          <button type="submit" class="go">Buka kejutan</button>
        </form>

        {#if msg}<p class="msg" role="alert">{msg}</p>{/if}
        {#if wrong >= 3}<p class="hint">Petunjuk: {config.petunjuk}</p>{/if}
      {/if}
    </div>
  </div>

  {#if phase === 'wipe'}
    <div class="wipe">
      <div class="wheart"><Heart /></div>
    </div>
  {/if}
</div>

<style>
  .gate {
    position: relative;
    min-height: 100%;
    display: grid;
    place-items: center;
    padding: calc(var(--safe-t) + 20px) 18px calc(var(--safe-b) + 20px);
  }
  .enter { width: min(100%, 26rem); animation: rise 0.9s cubic-bezier(0.2, 0.9, 0.3, 1) backwards; }
  @keyframes rise { from { opacity: 0; transform: translateY(40px) scale(0.96); } }

  .card {
    position: relative;
    padding: 34px 24px 28px;
    text-align: center;
    border-radius: 28px;
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.05));
    border: 1px solid var(--glass-b);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transition: box-shadow 0.8s;
  }
  .card.ok { box-shadow: 0 0 0 2px rgba(255, 143, 177, 0.6), 0 0 90px rgba(255, 77, 125, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2); }
  .card.shake { animation: shake 0.5s; }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    15% { transform: translateX(-12px) rotate(-1deg); }
    30% { transform: translateX(10px) rotate(1deg); }
    45% { transform: translateX(-8px); }
    60% { transform: translateX(6px); }
    80% { transform: translateX(-3px); }
  }

  .lockwrap { position: relative; width: 84px; height: 84px; margin: 0 auto 14px; }
  .lockwrap::before {
    content: '';
    position: absolute;
    inset: -16px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 77, 125, 0.45), transparent 70%);
    animation: pulse 2.4s ease-in-out infinite;
  }
  @keyframes pulse { 50% { transform: scale(1.18); opacity: 0.7; } }
  .lock { position: relative; width: 100%; height: 100%; filter: drop-shadow(0 8px 14px rgba(225, 29, 72, 0.5)); }
  .shackle { transform-origin: 20px 30px; transition: transform 0.7s cubic-bezier(0.3, 1.6, 0.5, 1); }
  .open .shackle { transform: translateY(-9px) rotate(-38deg); }
  .open .lock { animation: lockout 0.5s 0.9s forwards; }
  @keyframes lockout { to { opacity: 0; transform: scale(0.4) rotate(-10deg); } }
  .heartlock {
    position: absolute;
    inset: 4px;
    color: var(--rose);
    opacity: 0;
    transform: scale(0.2);
    filter: drop-shadow(0 0 18px rgba(255, 77, 125, 0.9));
  }
  .open .heartlock { animation: heartin 0.8s 1s cubic-bezier(0.3, 1.8, 0.5, 1) forwards, beat 1s 1.8s ease-in-out infinite; }
  @keyframes heartin { to { opacity: 1; transform: scale(1.15); } }
  @keyframes beat { 0%, 100% { transform: scale(1.15); } 50% { transform: scale(1.32); } }

  .fly {
    position: absolute;
    left: 50%;
    top: 50%;
    width: var(--s);
    height: var(--s);
    margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);
    opacity: 0;
    pointer-events: none;
    animation: fly 1.9s cubic-bezier(0.15, 0.8, 0.3, 1) var(--d) forwards;
  }
  @keyframes fly {
    0% { opacity: 0; transform: translate(0, 0) scale(0.2); }
    15% { opacity: 1; }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(1.1) rotate(25deg); }
  }
  .ring {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 84px;
    height: 84px;
    margin: -42px 0 0 -42px;
    border: 2px solid rgba(255, 217, 160, 0.9);
    border-radius: 50%;
    opacity: 0;
    animation: ring 1.4s ease-out 0.8s forwards;
  }
  .ring.r2 { animation-delay: 1.15s; }
  @keyframes ring { 0% { opacity: 0.9; transform: scale(0.6); } 100% { opacity: 0; transform: scale(3.6); } }

  .eyebrow { font-size: 0.72rem; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); }
  h1 { margin-top: 8px; font-size: clamp(1.7rem, 7vw, 2.1rem); line-height: 1.2; }
  .welcome { color: var(--pink); animation: rise 0.8s 0.2s backwards; }
  .sub { margin: 10px auto 20px; max-width: 290px; font-size: 0.9rem; line-height: 1.55; color: var(--muted); }

  form { text-align: left; }
  label { display: block; margin-bottom: 14px; }
  label span { display: block; margin-bottom: 6px; font-size: 0.78rem; color: var(--muted); }
  input {
    width: 100%;
    min-height: 50px;
    padding: 13px 16px;
    border-radius: 14px;
    border: 1px solid var(--glass-b);
    background: rgba(255, 255, 255, 0.08);
    color: var(--cream);
    font: inherit;
    font-size: 16px;
    color-scheme: dark;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  input::placeholder { color: rgba(255, 244, 238, 0.4); }
  input:focus { border-color: var(--pink); box-shadow: 0 0 0 4px rgba(255, 77, 125, 0.22); }

  .go {
    position: relative;
    overflow: hidden;
    width: 100%;
    margin-top: 6px;
    padding: 15px;
    border: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, #ff8fb1, #ff4d7d 55%, #e11d48);
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    box-shadow: 0 12px 30px rgba(255, 77, 125, 0.45);
    cursor: pointer;
    transition: transform 0.2s;
  }
  .go:active { transform: scale(0.97); }
  .go::after {
    content: '';
    position: absolute;
    top: 0;
    left: -60%;
    width: 40%;
    height: 100%;
    background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.45), transparent);
    transform: skewX(-20deg);
    animation: shine 3.2s ease-in-out infinite;
  }
  @keyframes shine { 0%, 55% { left: -60%; } 100% { left: 130%; } }

  .msg { margin-top: 14px; padding: 10px 14px; border-radius: 12px; background: rgba(225, 29, 72, 0.25); border: 1px solid rgba(255, 77, 125, 0.5); font-size: 0.85rem; color: #ffd0dc; animation: rise 0.4s backwards; }
  .hint { margin-top: 10px; font-size: 0.82rem; color: var(--gold); }

  .wipe {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: grid;
    place-items: center;
    background: radial-gradient(circle at 50% 50%, #fff0f5 0%, #ff8fb1 55%, #e11d48 100%);
    animation: wipe 1s cubic-bezier(0.6, 0, 0.2, 1) forwards;
  }
  @keyframes wipe { from { clip-path: circle(0% at 50% 50%); } to { clip-path: circle(150% at 50% 50%); } }
  .wheart { width: 120px; height: 120px; color: #fff; animation: wbeat 0.7s ease-in-out infinite; filter: drop-shadow(0 10px 30px rgba(136, 19, 55, 0.5)); }
  @keyframes wbeat { 50% { transform: scale(1.3); } }
</style>
