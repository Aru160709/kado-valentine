<script>
  import { fade } from 'svelte/transition';
  import { config } from '../config.js';
  import Icon from './Icon.svelte';
  import Letter from './Letter.svelte';

  export let onfinish = () => {};

  let done = false;
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
  <div class="continue" in:fade={{ duration: 300 }}>
    <button class="btn" on:click={onfinish}>Buka penutup kecilku <Icon name="arrow" size={18} /></button>
  </div>
{/if}

<style>
  .continue {
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
  .continue .btn { pointer-events: auto; animation: ctapulse 2.2s ease-in-out infinite; }
  @keyframes ctapulse { 50% { box-shadow: 0 12px 40px rgba(255, 77, 125, 0.8); } }
</style>
