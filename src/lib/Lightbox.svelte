<script>
  import Icon from './Icon.svelte';

  export let item = null;
  export let onclose = () => {};

  const base = import.meta.env.BASE_URL;

  function onKey(e) {
    if (e.key === 'Escape') onclose();
  }
</script>

<svelte:window on:keydown={onKey} />

{#if item}
  <div class="lb" role="presentation" on:click={onclose}>
    <figure>
      <img src="{base}{item.src}" alt={item.caption} />
      <figcaption class="script">{item.caption}</figcaption>
    </figure>
    <button class="x" on:click={onclose} aria-label="Tutup"><Icon name="close" size={22} /></button>
  </div>
{/if}

<style>
  .lb {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 200;
    display: grid;
    place-items: center;
    padding: 20px;
    background: rgba(20, 3, 12, 0.82);
    backdrop-filter: blur(8px);
    animation: lbin 0.25s ease;
  }
  @keyframes lbin { from { opacity: 0; } }
  figure {
    width: min(100%, 28rem);
    padding: 12px 12px 0;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55);
    animation: figin 0.3s cubic-bezier(0.2, 1.4, 0.4, 1);
  }
  @keyframes figin { from { opacity: 0; transform: scale(0.7); } }
  img { display: block; width: 100%; max-height: 62dvh; object-fit: contain; background: #fff; }
  figcaption { padding: 14px 6px 18px; text-align: center; font-size: clamp(1.4rem, 1.1rem + 1vw, 2rem); color: #881337; }
  .x {
    position: absolute;
    top: max(16px, var(--safe-t));
    left: 16px;
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    cursor: pointer;
  }
</style>
