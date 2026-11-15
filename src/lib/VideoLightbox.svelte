<script>
  import { onDestroy, tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import Icon from './Icon.svelte';

  const base = import.meta.env.BASE_URL;

  export let item = null;
  export let onclose = () => {};
  export let onplay = () => {};
  export let onstop = () => {};

  let videoEl;
  let showStory = false;
  let savedTime = 0;
  let playBlocked = false;
  let playbackError = false;
  let lastItem = null;
  let videoActive = false;

  async function playVideo() {
    if (!videoEl) return;
    try {
      await videoEl.play();
      playBlocked = false;
      playbackError = false;
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        playBlocked = true;
      } else {
        playbackError = true;
        console.error('Video gagal diputar:', error);
      }
    }
  }

  async function flip() {
    if (!item) return;
    if (!showStory) {
      savedTime = videoEl?.currentTime || 0;
      videoEl?.pause();
      showStory = true;
      return;
    }

    showStory = false;
    await tick();
    if (videoEl) videoEl.currentTime = savedTime;
    await playVideo();
  }

  async function startOnOpen() {
    await tick();
    await playVideo();
  }

  function handleVideoPlay() {
    playBlocked = false;
    playbackError = false;
    if (videoActive) return;
    videoActive = true;
    onplay();
  }

  function stopVideoAudio() {
    if (!videoActive) return;
    videoActive = false;
    onstop();
  }

  function close() {
    if (videoEl && !videoEl.paused) videoEl.pause();
    stopVideoAudio();
    onclose();
  }

  function onKey(e) {
    if (!item) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight' && !showStory) {
      e.preventDefault();
      flip();
    }
    if (e.key === 'ArrowLeft' && showStory) {
      e.preventDefault();
      flip();
    }
  }

  $: if (item !== lastItem) {
    lastItem = item;
    showStory = false;
    savedTime = 0;
    playBlocked = false;
    playbackError = false;
    if (item) startOnOpen();
  }

  onDestroy(() => {
    if (videoEl && !videoEl.paused) videoEl.pause();
    stopVideoAudio();
  });
</script>

<svelte:window on:keydown={onKey} />

{#if item}
  <div class="lb" role="presentation" on:click={(e) => e.target === e.currentTarget && close()} in:fade={{ duration: 180 }} out:fade={{ duration: 180 }}>
    <button class="x" on:click|stopPropagation={close} aria-label="Tutup video">
      <Icon name="close" size={22} />
    </button>

    <div class="viewer" role="dialog" aria-modal="true" aria-label="Video kenangan" tabindex="-1">
      <div class="flip-card" class:flipped={showStory}>
        <figure class="face front" aria-hidden={showStory} inert={showStory}>
          <video
            bind:this={videoEl}
            controls
            playsinline
            preload="auto"
            src="{base}{item.src}"
            on:play={handleVideoPlay}
            on:pause={stopVideoAudio}
            on:ended={stopVideoAudio}
            on:error={() => { playbackError = true; stopVideoAudio(); }}
          ></video>
          {#if playBlocked || playbackError}
            <button class="play-again" on:click={playVideo}>
              <Icon name="play" size={20} />
              {playbackError ? 'Coba putar lagi' : 'Ketuk untuk memutar'}
            </button>
          {/if}
          <figcaption class="blank" aria-hidden="true"></figcaption>
        </figure>

        <article class="face back" aria-hidden={!showStory} inert={!showStory}>
          <p class="eyebrow">Cerita di balik video</p>
          <h2>{item.title || 'Kenangan kita'}</h2>
          {#if item.desc}<p class="story">{item.desc}</p>{/if}
        </article>
      </div>

      <button
        class="nav"
        class:prev={showStory}
        on:click={flip}
        aria-label={showStory ? 'Kembali ke video' : 'Lihat cerita video'}
      >
        <Icon name="arrow" size={21} />
      </button>
    </div>
  </div>
{/if}

<style>
  .lb {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: grid;
    place-items: center;
    overflow-y: auto;
    padding: calc(var(--safe-t) + 56px) 20px calc(var(--safe-b) + 20px);
    background: rgba(20, 3, 12, 0.86);
    backdrop-filter: blur(8px);
  }
  .viewer { display: grid; justify-items: center; gap: 14px; width: min(100%, 28rem, calc(80dvh - 120px)); perspective: 1400px; }
  .flip-card {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 5;
    transform-style: preserve-3d;
    transition: transform 0.72s cubic-bezier(0.2, 0.75, 0.25, 1);
  }
  .flip-card.flipped { transform: rotateY(180deg); }
  .face {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
  .front { display: flex; flex-direction: column; padding: 12px 12px 0; }
  .front video {
    display: block;
    width: 100%;
    min-height: 0;
    flex: 1;
    border-radius: 10px;
    object-fit: contain;
    background: #12040c;
  }
  .blank { flex: none; height: clamp(38px, 7vh, 58px); }
  .play-again {
    position: absolute;
    left: 50%;
    top: 50%;
    display: flex;
    align-items: center;
    gap: 8px;
    transform: translate(-50%, -50%);
    padding: 12px 18px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 999px;
    background: rgba(35, 7, 23, 0.78);
    color: #fff;
    white-space: nowrap;
    cursor: pointer;
  }
  .back {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-y: auto;
    scrollbar-width: none;
    padding: clamp(24px, 6vw, 48px);
    transform: rotateY(180deg);
    color: #4c0519;
  }
  .back::-webkit-scrollbar { display: none; }
  .eyebrow { color: #b45f78; font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase; }
  h2 { margin-top: 12px; font-size: clamp(1.5rem, 2.7vw, 2.2rem); line-height: 1.15; }
  .story { margin-top: 18px; font-size: clamp(0.9rem, 1vw, 1rem); line-height: 1.7; color: #43333a; }
  .nav {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }
  .nav:hover { background: rgba(255, 255, 255, 0.24); }
  .nav:active { transform: scale(0.92); }
  .nav.prev :global(svg) { transform: rotate(180deg); }
  .x {
    position: fixed;
    top: calc(var(--safe-t) + 16px);
    right: 16px;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    cursor: pointer;
  }
  .x:hover { background: rgba(255, 255, 255, 0.25); }

  @media (max-width: 640px) {
    .lb { padding: calc(var(--safe-t) + 64px) 14px calc(var(--safe-b) + 16px); }
    .back { padding: 22px; }
  }
</style>
