<script>
  import { config } from '../config.js';
  import Counter from './Counter.svelte';
  import Heart from './Heart.svelte';
  import Icon from './Icon.svelte';
  import { reveal } from './reveal.js';

  export let onreplay = () => {};

  const wa = config.wa || {};
  const waLink = wa.nomor ? `https://wa.me/${wa.nomor}?text=${encodeURIComponent(wa.pesan || '')}` : '';
</script>

<section class="stage">
  <div class="night-sky" aria-hidden="true"></div>
  <div class="content">
    <header class="opening" use:reveal>
      <span class="overline">Satu hal lagi, dari hatiku</span>
      <div class="big"><Heart /></div>
      <h1>Selalu kamu,<br /><span>{config.pasangan}</span></h1>
      <p class="lead">Dan kalau aku boleh memilih lagi, di setiap cerita, aku tetap ingin menemukanmu.</p>
    </header>

    <Counter />

    <section class="reasons" use:reveal>
      <p class="overline">Hal-hal kecil yang berarti besar</p>
      <h2>Alasan aku memilihmu</h2>
      <ol>
        {#each config.alasan as reason, i}
          <li style="--i:{i}"><span>{String(i + 1).padStart(2, '0')}</span><p>{reason}</p></li>
        {/each}
      </ol>
    </section>

    <footer class="closing" use:reveal>
      <p class="script signoff">Dengan seluruh sayangku</p>
      <p class="message">Selamat Hari Valentine, {config.pasangan}</p>
      <p class="note">Terima kasih sudah menjadi bagian paling hangat dalam hidupku.</p>
      {#if waLink}
        <a class="btn wa" href={waLink} target="_blank" rel="noopener"><Icon name="chat" size={20} /> Kirim pesan untukku</a>
      {/if}
      <button class="btn replay" on:click={onreplay}><Icon name="replay" size={18} /> Putar ulang cerita kita</button>
    </footer>
  </div>
</section>

<style>
  .stage {
    position: relative;
    isolation: isolate;
    min-height: 100%;
    overflow: hidden auto;
    padding: calc(var(--safe-t) + 52px) var(--pad) calc(var(--safe-b) + 42px);
    background: linear-gradient(160deg, #160513, #310a27 54%, #190617);
  }
  .night-sky {
    position: absolute;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
    background:
      radial-gradient(1.5px 1.5px at 12% 9%, rgba(255, 244, 220, 0.9) 98%, transparent),
      radial-gradient(1px 1px at 82% 13%, rgba(255, 217, 160, 0.8) 98%, transparent),
      radial-gradient(1px 1px at 68% 28%, rgba(255, 244, 220, 0.72) 98%, transparent),
      radial-gradient(1.5px 1.5px at 24% 37%, rgba(255, 217, 160, 0.82) 98%, transparent),
      radial-gradient(1px 1px at 91% 48%, rgba(255, 244, 220, 0.8) 98%, transparent),
      radial-gradient(1px 1px at 8% 68%, rgba(255, 217, 160, 0.75) 98%, transparent),
      radial-gradient(1.5px 1.5px at 76% 79%, rgba(255, 244, 220, 0.76) 98%, transparent),
      radial-gradient(1px 1px at 34% 91%, rgba(255, 217, 160, 0.75) 98%, transparent),
      radial-gradient(ellipse 45% 28% at 50% 16%, rgba(255, 77, 125, 0.2), transparent 100%),
      radial-gradient(ellipse 35% 20% at 50% 72%, rgba(116, 35, 108, 0.2), transparent 100%);
  }
  .night-sky::before,
  .night-sky::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #fff3d4;
    box-shadow: 0 0 10px 2px rgba(255, 217, 160, 0.6), 0 0 32px 7px rgba(255, 143, 177, 0.28);
    animation: twinkle 3s ease-in-out infinite alternate;
  }
  .night-sky::before { top: 19%; left: 18%; }
  .night-sky::after { top: 55%; right: 15%; width: 3px; height: 3px; animation-delay: 1.4s; }
  @keyframes twinkle { to { opacity: 0.28; transform: scale(0.65); } }

  .content { width: min(100%, 48rem); margin: 0 auto; text-align: center; }
  .opening { padding: clamp(12px, 4vh, 38px) 0 0; }
  .overline {
    color: var(--gold);
    font-size: 0.68rem;
    letter-spacing: 0.28em;
    line-height: 1.6;
    text-transform: uppercase;
  }
  .big {
    width: clamp(66px, 10vw, 94px);
    height: clamp(66px, 10vw, 94px);
    margin: 22px auto 16px;
    color: var(--pink);
    filter: drop-shadow(0 0 18px rgba(255, 77, 125, 0.8)) drop-shadow(0 0 50px rgba(255, 77, 125, 0.35));
    animation: heartbeat 1.5s ease-in-out infinite;
  }
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    18% { transform: scale(1.12); }
    34% { transform: scale(1); }
    48% { transform: scale(1.08); }
  }
  h1 {
    font-size: clamp(2.6rem, 8vw, 5rem);
    line-height: 1.02;
    color: #fff7f4;
    text-shadow: 0 4px 35px rgba(255, 143, 177, 0.3);
  }
  h1 span { color: var(--pink); font-style: italic; }
  .lead {
    max-width: 32rem;
    margin: 18px auto 0;
    color: var(--muted);
    font-size: clamp(0.92rem, 1.2vw, 1.08rem);
    line-height: 1.75;
  }

  .reasons { max-width: 38rem; margin: 38px auto 0; }
  .reasons h2 { margin-top: 8px; font-size: clamp(1.7rem, 4vw, 2.4rem); }
  ol { margin: 18px 0 0; list-style: none; text-align: left; }
  li {
    display: grid;
    grid-template-columns: 2.5rem minmax(0, 1fr);
    align-items: baseline;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(255, 217, 160, 0.18);
    animation: rise-in 0.7s both;
    animation-delay: calc(var(--i) * 0.1s);
  }
  li:first-child { border-top: 1px solid rgba(255, 217, 160, 0.18); }
  li > span { color: var(--gold); font-family: 'Playfair Display', Georgia, serif; font-size: 1rem; font-style: italic; }
  li p { color: var(--cream); font-size: clamp(0.92rem, 1.3vw, 1.05rem); line-height: 1.6; }
  @keyframes rise-in { from { opacity: 0; transform: translateY(10px); } }

  .closing { padding: 36px 0 8px; }
  .signoff { color: var(--gold); font-size: clamp(1.1rem, 2.4vw, 1.5rem); }
  .message {
    margin-top: 8px;
    color: #fff;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.8rem, 5.2vw, 3.2rem);
    line-height: 1.14;
    text-shadow: 0 0 28px rgba(255, 77, 125, 0.35);
  }
  .note { max-width: 28rem; margin: 12px auto 22px; color: var(--muted); font-size: 0.9rem; line-height: 1.65; }
  .btn { margin: 6px 5px; text-decoration: none; }
  .wa {
    background: linear-gradient(135deg, #3ddc84, #25d366 50%, #128c7e);
    box-shadow: 0 10px 28px rgba(37, 211, 102, 0.28);
  }
  .replay { background: rgba(255, 255, 255, 0.08); border: 1px solid var(--glass-b); box-shadow: none; backdrop-filter: blur(10px); }

  @media (max-width: 480px) {
    .stage { padding-top: calc(var(--safe-t) + 28px); }
    .opening { padding-top: 6px; }
    .big { margin-top: 16px; }
    .reasons { margin-top: 30px; }
    li { gap: 6px; }
    .closing { padding-top: 28px; }
  }
</style>
