<script>
  import { fade } from 'svelte/transition';
  import { config } from '../config.js';
  import Letter from './Letter.svelte';
  import Counter from './Counter.svelte';
  import Heart from './Heart.svelte';
  import Icon from './Icon.svelte';
  import { reveal } from './reveal.js';

  export let onreplay = () => {};

  let done = false;

  const wa = config.wa || {};
  const waLink = wa.nomor ? `https://wa.me/${wa.nomor}?text=${encodeURIComponent(wa.pesan || '')}` : '';
</script>

<Letter
  teks={config.surat}
  dari={config.pengirim}
  untuk={config.pasangan}
  tanggal={config.tanggalSurat}
  ps={config.ps}
  ondone={() => (done = true)}
/>

{#if done}
  <div in:fade={{ duration: 900 }}>
    <Counter />

    <section class="reasons" use:reveal>
      <h2>Kenapa Aku Sayang Kamu</h2>
      <ol>
        {#each config.alasan as a, i}
          <li use:reveal style="--d:{i * 0.08}s">
            <span class="num">{i + 1}</span>
            <span>{a}</span>
          </li>
        {/each}
      </ol>
    </section>

    <section class="finale" use:reveal>
      <div class="big"><Heart /></div>
      <p class="script msg">Happy Valentine, {config.pasangan}</p>
      {#if waLink}
        <p class="watext">Kamu sudah sampai di akhir kejutan ini. Sekarang giliran kamu, ceritakan ke aku lewat WhatsApp ya.</p>
        <a class="btn wa" href={waLink} target="_blank" rel="noopener"><Icon name="chat" size={20} /> Chat aku di WhatsApp</a>
      {/if}
      <div class="again">
        <button class="btn ghost" on:click={onreplay}><Icon name="replay" size={18} /> Putar ulang kejutan</button>
      </div>
    </section>
  </div>
{/if}

<style>
  .reasons { max-width: 36rem; margin: 0 auto; padding: clamp(36px, 6vw, 64px) var(--pad) 0; text-align: center; }
  @media (min-width: 992px) {
    .reasons { max-width: 60rem; }
    ol { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  h2 { font-size: clamp(1.6rem, 1.2rem + 2vw, 2.6rem); margin-bottom: 16px; }
  ol { list-style: none; display: grid; gap: 12px; text-align: left; }
  li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 18px;
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
    border: 1px solid var(--glass-b);
    font-size: clamp(0.95rem, 0.88rem + 0.3vw, 1.15rem);
    line-height: 1.5;
  }
  .num {
    flex: none;
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff8fb1, #e11d48);
    color: #fff;
    font-weight: 600;
  }

  .finale { text-align: center; padding: 56px 20px 10px; }
  .big { width: 5.5rem; height: 5.5rem; margin: 0 auto 8px; color: var(--rose); filter: drop-shadow(0 0 24px rgba(255, 77, 125, 0.8)); animation: beat 1.2s ease-in-out infinite; }
  @keyframes beat { 0%, 100% { transform: scale(1); } 15% { transform: scale(1.18); } 30% { transform: scale(1); } 45% { transform: scale(1.12); } }
  .msg { margin-bottom: 14px; font-size: clamp(2.2rem, 1.6rem + 3vw, 3.8rem); color: #fff; text-shadow: 0 0 26px rgba(255, 77, 125, 0.8); }
  .watext { max-width: 26rem; margin: 0 auto 18px; font-size: clamp(0.92rem, 0.86rem + 0.3vw, 1.12rem); line-height: 1.6; color: var(--muted); }
  .wa {
    text-decoration: none;
    background: linear-gradient(135deg, #3ddc84, #25d366 50%, #128c7e);
    box-shadow: 0 12px 30px rgba(37, 211, 102, 0.4);
    animation: wapulse 2.2s ease-in-out infinite;
  }
  @keyframes wapulse { 50% { box-shadow: 0 12px 44px rgba(37, 211, 102, 0.75); transform: scale(1.04); } }
  .again { margin-top: 22px; }
</style>
