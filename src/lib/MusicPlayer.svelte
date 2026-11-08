<script>
  import { onDestroy } from 'svelte';
  import Heart from './Heart.svelte';
  import Icon from './Icon.svelte';

  export let show = false;
  export let available = true;
  export let playing = false;
  export let title = '';
  export let artist = '';
  export let pos = 0;
  export let dur = 0;
  export let ontoggle = () => {};

  let phase = 'hidden'; // hidden | popup | minimizing | mini
  let cardEl;
  let miniEl;
  let tx = 0;
  let ty = 0;
  let sc = 0.2;
  let timer;
  let timer2;

  $: pct = dur > 0 ? Math.min(100, (pos / dur) * 100) : 0;
  $: if (show && available && phase === 'hidden') begin();

  function begin() {
    phase = 'popup';
    timer = setTimeout(minimize, 4800);
  }

  function minimize() {
    if (phase !== 'popup') return;
    clearTimeout(timer);
    if (cardEl && miniEl) {
      const c = cardEl.getBoundingClientRect();
      const m = miniEl.getBoundingClientRect();
      tx = Math.round(m.left + m.width / 2 - (c.left + c.width / 2));
      ty = Math.round(m.top + m.height / 2 - (c.top + c.height / 2));
      sc = Math.max(0.05, m.width / c.width);
    }
    phase = 'minimizing';
    timer2 = setTimeout(() => (phase = 'mini'), 950);
  }

  function toggle(e) {
    e.stopPropagation();
    ontoggle();
  }

  onDestroy(() => {
    clearTimeout(timer);
    clearTimeout(timer2);
  });
</script>

{#if available}
  {#if phase === 'popup' || phase === 'minimizing'}
    <div class="backdrop" class:out={phase === 'minimizing'} role="presentation" on:click={minimize}></div>
    <div
      class="card"
      class:go={phase === 'minimizing'}
      style="--tx:{tx}px;--ty:{ty}px;--sc:{sc}"
      bind:this={cardEl}
      role="button"
      tabindex="0"
      aria-label="Tutup pemutar lagu"
      on:click={minimize}
      on:keydown={(e) => e.key === 'Enter' && minimize()}
    >
      <div class="disc" class:spin={playing}>
        <span class="label"><span class="lh"><Heart /></span></span>
      </div>

      <p class="now">{playing ? 'Sedang diputar' : 'Lagu siap diputar'}</p>
      <h3 class="title">{title}</h3>
      <p class="artist">{artist}</p>

      <div class="eq" class:on={playing} aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="bar" aria-hidden="true"><span style="width:{pct}%"></span></div>

      <button class="pp" on:click={toggle}>{playing ? 'Jeda' : 'Putar'}</button>
      <p class="hint">Ketuk di mana saja untuk menutup</p>
    </div>
  {/if}

  <button
    class="mini"
    class:show={phase === 'mini'}
    bind:this={miniEl}
    on:click={ontoggle}
    aria-label={playing ? 'Jeda lagu' : 'Putar lagu'}
  >
    <span class="vinyl" class:spin={playing}></span>
    {#if !playing}<span class="slash"><Icon name="mute" size={16} /></span>{/if}
  </button>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 65;
    background: rgba(15, 2, 10, 0.55);
    backdrop-filter: blur(4px);
    animation: fadein 0.4s backwards;
    transition: opacity 0.6s 0.2s;
  }
  .backdrop.out { opacity: 0; pointer-events: none; }
  @keyframes fadein { from { opacity: 0; } }

  .card {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 70;
    width: min(21rem, calc(100% - 2 * var(--pad)));
    height: max-content;
    margin: auto;
    padding: 1.8rem 1.4rem 1.3rem;
    text-align: center;
    border-radius: 1.8rem;
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.07));
    border: 1px solid var(--glass-b);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55), 0 0 70px rgba(255, 77, 125, 0.3);
    cursor: pointer;
    animation: cardin 0.7s cubic-bezier(0.2, 1.3, 0.4, 1) backwards;
    transition: transform 0.95s cubic-bezier(0.6, 0, 0.2, 1), opacity 0.5s ease-in 0.45s, border-radius 0.95s;
  }
  .card.go {
    transform: translate(var(--tx), var(--ty)) scale(var(--sc));
    opacity: 0;
    border-radius: 50%;
    pointer-events: none;
  }
  @keyframes cardin { from { opacity: 0; transform: translateY(40px) scale(0.7); } }

  .disc {
    position: relative;
    width: 7.5rem;
    height: 7.5rem;
    margin: 0 auto 1rem;
    border-radius: 50%;
    background: repeating-radial-gradient(circle at 50% 50%, #1a0a14 0 2px, #2a1220 2px 4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 77, 125, 0.4);
    animation: spin 6s linear infinite;
    animation-play-state: paused;
  }
  .disc.spin { animation-play-state: running; }
  .disc::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(from 30deg, transparent 0 20%, rgba(255, 255, 255, 0.14) 25%, transparent 30% 70%, rgba(255, 255, 255, 0.1) 75%, transparent 80%);
  }
  .label {
    position: absolute;
    inset: 31%;
    z-index: 1;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #ff8fb1, #e11d48);
  }
  .lh { width: 48%; height: 48%; color: #fff; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .now { font-size: 0.72rem; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); }
  .title { margin-top: 0.35rem; font-size: 1.45rem; line-height: 1.2; }
  .artist { margin-top: 0.25rem; font-size: 0.9rem; color: var(--muted); }

  .eq { display: flex; align-items: flex-end; justify-content: center; gap: 4px; height: 1.6rem; margin: 1rem 0 0.7rem; }
  .eq i {
    display: block;
    width: 5px;
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(to top, #ff4d7d, #ffd9a0);
    transform-origin: bottom;
    transform: scaleY(0.2);
    animation: eq 0.9s ease-in-out infinite;
    animation-play-state: paused;
  }
  .eq.on i { animation-play-state: running; }
  .eq i:nth-child(2) { animation-delay: -0.3s; animation-duration: 0.7s; }
  .eq i:nth-child(3) { animation-delay: -0.6s; animation-duration: 1.1s; }
  .eq i:nth-child(4) { animation-delay: -0.2s; animation-duration: 0.8s; }
  .eq i:nth-child(5) { animation-delay: -0.5s; animation-duration: 1s; }
  @keyframes eq { 0%, 100% { transform: scaleY(0.2); } 50% { transform: scaleY(1); } }

  .bar { height: 5px; border-radius: 999px; background: rgba(255, 255, 255, 0.15); overflow: hidden; }
  .bar span { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, #ff8fb1, #ff4d7d); transition: width 0.3s linear; }

  .pp {
    margin-top: 1rem;
    padding: 0.6rem 1.6rem;
    border: 1px solid var(--glass-b);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 0.9rem;
    cursor: pointer;
  }
  .hint { margin-top: 0.8rem; font-size: 0.72rem; color: var(--muted); opacity: 0.8; }

  .mini {
    position: fixed;
    z-index: 60;
    top: calc(var(--safe-t) + 12px);
    right: max(var(--pad), calc((100vw - var(--maxw)) / 2 + var(--pad)));
    width: clamp(36px, 9vw, 46px);
    height: clamp(36px, 9vw, 46px);
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: none;
    cursor: pointer;
    opacity: 0;
    transform: scale(0.6);
    pointer-events: none;
  }
  .mini.show { opacity: 1; transform: scale(1); pointer-events: auto; animation: minipop 0.6s cubic-bezier(0.2, 1.8, 0.4, 1); }
  .mini.show::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid var(--pink);
    animation: miniring 1s ease-out 0.1s;
    opacity: 0;
  }
  @keyframes minipop { from { opacity: 0; transform: scale(0.4); } }
  @keyframes miniring { 0% { opacity: 0.9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }

  .vinyl {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: repeating-radial-gradient(circle at 50% 50%, #1a0a14 0 1.5px, #2a1220 1.5px 3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5), 0 0 18px rgba(255, 77, 125, 0.5);
    animation: spin 3s linear infinite;
    animation-play-state: paused;
  }
  .vinyl.spin { animation-play-state: running; }
  .vinyl::before {
    content: '';
    position: absolute;
    inset: 31%;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #ff8fb1, #e11d48);
  }
  .slash { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; text-shadow: 0 0 6px rgba(0, 0, 0, 0.8); pointer-events: none; }
</style>
