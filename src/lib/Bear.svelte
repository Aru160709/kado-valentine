<script>
  export let mood = 'happy'; // happy | sad
  export let size = 140;
</script>

<svg class="bear" width={size} height={size * 1.05} viewBox="0 0 200 210" role="img" aria-label="Beruang lucu">
  <ellipse cx="100" cy="200" rx="54" ry="7" fill="#000" opacity="0.25" />
  <ellipse cx="68" cy="193" rx="17" ry="10" fill="#c98b5e" />
  <ellipse cx="132" cy="193" rx="17" ry="10" fill="#c98b5e" />
  <ellipse cx="100" cy="158" rx="46" ry="42" fill="#d9a273" />
  <ellipse cx="100" cy="166" rx="30" ry="28" fill="#f6dcc0" />

  <circle cx="52" cy="52" r="22" fill="#c98b5e" />
  <circle cx="52" cy="52" r="12" fill="#f4b8a0" />
  <circle cx="148" cy="52" r="22" fill="#c98b5e" />
  <circle cx="148" cy="52" r="12" fill="#f4b8a0" />
  <circle cx="100" cy="90" r="58" fill="#d9a273" />
  <ellipse cx="100" cy="108" rx="26" ry="20" fill="#f6dcc0" />
  <ellipse cx="100" cy="98" rx="8" ry="6" fill="#4a2c1d" />

  <g class="eye">
    <circle cx="74" cy="84" r="6.5" fill="#2b170e" />
    <circle cx="76.5" cy="81.5" r="2.2" fill="#fff" />
  </g>
  <g class="eye">
    <circle cx="126" cy="84" r="6.5" fill="#2b170e" />
    <circle cx="128.5" cy="81.5" r="2.2" fill="#fff" />
  </g>
  <ellipse cx="60" cy="104" rx="10" ry="6.5" fill="#ff8fb1" opacity="0.75" />
  <ellipse cx="140" cy="104" rx="10" ry="6.5" fill="#ff8fb1" opacity="0.75" />

  {#if mood === 'happy'}
    <path d="M90 112 Q100 123 110 112" stroke="#4a2c1d" stroke-width="3" fill="none" stroke-linecap="round" />
  {:else}
    <path d="M91 118 Q100 108 109 118" stroke="#4a2c1d" stroke-width="3" fill="none" stroke-linecap="round" />
    <path d="M66 70 L84 76 M134 70 L116 76" stroke="#4a2c1d" stroke-width="3" stroke-linecap="round" />
    <ellipse class="tear" cx="70" cy="98" rx="3.5" ry="5.5" fill="#8fd3f4" />
  {/if}

  <ellipse cx="58" cy="152" rx="13" ry="24" fill="#c98b5e" transform="rotate(30 58 152)" />
  <ellipse cx="142" cy="152" rx="13" ry="24" fill="#c98b5e" transform="rotate(-30 142 152)" />
  {#if mood === 'happy'}
    <g class="held">
      <path transform="translate(76 128) scale(2.1)" fill="#ff4d7d" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </g>
  {/if}
</svg>

<style>
  .bear { animation: bob 2.2s ease-in-out infinite; overflow: visible; }
  @keyframes bob { 50% { transform: translateY(-8px) rotate(1.5deg); } }
  .eye { transform-box: fill-box; transform-origin: center; animation: blink 4s infinite; }
  @keyframes blink { 0%, 93%, 100% { transform: scaleY(1); } 96% { transform: scaleY(0.1); } }
  .held { transform-box: fill-box; transform-origin: center; animation: hbeat 1s ease-in-out infinite; }
  @keyframes hbeat { 50% { transform: scale(1.15); } }
  .tear { animation: tear 1.6s ease-in infinite; }
  @keyframes tear { 0% { opacity: 0; transform: translateY(0); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(26px); } }
</style>
