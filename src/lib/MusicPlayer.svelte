<script>
  import { onDestroy, tick } from 'svelte';
  import Heart from './Heart.svelte';
  import Icon from './Icon.svelte';

  export let show = false;
  export let available = true;
  export let playing = false;
  export let error = false;
  export let title = '';
  export let artist = '';
  export let cover = '';
  export let pos = 0;
  export let dur = 0;
  export let ontoggle = () => {};
  export let onprev = () => {};
  export let onnext = () => {};
  export let onseek = () => {};
  export let onintroend = () => {};

  let phase = 'hidden'; // hidden | popup | minimizing | mini
  let cardEl;
  let miniEl;
  let tx = 0;
  let ty = 0;
  let sx = 0.2;
  let sy = 0.2;
  let timer;
  let timer2;
  let timer3;
  let introPending = false;
  let dockExpanded = false;
  let failedCover = '';

  $: pct = dur > 0 ? Math.min(100, (pos / dur) * 100) : 0;
  $: if (show && available && phase === 'hidden') begin();

  const base = import.meta.env.BASE_URL;

  function formatTime(value) {
    if (!Number.isFinite(value) || value < 0) return '0:00';
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  async function begin() {
    introPending = true;
    dockExpanded = false;
    phase = 'popup';
    await tick();
    timer = setTimeout(minimize, 1600);
  }

  function minimize() {
    if (phase !== 'popup') return;
    clearTimeout(timer);
    if (cardEl && miniEl) {
      const card = cardEl.getBoundingClientRect();
      const mini = miniEl.getBoundingClientRect();
      tx = Math.round(mini.left + mini.width / 2 - (card.left + card.width / 2));
      ty = Math.round(mini.top + mini.height / 2 - (card.top + card.height / 2));
      sx = Math.max(0.05, miniEl.offsetWidth / cardEl.offsetWidth);
      sy = Math.max(0.05, miniEl.offsetHeight / cardEl.offsetHeight);
    }
    phase = 'minimizing';
    timer2 = setTimeout(() => {
      phase = 'mini';
      timer3 = setTimeout(() => {
        dockExpanded = false;
        if (!introPending) return;
        introPending = false;
        onintroend();
      }, 600);
    }, 950);
  }

  function stopAndCall(e, callback) {
    e.stopPropagation();
    callback();
  }

  function toggleDock() {
    dockExpanded = !dockExpanded;
  }

  function seek(e) {
    e.stopPropagation();
    onseek(Number(e.currentTarget.value));
  }

  function collapseOnPageClick() {
    if (phase === 'mini' && dockExpanded && !introPending) dockExpanded = false;
  }

  function collapseOnEscape(e) {
    if (e.key === 'Escape' && phase === 'mini' && dockExpanded && !introPending) dockExpanded = false;
  }

  function coverFailed() {
    failedCover = cover;
  }

  onDestroy(() => {
    clearTimeout(timer);
    clearTimeout(timer2);
    clearTimeout(timer3);
  });
</script>

<svelte:window on:click={collapseOnPageClick} on:keydown={collapseOnEscape} />

{#if available}
  {#if phase === 'popup' || phase === 'minimizing'}
    <div class="backdrop" class:out={phase === 'minimizing'} role="presentation" on:click={minimize}></div>
    <div
      class="card"
      class:go={phase === 'minimizing'}
      style="--tx:{tx}px;--ty:{ty}px;--sx:{sx};--sy:{sy}"
      bind:this={cardEl}
      role="dialog"
      aria-modal="true"
      aria-label="Pemutar musik"
    >
      <div class="player-header">
        <div class="cover">
          {#if cover && failedCover !== cover}
            <img src="{base}{cover}" alt="" on:error={coverFailed} />
          {:else}
            <span class="cover-vinyl"><span class="cover-heart"><Heart /></span></span>
          {/if}
        </div>
        <div class="track-meta">
          <h3 class="track-title" title={title}>{title}</h3>
          <p class="track-artist" title={artist}>{artist}</p>
        </div>
      </div>

      <div class="player-details">
        <div class="time-row">
          <span>{formatTime(pos)}</span>
          <div class="progress-control">
            <div class="progress-track" aria-hidden="true"><span style="width:{pct}%"></span></div>
            <input
              class="progress-input"
              type="range"
              min="0"
              max={dur}
              step="0.1"
              value={pos}
              disabled={dur <= 0 || phase !== 'mini'}
              on:input={seek}
              on:click={(e) => e.stopPropagation()}
              aria-label="Posisi lagu"
              aria-valuetext={formatTime(pos)}
            />
          </div>
          <span>{formatTime(dur)}</span>
        </div>
        <div class="player-controls">
          <button class="player-skip prev" on:click={(e) => stopAndCall(e, onprev)} disabled={phase !== 'mini'} aria-label="Lagu sebelumnya">
            <Icon name="arrow" size={19} />
          </button>
          <button class="player-play" on:click={(e) => stopAndCall(e, ontoggle)} disabled={phase !== 'mini'} aria-label={playing ? 'Jeda lagu' : 'Putar lagu'}>
            {#if playing}<span class="pause-glyph"><i></i><i></i></span>{:else}<span class="play-glyph"></span>{/if}
          </button>
          <button class="player-skip" on:click={(e) => stopAndCall(e, onnext)} disabled={phase !== 'mini'} aria-label="Lagu berikutnya">
            <Icon name="arrow" size={19} />
          </button>
        </div>
        {#if error}<p class="player-error">File lagu tidak bisa diputar. Periksa path di konfigurasi.</p>{/if}
      </div>
    </div>
  {/if}

  <div
    class="mini"
    class:show={phase === 'mini'}
    class:expanded={dockExpanded}
    bind:this={miniEl}
    aria-hidden={phase !== 'mini'}
    role="group"
    aria-label="Pemutar musik"
  >
    {#if dockExpanded}
      <div class="player-header">
        <button
          class="cover cover-button"
          on:click={(e) => stopAndCall(e, toggleDock)}
          tabindex={phase === 'mini' ? 0 : -1}
          aria-expanded={dockExpanded}
          aria-label="Kecilkan pemutar"
        >
          {#if cover && failedCover !== cover}
            <img src="{base}{cover}" alt="" on:error={coverFailed} />
          {:else}
            <span class="cover-vinyl"><span class="cover-heart"><Heart /></span></span>
          {/if}
        </button>
        <div class="track-meta">
          <h3 class="track-title" title={title}>{title}</h3>
          <p class="track-artist" title={artist}>{artist}</p>
        </div>
      </div>
      <div class="player-details">
        <div class="time-row">
          <span>{formatTime(pos)}</span>
          <div class="progress-control">
            <div class="progress-track" aria-hidden="true"><span style="width:{pct}%"></span></div>
            <input
              class="progress-input"
              type="range"
              min="0"
              max={dur}
              step="0.1"
              value={pos}
              disabled={dur <= 0}
              on:input={seek}
              on:click={(e) => e.stopPropagation()}
              aria-label="Posisi lagu"
              aria-valuetext={formatTime(pos)}
            />
          </div>
          <span>{formatTime(dur)}</span>
        </div>
        <div class="player-controls">
          <button
            class="player-skip prev"
            on:click={(e) => stopAndCall(e, onprev)}
            tabindex={phase === 'mini' ? 0 : -1}
            aria-label="Lagu sebelumnya"
          ><Icon name="arrow" size={19} /></button>
          <button
            class="player-play"
            on:click={(e) => stopAndCall(e, ontoggle)}
            tabindex={phase === 'mini' ? 0 : -1}
            aria-label={playing ? 'Jeda lagu' : 'Putar lagu'}
          >
            {#if playing}<span class="pause-glyph"><i></i><i></i></span>{:else}<span class="play-glyph"></span>{/if}
          </button>
          <button
            class="player-skip"
            on:click={(e) => stopAndCall(e, onnext)}
            tabindex={phase === 'mini' ? 0 : -1}
            aria-label="Lagu berikutnya"
          ><Icon name="arrow" size={19} /></button>
        </div>
        {#if error}<p class="player-error">File lagu tidak bisa diputar. Periksa path di konfigurasi.</p>{/if}
      </div>
    {:else}
      <button
        class="closed-thumb"
        on:click={(e) => stopAndCall(e, toggleDock)}
        tabindex={phase === 'mini' ? 0 : -1}
        aria-expanded={dockExpanded}
        aria-label="Buka pemutar musik"
      >
        {#if cover && failedCover !== cover}
          <img src="{base}{cover}" alt="" on:error={coverFailed} />
        {:else}
          <span class="cover-vinyl"><span class="cover-heart"><Heart /></span></span>
        {/if}
      </button>
    {/if}
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 65;
    background: rgba(15, 2, 10, 0.22);
    backdrop-filter: blur(7px);
    animation: fadein 0.4s backwards;
  }
  @keyframes fadein { from { opacity: 0; } }

  .card {
    position: fixed;
    z-index: 70;
    inset: 0;
    width: min(32rem, calc(100% - var(--pad) - var(--pad)));
    height: max-content;
    margin: auto;
    padding: 0.65rem;
    text-align: left;
    border-radius: 1.5rem;
    background: linear-gradient(130deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.08));
    border: 1px solid var(--glass-b);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 18px 55px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 77, 125, 0.2);
    color: var(--cream);
    animation: cardin 0.55s cubic-bezier(0.2, 1.4, 0.4, 1) backwards;
    transition: transform 0.95s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, border-radius 0.95s ease;
  }
  .card.go { transform: translate(var(--tx), var(--ty)) scale(var(--sx), var(--sy)); opacity: 0.8; border-radius: 50%; pointer-events: none; }
  @keyframes cardin { from { opacity: 0; transform: scale(0.82); } }
  .play-glyph {
    width: 0;
    height: 0;
    margin-left: 3px;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
    border-left: 10px solid currentColor;
  }
  .pause-glyph { display: flex; align-items: center; gap: 4px; height: 15px; }
  .pause-glyph i { display: block; width: 3px; height: 100%; border-radius: 2px; background: currentColor; }
  @keyframes minipop { from { opacity: 0; transform: translateY(-8px) scale(0.86); } }

  .player-header { display: flex; align-items: center; gap: 0.65rem; min-width: 0; }
  .cover {
    position: relative;
    display: grid;
    place-items: center;
    flex: none;
    width: 3.25rem;
    height: 3.25rem;
    overflow: hidden;
    border-radius: 50%;
    background: repeating-radial-gradient(circle at 50% 50%, #311322 0 2px, #4a1b32 2px 4px);
    box-shadow: 0 4px 12px rgba(55, 19, 41, 0.24);
    transform: rotate(-7deg);
  }
  .cover img { width: 100%; height: 100%; object-fit: cover; }
  .cover-vinyl {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: repeating-radial-gradient(circle at 50% 50%, #311322 0 2px, #4a1b32 2px 4px);
  }
  .cover-heart {
    display: grid;
    place-items: center;
    width: 38%;
    height: 38%;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff8fb1, #e11d48);
    color: #fff;
  }
  .cover-heart :global(svg) { width: 65%; height: 65%; }
  .cover-button { padding: 0; border: 0; cursor: pointer; }
  .track-meta { flex: 1; min-width: 0; text-align: left; }
  .track-title, .track-artist { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .track-title { font-family: inherit; font-size: 0.9rem; font-weight: 600; line-height: 1.3; color: var(--cream); }
  .track-artist { margin-top: 0.15rem; font-size: 0.76rem; line-height: 1.25; color: var(--muted); }
  .player-details { margin-top: 0.65rem; }
  .time-row { display: flex; align-items: center; gap: 0.6rem; color: var(--muted); font-size: 0.7rem; font-variant-numeric: tabular-nums; }
  .progress-control { position: relative; display: flex; align-items: center; flex: 1; height: 1.1rem; min-width: 0; }
  .progress-track { width: 100%; height: 5px; overflow: hidden; border-radius: 999px; background: rgba(255, 255, 255, 0.2); }
  .progress-track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #ff8fb1, #ff4d7d); transition: width 0.3s linear; }
  .progress-input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    appearance: none;
    background: transparent;
    cursor: pointer;
  }
  .progress-input:disabled { cursor: default; }
  .progress-input::-webkit-slider-runnable-track { height: 5px; background: transparent; }
  .progress-input::-moz-range-track { height: 5px; background: transparent; }
  .progress-input::-webkit-slider-thumb {
    width: 13px;
    height: 13px;
    margin-top: -4px;
    appearance: none;
    border: 0;
    border-radius: 50%;
    background: #ff6d98;
    box-shadow: 0 0 8px rgba(255, 77, 125, 0.7);
  }
  .progress-input::-moz-range-thumb { width: 13px; height: 13px; border: 0; border-radius: 50%; background: #ff6d98; box-shadow: 0 0 8px rgba(255, 77, 125, 0.7); }
  .player-controls { display: flex; align-items: center; justify-content: center; gap: 1.2rem; margin-top: 0.75rem; }
  .player-skip {
    display: grid;
    place-items: center;
    width: 2.2rem;
    height: 2.2rem;
    border: 0;
    background: transparent;
    color: #ff6d98;
    cursor: pointer;
  }
  .player-skip.prev { transform: rotate(180deg); }
  .player-play {
    display: grid;
    place-items: center;
    width: 2.9rem;
    height: 2.9rem;
    border: 0;
    border-radius: 50%;
    background: linear-gradient(145deg, #ff91b2, #ff6d98);
    color: #fff;
    box-shadow: 0 5px 14px rgba(255, 77, 125, 0.26);
    cursor: pointer;
    transition: transform 0.2s;
  }
  .player-play:active { transform: scale(0.92); }
  .player-error { margin-top: 0.6rem; text-align: center; color: var(--muted); font-size: 0.68rem; }
  .player-skip:disabled, .player-play:disabled { opacity: 0.45; cursor: default; }

  .mini {
    position: fixed;
    z-index: 60;
    top: calc(var(--safe-t) + 12px);
    right: max(var(--pad), calc((100vw - var(--maxw)) / 2 + var(--pad)));
    width: clamp(44px, 13vw, 58px);
    height: clamp(44px, 13vw, 58px);
    padding: 0;
    overflow: visible;
    border: 0;
    border-radius: 50%;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    opacity: 0;
    transform: scale(0.6);
    pointer-events: none;
    transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.2, 1.4, 0.4, 1), width 0.3s, height 0.3s, padding 0.3s, border-radius 0.3s;
  }
  .mini::after { display: none; }
  .mini.show { opacity: 1; transform: scale(1); pointer-events: auto; animation: minipop 0.6s cubic-bezier(0.2, 1.8, 0.4, 1); }
  .mini.expanded {
    width: min(32rem, calc(100vw - var(--pad) - var(--pad)));
    height: auto;
    padding: 0.65rem;
    overflow: hidden;
    border: 1px solid var(--glass-b);
    border-radius: 1.5rem;
    background: linear-gradient(130deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.08));
    color: var(--cream);
    box-shadow: 0 10px 34px rgba(0, 0, 0, 0.28), 0 2px 12px rgba(255, 143, 177, 0.18);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  .closed-thumb {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    padding: 0;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.85);
    border-radius: 50%;
    background: repeating-radial-gradient(circle at 50% 50%, #311322 0 2px, #4a1b32 2px 4px);
    box-shadow: 0 6px 18px rgba(35, 7, 23, 0.32), 0 0 20px rgba(255, 77, 125, 0.35);
    cursor: pointer;
  }
  .closed-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .closed-thumb .cover-vinyl { width: 100%; height: 100%; }
  .mini.expanded .cover { width: 3.25rem; height: 3.25rem; cursor: pointer; }
  .mini.expanded .player-details { animation: details-in 0.24s ease-out both; }
  @keyframes details-in { from { opacity: 0; transform: translateY(-5px); } }

  @media (max-width: 420px) {
    .card { padding: 0.6rem; }
    .cover { width: 2.85rem; height: 2.85rem; }
    .mini.expanded { padding: 0.55rem; }
    .mini.expanded .cover { width: 2.85rem; height: 2.85rem; }
    .player-header { gap: 0.5rem; }
    .track-title { font-size: 0.82rem; }
    .track-artist { font-size: 0.7rem; }
  }
</style>
