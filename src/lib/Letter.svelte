<script>
  import { onDestroy, tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Heart from './Heart.svelte';

  export let teks = '';
  export let dari = '';
  export let untuk = '';
  export let tanggal = '';
  export let ps = '';
  export let ondone = () => {};

  let phase = 'closed'; // closed | opening | open
  let shown = 0;
  let finished = false;
  let timer;
  let paperEl;

  const colors = ['#ff8fb1', '#ff4d7d', '#ffb3c8', '#e11d48'];
  const petals = Array.from({ length: 14 }, (_, i) => ({
    left: Math.round(Math.random() * 100),
    s: Math.round(10 + Math.random() * 12),
    dur: (8 + Math.random() * 6).toFixed(1),
    delay: (-Math.random() * 12).toFixed(1),
    c: colors[i % colors.length],
    sway: Math.round(30 + Math.random() * 60)
  }));

  function openLetter() {
    if (phase !== 'closed') return;
    phase = 'opening';
    setTimeout(async () => {
      phase = 'open';
      await tick();
      if (paperEl) paperEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(type, 900);
    }, 2100);
  }

  function type() {
    if (shown >= teks.length) {
      finish();
      return;
    }
    const ch = teks[shown];
    shown += 1;
    const wait = '.!?'.includes(ch) ? 260 : ch === ',' ? 140 : ch === '\n' ? 180 : 30;
    timer = setTimeout(type, wait);
  }

  function finish() {
    clearTimeout(timer);
    shown = teks.length;
    if (!finished) {
      finished = true;
      ondone();
    }
  }

  function skip() {
    if (phase === 'open' && !finished) finish();
  }

  onDestroy(() => clearTimeout(timer));
</script>

<section class="wrap">
  {#if phase !== 'open'}
    <div class="intro" out:fade={{ duration: 400 }}>
      <p class="eyebrow">Dari hatiku</p>
      <h2>Sebuah Surat</h2>

      <button class="env" class:open={phase === 'opening'} on:click={openLetter} aria-label="Buka surat">
        <span class="eback"></span>
        <span class="mini">
          <span class="ml"></span>
          <span class="ml s"></span>
          <span class="ml"></span>
          <span class="ml s"></span>
        </span>
        <span class="efront"></span>
        <span class="flap"></span>
        <span class="seal"><span class="sh"><Heart /></span></span>
      </button>

      <p class="tap">{phase === 'closed' ? 'Ketuk segelnya untuk membuka' : 'Sebentar ya...'}</p>
    </div>
  {/if}

  {#if phase === 'open'}
    <div class="petals" aria-hidden="true">
      {#each petals as p}
        <span class="petal" style="left:{p.left}%;--s:{p.s}px;--c:{p.c};--sw:{p.sway}px;animation-duration:{p.dur}s;animation-delay:{p.delay}s"></span>
      {/each}
    </div>

    <article class="paper" bind:this={paperEl} in:fly={{ y: 70, duration: 900, delay: 450 }}>
      <span class="tape l"></span>
      <span class="tape r"></span>

      {#if tanggal}<p class="date">{tanggal}</p>{/if}
      <p class="to script">Untuk {untuk},</p>

      <div class="body" role="presentation" on:click={skip}>
        <p class="ghost script">{teks}</p>
        <p class="typed script">{teks.slice(0, shown)}{#if !finished}<span class="caret"></span>{/if}</p>
      </div>

      {#if finished}
        <div class="sign" in:fade={{ duration: 900 }}>
          <p class="dgn script">Dengan cinta,</p>
          <p class="nm script">{dari}</p>
          <span class="sheart"><Heart /></span>
          {#if ps}<p class="ps">{ps}</p>{/if}
        </div>
      {:else}
        <p class="skiphint">Ketuk surat untuk melewati</p>
      {/if}
    </article>
  {/if}
</section>

<style>
  .wrap { max-width: 36rem; margin: 0 auto; padding: 0 var(--pad); text-align: center; }
  .eyebrow { font-size: 0.72rem; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); }
  h2 { margin: 6px 0 26px; font-size: var(--fs-h2); }

  .env {
    position: relative;
    display: block;
    width: 280px;
    height: 190px;
    margin: 0 auto;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    animation: float 3s ease-in-out infinite;
  }
  .env.open { animation: none; }
  @keyframes float { 50% { transform: translateY(-8px); } }

  .eback {
    position: absolute;
    inset: 0;
    border-radius: 10px;
    background: #e8a0b6;
    box-shadow: 0 24px 50px rgba(0, 0, 0, 0.5), 0 0 70px rgba(255, 77, 125, 0.35);
  }
  .mini {
    position: absolute;
    left: 14px;
    right: 14px;
    top: 14px;
    height: 150px;
    padding: 18px 16px;
    border-radius: 6px;
    background: #fffaf0;
    z-index: 2;
    transition: transform 1s cubic-bezier(0.3, 1.2, 0.4, 1) 0.55s;
  }
  .open .mini { transform: translateY(-125px); }
  .ml { display: block; height: 5px; margin-bottom: 11px; border-radius: 3px; background: rgba(225, 29, 72, 0.28); }
  .ml.s { width: 60%; }

  .efront {
    position: absolute;
    inset: 0;
    z-index: 3;
    border-radius: 10px;
    background: linear-gradient(160deg, #ffc2d6, #ff9fbb);
    clip-path: polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%);
  }
  .flap {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 58%;
    z-index: 4;
    background: linear-gradient(180deg, #ff93b3, #ffb3c8);
    clip-path: polygon(0 0, 100% 0, 50% 100%);
    transform-origin: top;
  }
  .open .flap { animation: flapopen 0.7s ease forwards; }
  @keyframes flapopen {
    0% { transform: rotateX(0); z-index: 4; }
    49% { z-index: 4; }
    50% { z-index: 1; }
    100% { transform: rotateX(180deg); z-index: 1; }
  }

  .seal {
    position: absolute;
    left: 50%;
    top: 58%;
    z-index: 5;
    display: grid;
    place-items: center;
    width: 54px;
    height: 54px;
    margin: -27px 0 0 -27px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #ff6f95, #b3123c 70%);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4), inset 0 -3px 6px rgba(0, 0, 0, 0.25);
    animation: sealpulse 2s ease-in-out infinite;
  }
  .sh { width: 24px; height: 24px; color: #ffd9e4; }
  @keyframes sealpulse { 50% { transform: scale(1.12); } }
  .open .seal { animation: sealbreak 0.5s ease forwards; }
  @keyframes sealbreak { to { opacity: 0; transform: scale(1.9) rotate(25deg); } }

  .tap { margin-top: 26px; font-size: 0.88rem; color: var(--muted); animation: blinkp 2s ease-in-out infinite; }
  @keyframes blinkp { 50% { opacity: 0.5; } }

  .petals { position: fixed; inset: 0; z-index: 5; overflow: hidden; pointer-events: none; }
  .petal {
    position: absolute;
    top: -30px;
    width: var(--s);
    height: calc(var(--s) * 1.3);
    border-radius: 80% 0 80% 0;
    background: var(--c);
    opacity: 0.75;
    animation: petal linear infinite;
  }
  @keyframes petal {
    0% { transform: translate(0, 0) rotate(0); }
    50% { transform: translate(var(--sw), 55vh) rotate(260deg); }
    100% { transform: translate(0, 112vh) rotate(540deg); opacity: 0.2; }
  }

  .paper {
    position: relative;
    margin-top: 6px;
    padding: 34px 20px 30px 42px;
    text-align: left;
    color: #4c0519;
    border-radius: 6px;
    background-color: #fffaf0;
    background-image:
      radial-gradient(rgba(180, 120, 90, 0.07) 1px, transparent 1px),
      linear-gradient(180deg, #fffdf6, #fff5e6);
    background-size: 7px 7px, 100% 100%;
    box-shadow: 0 26px 60px rgba(0, 0, 0, 0.55), 0 0 60px rgba(255, 143, 177, 0.18);
    transform: rotate(-0.6deg);
  }
  .paper::before {
    content: '';
    position: absolute;
    left: 30px;
    top: 0;
    bottom: 0;
    width: 1.5px;
    background: rgba(225, 29, 72, 0.3);
  }
  .tape {
    position: absolute;
    top: -12px;
    width: 76px;
    height: 24px;
    background: rgba(255, 217, 160, 0.85);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  .tape.l { left: 14px; transform: rotate(-8deg); }
  .tape.r { right: 14px; transform: rotate(7deg); }

  .date { margin-bottom: 8px; text-align: right; font-size: 0.74rem; letter-spacing: 0.16em; text-transform: uppercase; color: #b45f78; }
  .to { font-size: clamp(1.9rem, 7vw, 2.3rem); line-height: 1.1; color: var(--rose-d); margin-bottom: 8px; }

  .body {
    position: relative;
    cursor: pointer;
    background-image: repeating-linear-gradient(transparent, transparent 33px, rgba(180, 100, 120, 0.22) 34px);
  }
  .body p {
    margin: 0;
    font-size: clamp(1.18rem, 4.8vw, 1.42rem);
    line-height: 34px;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .ghost { visibility: hidden; }
  .typed { position: absolute; inset: 0; color: #5c1030; }
  .caret {
    display: inline-block;
    width: 2px;
    height: 1.1em;
    margin-left: 2px;
    vertical-align: text-bottom;
    background: var(--rose-d);
    animation: caret 0.8s steps(1) infinite;
  }
  @keyframes caret { 50% { opacity: 0; } }

  .skiphint { margin-top: 14px; text-align: center; font-size: 0.74rem; color: #b45f78; }

  .sign { position: relative; margin-top: 18px; text-align: right; }
  .dgn { font-size: 1.35rem; color: #7a2a45; }
  .nm { font-size: 2.3rem; line-height: 1.1; color: var(--rose-d); }
  .sheart { display: inline-block; width: 22px; height: 22px; margin-top: 2px; color: var(--rose); animation: hb 1.2s ease-in-out infinite; }
  @keyframes hb { 50% { transform: scale(1.3); } }
  .ps { margin-top: 18px; padding-top: 14px; border-top: 1px dashed rgba(180, 100, 120, 0.5); text-align: left; font-size: 0.85rem; font-style: italic; line-height: 1.6; color: #881337; }
</style>
