<script>
  import VideoLightbox from './VideoLightbox.svelte';
  import { reveal } from './reveal.js';
  import Icon from './Icon.svelte';

  export let videos = [];
  export let onplay = () => {};
  export let onstop = () => {};

  const base = import.meta.env.BASE_URL;
  let active = null;
  let failed = {};
  let ratios = {};

  function meta(i, e) {
    const video = e.currentTarget;
    if (video.videoWidth && video.videoHeight) {
      ratios = { ...ratios, [i]: video.videoWidth / video.videoHeight };
    }
  }

  function open(v, i) {
    active = { ...v, ratio: ratios[i] || 4 / 5 };
  }
</script>

<section class="head">
  <p class="eyebrow">Momen yang ingin kuulang</p>
  <h2>Cerita Kita Bergerak</h2>
  <p class="sub">Ada {videos.length} rekaman kecil dari waktu-waktu bahagiaku bersamamu.</p>
</section>

<section class="list">
  {#each videos as v, i}
    <article class="vcard" class:portrait={ratios[i] && ratios[i] < 1} use:reveal style="--d:{i * 0.1}s">
      <button class="polaroid" on:click={() => open(v, i)} aria-label="Putar video: {v.title}">
        <span class="tape"></span>
        <span class="thumbnail" style="--ar:{ratios[i] || 4 / 5}">
          <video
            muted
            playsinline
            preload="metadata"
            poster={v.poster ? `${base}${v.poster}` : undefined}
            src="{base}{v.src}"
            on:loadedmetadata={(e) => meta(i, e)}
            on:error={() => (failed = { ...failed, [i]: true })}
            on:loadeddata={(e) => {
              const video = e.currentTarget;
              if (!v.poster && video.currentTime === 0 && video.duration > 0) video.currentTime = Math.min(0.1, video.duration / 2);
            }}
          ></video>
          {#if failed[i]}
            <span class="ph">
              <Icon name="play" size={40} />
              <span>Video belum tersedia</span>
              <small>Simpan file di public/{v.src}</small>
            </span>
          {:else}
            <span class="play"><Icon name="play" size={28} /></span>
          {/if}
        </span>
        <span class="blank" aria-hidden="true"></span>
      </button>
    </article>
  {/each}
</section>

<VideoLightbox item={active} onclose={() => (active = null)} {onplay} {onstop} />

<style>
  .head { text-align: center; padding: 0 var(--pad); }
  .eyebrow { font-size: 0.72rem; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); }
  h2 { margin-top: 6px; font-size: var(--fs-h2); }
  .sub { margin: 6px auto 0; max-width: 34rem; font-size: clamp(0.85rem, 0.8rem + 0.25vw, 1.05rem); line-height: 1.55; color: var(--muted); }

  .list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(22px, 3.5vw, 40px) clamp(12px, 2.5vw, 30px);
    max-width: var(--maxw);
    margin: 0 auto;
    padding: clamp(24px, 4vw, 44px) var(--pad) 0;
  }
  .vcard { min-width: 0; }
  .vcard:nth-child(even) { margin-top: 26px; }
  @media (min-width: 640px) { .list { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  @media (min-width: 992px) { .list { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
  @media (min-width: 1440px) { .list { grid-template-columns: repeat(5, minmax(0, 1fr)); } }

  .polaroid {
    position: relative;
    display: block;
    width: 100%;
    padding: 8px 8px 0;
    border: 0;
    border-radius: 3px;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
    transform: rotate(var(--r, 0deg));
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .vcard:nth-child(4n + 1) .polaroid { --r: -3deg; }
  .vcard:nth-child(4n + 2) .polaroid { --r: 2deg; }
  .vcard:nth-child(4n + 3) .polaroid { --r: -1deg; }
  .vcard:nth-child(4n) .polaroid { --r: 3deg; }
  .polaroid:hover,
  .polaroid:focus-visible { transform: rotate(0) scale(1.04); z-index: 2; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.55), 0 0 30px rgba(255, 143, 177, 0.35); }
  .thumbnail {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    background: #12040c;
  }
  .thumbnail video { display: block; width: 100%; height: 100%; object-fit: cover; background: #12040c; }
  .play {
    position: absolute;
    left: 50%;
    top: 50%;
    display: grid;
    place-items: center;
    width: 54px;
    height: 54px;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(255, 255, 255, 0.75);
    border-radius: 50%;
    background: rgba(35, 7, 23, 0.55);
    color: #fff;
    backdrop-filter: blur(6px);
    transition: transform 0.2s, background 0.2s;
  }
  .polaroid:hover .play { transform: translate(-50%, -50%) scale(1.1); background: rgba(225, 29, 72, 0.8); }
  .blank { display: block; height: 3.8em; }
  .tape { position: absolute; top: -10px; left: 50%; width: 64px; height: 20px; transform: translateX(-50%) rotate(-3deg); background: rgba(255, 217, 160, 0.8); z-index: 1; }
  .ph {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background: linear-gradient(160deg, #3a0a24, #5a1040);
    color: var(--pink);
    text-align: center;
  }
  .ph span { font-size: 0.88rem; color: var(--cream); }
  .ph small { font-size: 0.7rem; color: var(--muted); overflow-wrap: anywhere; }
</style>
