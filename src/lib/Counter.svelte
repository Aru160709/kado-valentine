<script>
  import { onMount } from 'svelte';
  import { config } from '../config.js';
  import { reveal } from './reveal.js';

  let now = Date.now();
  const start = new Date(config.tanggalJadian + 'T00:00:00').getTime();

  $: diff = Math.max(0, now - start);
  $: days = Math.floor(diff / 86400000);
  $: hours = Math.floor(diff / 3600000) % 24;
  $: mins = Math.floor(diff / 60000) % 60;
  $: secs = Math.floor(diff / 1000) % 60;

  onMount(() => {
    const timer = setInterval(() => (now = Date.now()), 1000);
    return () => clearInterval(timer);
  });
</script>

<section class="wrap" use:reveal>
  <h2>Kita Sudah Bersama</h2>
  <div class="row">
    <div class="cell"><b>{days}</b><span>hari</span></div>
    <div class="cell"><b>{hours}</b><span>jam</span></div>
    <div class="cell"><b>{mins}</b><span>menit</span></div>
    <div class="cell"><b>{secs}</b><span>detik</span></div>
  </div>
</section>

<style>
  .wrap { max-width: 36rem; margin: 0 auto; padding: clamp(36px, 6vw, 64px) var(--pad) 0; text-align: center; }
  h2 { font-size: clamp(1.6rem, 1.2rem + 2vw, 2.6rem); margin-bottom: 16px; }
  .row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .cell {
    padding: 14px 4px;
    border-radius: 18px;
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.05));
    border: 1px solid var(--glass-b);
  }
  b { display: block; font-family: 'Playfair Display', serif; font-size: clamp(1.5rem, 1rem + 2.4vw, 2.6rem); color: var(--pink); font-weight: 600; }
  span { font-size: clamp(0.78rem, 0.74rem + 0.2vw, 0.95rem); color: var(--muted); }
</style>
