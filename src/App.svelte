<script>
  import { fade, fly } from 'svelte/transition';
  import { config } from './config.js';
  import Ambient from './lib/Ambient.svelte';
  import Gate from './lib/Gate.svelte';
  import GiftStage from './lib/GiftStage.svelte';
  import Gallery from './lib/Gallery.svelte';
  import Videos from './lib/Videos.svelte';
  import Game from './lib/Game.svelte';
  import SuratPage from './lib/SuratPage.svelte';
  import Heart from './lib/Heart.svelte';
  import Icon from './lib/Icon.svelte';
  import MusicPlayer from './lib/MusicPlayer.svelte';

  const base = import.meta.env.BASE_URL;

  // urutan tetap: Kenangan > Video > Game > Surat
  const steps = [
    { id: 'kenangan', next: 'Lanjut ke video' },
    { id: 'video', next: 'Lanjut ke game' },
    { id: 'game', next: 'Lanjut ke surat' },
    { id: 'surat', next: '' }
  ];

  let stage = 'gate'; // gate | gift | main
  let step = 0;
  let gameDone = false;
  let mainEl;
  let audio;
  let playing = false;
  let wasPlaying = false;
  let showPlayer = false;
  let audioOk = true;
  let pos = 0;
  let dur = 0;

  function syncTime() {
    if (!audio) return;
    pos = audio.currentTime;
    dur = audio.duration || 0;
  }

  $: current = steps[step].id;
  $: canNext = step < steps.length - 1 && (current !== 'game' || gameDone);

  function ensureMusic() {
    if (!audio || playing) return;
    audio.volume = 0.6;
    audio.play().then(() => (playing = true)).catch(() => {});
  }

  function toggleMusic() {
    if (!audio) return;
    if (playing) {
      audio.pause();
      playing = false;
    } else {
      audio.play().then(() => (playing = true)).catch(() => {});
    }
  }

  function videoPlay() {
    if (playing && audio) {
      wasPlaying = true;
      audio.pause();
      playing = false;
    }
  }

  function videoStop() {
    if (wasPlaying && audio) {
      wasPlaying = false;
      audio.play().then(() => (playing = true)).catch(() => {});
    }
  }

  function next() {
    if (!canNext) return;
    step += 1;
    if (mainEl) mainEl.scrollTo({ top: 0 });
  }

  function replay() {
    step = 0;
    gameDone = false;
    stage = 'gift';
  }
</script>

{#if config.musik}
  <audio
    bind:this={audio}
    src="{base}{config.musik}"
    loop
    preload="auto"
    on:timeupdate={syncTime}
    on:loadedmetadata={syncTime}
    on:error={() => (audioOk = false)}
  ></audio>
{/if}

<Ambient />

{#if config.musik}
  <MusicPlayer
    show={showPlayer}
    available={audioOk}
    {playing}
    title={config.lagu ? config.lagu.judul : ''}
    artist={config.lagu ? config.lagu.artis : ''}
    {pos}
    {dur}
    ontoggle={toggleMusic}
  />
{/if}

{#if stage === 'gate'}
  <div class="layer" out:fade={{ duration: 500 }}>
    <Gate onok={ensureMusic} ondone={() => { stage = 'gift'; showPlayer = true; }} />
  </div>
{:else if stage === 'gift'}
  <div class="layer nos" in:fade={{ duration: 600 }} out:fade={{ duration: 500 }}>
    <GiftStage photos={config.photos} onopen={ensureMusic} onnext={() => { step = 0; stage = 'main'; }} />
  </div>
{:else}
  <div class="layer" bind:this={mainEl} in:fade={{ duration: 700, delay: 300 }} out:fade={{ duration: 400 }}>
    <header class="topbar">
      <span class="brand script">Untuk {config.pasangan}</span>

      <div class="progress" aria-label="Langkah {step + 1} dari {steps.length}">
        {#each steps as s, i}
          <span class="dot" class:done={i < step} class:now={i === step}><Heart /></span>
        {/each}
      </div>

      <span class="mbtn ghost"></span>
    </header>

    {#key step}
      <main class="page" in:fly={{ y: 24, duration: 450 }}>
        {#if current === 'kenangan'}
          <Gallery photos={config.photos} />
        {:else if current === 'video'}
          <Videos videos={config.videos} onplay={videoPlay} onstop={videoStop} />
        {:else if current === 'game'}
          <Game onwin={() => (gameDone = true)} onskip={() => (gameDone = true)} skipAfter={config.game.lewatiSetelahKalah} />
        {:else}
          <SuratPage onreplay={replay} />
        {/if}
      </main>
    {/key}

    {#if canNext}
      <div class="cta" transition:fade={{ duration: 300 }}>
        <button class="btn" on:click={next}>{steps[step].next} <Icon name="arrow" size={18} /></button>
      </div>
    {:else if current === 'game'}
      <div class="cta" transition:fade={{ duration: 300 }}>
        <span class="locked">Tangkap {config.game.target} cinta untuk lanjut</span>
      </div>
    {/if}
  </div>
{/if}

<style>
  .nos { overflow: hidden; }

  .topbar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    max-width: var(--maxw);
    margin: 0 auto;
    padding: calc(var(--safe-t) + 12px) var(--pad) 10px;
  }
  .brand { min-width: 0; overflow: hidden; text-overflow: ellipsis; font-size: clamp(1.2rem, 4.8vw, 1.9rem); color: var(--pink); text-shadow: 0 0 20px rgba(255, 77, 125, 0.6); white-space: nowrap; }

  .progress { display: flex; gap: clamp(5px, 1.4vw, 10px); flex: none; }
  .dot { width: clamp(15px, 4vw, 22px); height: clamp(15px, 4vw, 22px); color: rgba(255, 255, 255, 0.2); transition: color 0.5s, transform 0.5s, filter 0.5s; }
  .dot.done { color: var(--pink); }
  .dot.now { color: var(--rose); transform: scale(1.3); filter: drop-shadow(0 0 8px rgba(255, 77, 125, 0.9)); animation: dbeat 1.4s ease-in-out infinite; }
  @keyframes dbeat { 50% { transform: scale(1.5); } }

  .mbtn {
    display: grid;
    place-items: center;
    flex: none;
    width: clamp(36px, 9vw, 46px);
    height: clamp(36px, 9vw, 46px);
    border: 1px solid var(--glass-b);
    border-radius: 50%;
    background: var(--glass);
    backdrop-filter: blur(10px);
    color: var(--gold);
    cursor: pointer;
  }
  .mbtn.ghost { visibility: hidden; }

  .page { position: relative; padding: 14px 0 calc(var(--safe-b) + 130px); }

  .cta {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    display: flex;
    justify-content: center;
    padding: 44px 18px calc(var(--safe-b) + 18px);
    background: linear-gradient(to top, rgba(27, 6, 18, 0.96) 35%, transparent);
    pointer-events: none;
  }
  .cta > * { pointer-events: auto; }
  .cta .btn { animation: ctapulse 2.2s ease-in-out infinite; }
  @keyframes ctapulse { 50% { box-shadow: 0 12px 40px rgba(255, 77, 125, 0.8); } }
  .locked {
    padding: 11px 20px;
    border-radius: 999px;
    border: 1px solid var(--glass-b);
    background: rgba(40, 8, 26, 0.8);
    backdrop-filter: blur(10px);
    font-size: 0.85rem;
    color: var(--muted);
  }
</style>
