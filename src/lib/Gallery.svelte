<script>
  import Lightbox from './Lightbox.svelte';

  export let photos = [];

  const base = import.meta.env.BASE_URL;
  const rots = [-5, 3, -2, 6, -4, 2, -6, 4];
  let active = null;
</script>

<section class="head">
  <p class="eyebrow">Album kita</p>
  <h2>Kenangan Kita</h2>
  <p class="sub">Ketuk foto untuk memperbesar</p>
</section>

<section class="grid">
  {#each photos as p, i}
    <button
      class="polaroid"
      style="--r:{rots[i % rots.length]}deg;--i:{i};--ox:{i % 2 ? '60px' : '-60px'}"
      on:click={() => (active = p)}
    >
      <span class="tape"></span>
      <img src="{base}{p.src}" alt={p.caption} />
      <span class="cap script" aria-hidden="true"></span>
    </button>
  {/each}
</section>

<Lightbox item={active} onclose={() => (active = null)} />

<style>
  .head { text-align: center; padding: 0 var(--pad); }
  .eyebrow { font-size: 0.72rem; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); }
  h2 { margin-top: 6px; font-size: var(--fs-h2); }
  .sub { margin-top: 6px; font-size: clamp(0.85rem, 0.8rem + 0.25vw, 1.05rem); color: var(--muted); }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(22px, 3.5vw, 40px) clamp(12px, 2.5vw, 30px);
    max-width: var(--maxw);
    margin: 0 auto;
    padding: clamp(24px, 4vw, 52px) var(--pad) 12px;
  }
  @media (min-width: 640px) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  @media (min-width: 992px) { .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
  @media (min-width: 1440px) { .grid { grid-template-columns: repeat(5, minmax(0, 1fr)); } }

  .polaroid {
    position: relative;
    display: block;
    padding: 8px 8px 0;
    border: 0;
    border-radius: 3px;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
    transform: rotate(var(--r));
    transition: transform 0.3s, box-shadow 0.3s;
    animation: pop 0.9s cubic-bezier(0.2, 1.2, 0.4, 1) backwards;
    animation-delay: calc(var(--i) * 0.12s + 0.2s);
  }
  .polaroid:nth-child(even) { margin-top: 26px; }
  .polaroid:hover,
  .polaroid:active { transform: rotate(0) scale(1.05); z-index: 2; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.55), 0 0 30px rgba(255, 143, 177, 0.35); }
  @keyframes pop { from { opacity: 0; transform: translate(var(--ox), -240px) scale(0.2) rotate(-40deg); } }

  img { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; background: #ffe4ec; }
  .cap { display: block; height: 3.8em; padding: 10px 4px 13px; }
  .tape { position: absolute; top: -10px; left: 50%; width: 64px; height: 20px; transform: translateX(-50%) rotate(-3deg); background: rgba(255, 217, 160, 0.8); z-index: 1; }

</style>
