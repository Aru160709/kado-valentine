<script>
  import { fade } from 'svelte/transition';
  import Icon from './Icon.svelte';

  const base = import.meta.env.BASE_URL;

  export let item = null;
  export let onclose = () => {};

  let showStory = false;
  let lastItem = null;

  $: if (item !== lastItem) {
    lastItem = item;
    showStory = false;
  }
  $: canFlip = Boolean(item && (item.date || item.story));

  function flip() {
    if (canFlip) showStory = !showStory;
  }

  function onKey(e) {
    if (!item) return;
    if (e.key === 'Escape') onclose();
    if (e.key === 'ArrowRight' && canFlip) showStory = true;
    if (e.key === 'ArrowLeft' && canFlip) showStory = false;
  }
</script>

<svelte:window on:keydown={onKey} />

{#if item}
  <div class="lb" role="presentation" on:click={(e) => e.target === e.currentTarget && onclose()} in:fade={{ duration: 180 }} out:fade={{ duration: 180 }}>
    <button class="x" on:click|stopPropagation={onclose} aria-label="Tutup">
      <Icon name="close" size={22} />
    </button>

    <div class="viewer" role="dialog" aria-modal="true" aria-label="Foto kenangan" tabindex="-1">
      <div class="flip-card" class:flipped={showStory}>
        <figure class="face front" aria-hidden={showStory}>
          <img src="{base}{item.src}" alt={item.alt || item.caption || 'Foto kenangan'} />
          <figcaption class="blank" aria-hidden="true"></figcaption>
        </figure>

        <article class="face back" aria-hidden={!showStory}>
          <p class="eyebrow">Catatan kecil kita</p>
          <h2>{item.caption || 'Kenangan kita'}</h2>
          {#if item.date}<time>{item.date}</time>{/if}
          {#if item.story}<p class="story">{item.story}</p>{/if}
        </article>
      </div>

      {#if canFlip}
        <button
          class="nav"
          class:prev={showStory}
          on:click={flip}
          aria-label={showStory ? 'Kembali ke foto' : 'Lihat ceritanya'}
        >
          <Icon name="arrow" size={21} />
        </button>
      {/if}
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
  .front img {
    display: block;
    width: 100%;
    min-height: 0;
    flex: 1;
    border-radius: 10px;
    object-fit: cover;
    background: #ffe4ec;
  }
  .blank { flex: none; height: clamp(38px, 7vh, 58px); }
  .back {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: auto;
    scrollbar-width: none;
    padding: clamp(24px, 6vw, 48px);
    transform: rotateY(180deg);
    color: #4c0519;
  }
  .back::-webkit-scrollbar { display: none; }
  .eyebrow { margin-top: auto; color: #b45f78; font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase; }
  h2 { margin-top: 12px; font-size: clamp(1.4rem, 2.7vw, 2.2rem); line-height: 1.15; }
  time { margin-top: 8px; color: #8c7780; font-size: 0.82rem; }
  .story { margin-top: 22px; margin-bottom: auto; font-size: clamp(0.9rem, 1vw, 1rem); line-height: 1.7; color: #43333a; }

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
    .front img { object-position: center; }
    .back { padding: 22px; }
    .story { margin-top: 14px; }
  }
</style>
