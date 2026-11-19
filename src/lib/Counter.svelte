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
  <h2>Sejak hari itu, kita</h2>
  <p class="sub">setiap detiknya kusimpan baik-baik.</p>
  <div class="row">
    <div class="cell"><b>{days}</b><span>hari</span></div>
    <div class="cell"><b>{hours}</b><span>jam</span></div>
    <div class="cell"><b>{mins}</b><span>menit</span></div>
    <div class="cell"><b>{secs}</b><span>detik</span></div>
  </div>
</section>

<style>
  .wrap { max-width: 38rem; margin: 0 auto; padding: 34px var(--pad) 0; text-align: center; }
  h2 { font-size: clamp(1.45rem, 1.1rem + 1.6vw, 2rem); }
  .sub { margin-top: 5px; color: var(--muted); font-size: 0.82rem; }
  .row { display: flex; justify-content: center; margin-top: 18px; }
  .cell { flex: 1; min-width: 0; padding: 0 6px; }
  .cell + .cell { border-left: 1px solid rgba(255, 217, 160, 0.22); }
  b { display: block; font-family: 'Playfair Display', serif; font-size: clamp(1.35rem, 1rem + 2.1vw, 2.3rem); color: var(--pink); font-weight: 600; line-height: 1.15; }
  span { font-size: clamp(0.68rem, 0.64rem + 0.2vw, 0.84rem); color: var(--muted); }
</style>
