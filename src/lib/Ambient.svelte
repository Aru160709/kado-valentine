<script>
  import Heart from './Heart.svelte';

  const colors = ['#ff4d7d', '#ff8fb1', '#ffb3c8', '#e11d48', '#ffd9a0'];
  const hearts = Array.from({ length: 16 }, (_, i) => ({
    left: Math.random() * 100,
    size: 12 + Math.random() * 24,
    dur: 10 + Math.random() * 12,
    delay: -Math.random() * 22,
    color: colors[i % colors.length],
    sway: 20 + Math.random() * 50
  }));
  const stars = Array.from({ length: 26 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 6 + Math.random() * 10,
    dur: 2 + Math.random() * 3,
    delay: -Math.random() * 5
  }));
</script>

<div class="amb" aria-hidden="true">
  {#each stars as s}
    <svg
      class="star"
      viewBox="0 0 24 24"
      style="left:{s.left}%;top:{s.top}%;width:{s.size}px;height:{s.size}px;animation-duration:{s.dur}s;animation-delay:{s.delay}s"
    >
      <path d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z" fill="#ffe9c9" />
    </svg>
  {/each}
  {#each hearts as h}
    <span
      class="h"
      style="left:{h.left}%;width:{h.size}px;height:{h.size}px;color:{h.color};animation-duration:{h.dur}s;animation-delay:{h.delay}s;--sway:{h.sway}px"
    >
      <Heart />
    </span>
  {/each}
</div>

<style>
  .amb { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
  .star { position: absolute; opacity: 0; animation: twinkle ease-in-out infinite; }
  @keyframes twinkle {
    0%, 100% { opacity: 0; transform: scale(0.4) rotate(0); }
    50% { opacity: 0.9; transform: scale(1) rotate(45deg); }
  }
  .h {
    position: absolute;
    bottom: -60px;
    opacity: 0.4;
    filter: drop-shadow(0 0 8px currentColor);
    animation: rise linear infinite;
  }
  @keyframes rise {
    0% { transform: translate(0, 0) rotate(-10deg); }
    50% { transform: translate(var(--sway), -55vh) rotate(10deg); }
    100% { transform: translate(0, -115vh) rotate(-10deg); opacity: 0; }
  }
</style>
