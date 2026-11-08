<script>
  import { reveal } from './reveal.js';
  import Icon from './Icon.svelte';

  export let videos = [];
  export let onplay = () => {};
  export let onstop = () => {};

  const base = import.meta.env.BASE_URL;
  let failed = {};
  let ratios = {};

  function meta(i, e) {
    const v = e.currentTarget;
    if (v.videoWidth && v.videoHeight) ratios = { ...ratios, [i]: v.videoWidth / v.videoHeight };
  }
</script>

<section class="head">
  <p class="eyebrow">Bioskop mini</p>
  <h2>Video Kita</h2>
  <p class="sub">Ada {videos.length} video untukmu</p>
</section>

<section class="list">
  {#each videos as v, i}
    <article class="vcard" class:portrait={ratios[i] && ratios[i] < 1} use:reveal style="--d:{i * 0.1}s">
      <div class="frame" style="--ar:{ratios[i] || 16 / 9}">
        <video
          controls
          playsinline
          preload="metadata"
          src="{base}{v.src}"
          on:loadedmetadata={(e) => meta(i, e)}
          on:error={() => (failed = { ...failed, [i]: true })}
          on:play={onplay}
          on:pause={onstop}
          on:ended={onstop}
        ></video>
        {#if failed[i]}
          <div class="ph">
            <Icon name="play" size={40} />
            <p>Video belum ditambahkan</p>
            <small>Taruh file di public/{v.src}</small>
          </div>
        {/if}
      </div>
      <div class="meta">
        <h3>{v.title}</h3>
        <p>{v.desc}</p>
      </div>
    </article>
  {/each}
</section>

<style>
  .head { text-align: center; padding: 0 var(--pad); }
  .eyebrow { font-size: 0.72rem; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); }
  h2 { margin-top: 6px; font-size: var(--fs-h2); }
  .sub { margin-top: 6px; font-size: clamp(0.85rem, 0.8rem + 0.25vw, 1.05rem); color: var(--muted); }

  .list {
    display: grid;
    gap: clamp(18px, 3vw, 32px);
    max-width: 48rem;
    margin: 0 auto;
    padding: clamp(24px, 4vw, 44px) var(--pad) 0;
  }
  @media (min-width: 992px) {
    .list { max-width: var(--maxw); grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }
  }
  .vcard.portrait { width: 100%; max-width: 24rem; justify-self: center; }

  .vcard {
    overflow: hidden;
    border-radius: 22px;
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
    border: 1px solid var(--glass-b);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  }
  .frame { position: relative; aspect-ratio: var(--ar, 1.7778); max-height: 78dvh; background: #12040c; }
  video { width: 100%; height: 100%; display: block; object-fit: contain; background: #12040c; }
  .ph {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: linear-gradient(160deg, #3a0a24, #5a1040);
    color: var(--pink);
    text-align: center;
    pointer-events: none;
  }
  .ph p { font-size: 0.95rem; color: var(--cream); }
  .ph small { font-size: 0.75rem; color: var(--muted); }
  .meta { padding: 14px 18px 18px; }
  h3 { font-size: clamp(1.15rem, 1rem + 0.6vw, 1.5rem); }
  .meta p { margin-top: 4px; font-size: clamp(0.88rem, 0.82rem + 0.25vw, 1.05rem); color: var(--muted); }
</style>
