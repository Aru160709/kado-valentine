<script>
  export let name = 'heart';
  export let size = 22;
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  {#if name === 'image'}
    <rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.6" /><path d="M4 18l5-5 4 4 3-3 4 4" />
  {:else if name === 'play'}
    <rect x="3" y="5" width="18" height="14" rx="3" /><path d="M10 9.5l5 2.5-5 2.5z" />
  {:else if name === 'game'}
    <rect x="2.5" y="7" width="19" height="11" rx="5" /><path d="M7 10v5M4.5 12.5h5" /><circle cx="16" cy="11.5" r="1" /><circle cx="18.5" cy="14" r="1" />
  {:else if name === 'mail'}
    <rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3.5 7l8.5 6 8.5-6" />
  {:else if name === 'music'}
    <path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" />
  {:else if name === 'mute'}
    <path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" /><path d="M3 3l18 18" />
  {:else if name === 'close'}
    <path d="M6 6l12 12M18 6L6 18" />
  {:else if name === 'arrow'}
    <path d="M5 12h14M13 6l6 6-6 6" />
  {:else if name === 'chat'}
    <path d="M4 20l1.4-4A8.5 8.5 0 1 1 8.2 18.6L4 20z" /><path d="M9 10.5c0 2.5 2 4.5 4.5 4.5l1.3-1.3-1.8-1-.8.7a3 3 0 0 1-1.6-1.6l.7-.8-1-1.8L9 10.5z" />
  {:else if name === 'replay'}
    <path d="M4 12a8 8 0 1 0 3-6.2" /><path d="M4 4v4h4" />
  {/if}
</svg>
