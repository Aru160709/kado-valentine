<script>
  import { tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { config } from './config.js';
  import Ambient from './lib/Ambient.svelte';
  import Gate from './lib/Gate.svelte';
  import GiftStage from './lib/GiftStage.svelte';
  import Gallery from './lib/Gallery.svelte';
  import Videos from './lib/Videos.svelte';
  import Game from './lib/Game.svelte';
  import SuratPage from './lib/SuratPage.svelte';
  import Finale from './lib/Finale.svelte';
  import Icon from './lib/Icon.svelte';
  import MusicPlayer from './lib/MusicPlayer.svelte';

  const base = import.meta.env.BASE_URL;
  const playlist = Array.isArray(config.playlist)
    ? config.playlist
    : config.musik
      ? [{ src: config.musik, title: config.lagu?.judul || '', artist: config.lagu?.artis || '' }]
      : [];

  // urutan tetap: Kenangan > Video > Game > Surat
  const steps = [
    { id: 'kenangan', next: 'Lanjut ke video' },
    { id: 'video', next: 'Lanjut ke game' },
    { id: 'game', next: 'Lanjut ke surat' },
    { id: 'surat', next: '' }
  ];

  let stage = 'gate'; // gate | gift | main | finale
  let step = 0;
  let gameDone = false;
  let mainEl;
  let audio;
  let playing = false;
  let wasPlaying = false;
  let showPlayer = false;
  let audioError = false;
  let trackIndex = 0;
  let introPlayed = false;
  let finishMusicIntro;
  let pos = 0;
  let dur = 0;

  function syncTime() {
    if (!audio) return;
    pos = audio.currentTime;
    dur = audio.duration || 0;
  }

  $: current = steps[step].id;
  $: canNext = step < steps.length - 1 && (current !== 'game' || gameDone);
  $: currentTrack = playlist[trackIndex] || null;

  async function playAudio() {
    if (!audio) return;
    audio.volume = 0.6;
    try {
      await audio.play();
      playing = true;
      audioError = false;
    } catch (error) {
      playing = false;
      audioError = true;
    }
  }

  function toggleMusic() {
    if (!audio) return;
    if (playing) {
      audio.pause();
      playing = false;
    } else {
      playAudio();
    }
  }

  async function changeTrack(direction) {
    if (!playlist.length) return;
    const nextIndex = (trackIndex + direction + playlist.length) % playlist.length;
    if (audio) {
      audio.pause();
      playing = false;
      audio.currentTime = 0;
    }
    audioError = false;
    trackIndex = nextIndex;
    await tick();
    if (audio) {
      audio.currentTime = 0;
      playAudio();
    }
  }

  function startMusicIntro() {
    if (!playlist.length) return Promise.resolve();
    if (introPlayed) {
      if (!playing) playAudio();
      return Promise.resolve();
    }
    introPlayed = true;
    showPlayer = true;
    audioError = false;
    const intro = new Promise((resolve) => (finishMusicIntro = resolve));
    return intro;
  }

  function completeMusicIntro() {
    if (!finishMusicIntro) return;
    const finish = finishMusicIntro;
    finishMusicIntro = null;
    playAudio();
    finish();
  }

  function seekAudio(time) {
    if (!audio || !Number.isFinite(time) || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(time, audio.duration));
    syncTime();
  }

  function handleAudioError() {
    playing = false;
    audioError = true;
  }

  function videoPlay() {
    if (playing && audio) {
      wasPlaying = true;
      audio.pause();
      playing = false;
    }
  }

  function videoStop() {
    if (wasPlaying && audio) {
      wasPlaying = false;
      playAudio();
    }
  }

  function next() {
    if (!canNext) return;
    step += 1;
    if (mainEl) mainEl.scrollTo({ top: 0 });
  }

  function replay() {
    step = 0;
    gameDone = false;
    stage = 'gift';
  }
</script>

{#if currentTrack}
  <audio
    bind:this={audio}
    src="{base}{currentTrack.src}"
    preload="auto"
    on:timeupdate={syncTime}
    on:loadedmetadata={syncTime}
    on:ended={() => changeTrack(1)}
    on:error={handleAudioError}
  ></audio>
{/if}

<Ambient />

{#if playlist.length}
  <MusicPlayer
    show={showPlayer}
    available={true}
    {playing}
    title={currentTrack.title}
    artist={currentTrack.artist}
    cover={currentTrack.cover || ''}
    error={audioError}
    {pos}
    {dur}
    ontoggle={toggleMusic}
    onprev={() => changeTrack(-1)}
    onnext={() => changeTrack(1)}
    onseek={seekAudio}
    onintroend={completeMusicIntro}
  />
{/if}

{#if stage === 'gate'}
  <div class="layer" out:fade={{ duration: 500 }}>
    <Gate ondone={() => (stage = 'gift')} />
  </div>
{:else if stage === 'gift'}
  <div class="layer nos" in:fade={{ duration: 600 }} out:fade={{ duration: 500 }}>
    <GiftStage photos={config.photos} onopen={startMusicIntro} onnext={() => { step = 0; stage = 'main'; }} />
  </div>
{:else if stage === 'main'}
  <div class="layer" bind:this={mainEl} in:fade={{ duration: 700, delay: 300 }} out:fade={{ duration: 400 }}>
    {#key step}
      <main class="page" in:fly={{ y: 24, duration: 450 }}>
        {#if current === 'kenangan'}
          <Gallery photos={config.photos} />
        {:else if current === 'video'}
          <Videos videos={config.videos} onplay={videoPlay} onstop={videoStop} />
        {:else if current === 'game'}
          <Game onwin={() => (gameDone = true)} onskip={() => (gameDone = true)} skipAfter={config.game.lewatiSetelahKalah} />
        {:else}
          <SuratPage onfinish={() => (stage = 'finale')} />
        {/if}
      </main>
    {/key}

    {#if canNext}
      <div class="cta" transition:fade={{ duration: 300 }}>
        <button class="btn" on:click={next}>{steps[step].next} <Icon name="arrow" size={18} /></button>
      </div>
    {:else if current === 'game'}
      <div class="cta" transition:fade={{ duration: 300 }}>
        <span class="locked">Tangkap {config.game.target} cinta untuk lanjut</span>
      </div>
    {/if}
  </div>
{:else}
  <div class="layer finale-layer" in:fade={{ duration: 700 }} out:fade={{ duration: 400 }}>
    <Finale onreplay={replay} />
  </div>
{/if}

<style>
  .nos { overflow: hidden; }

  .page { position: relative; padding: 14px 0 calc(var(--safe-b) + 130px); }

  .cta {
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
  .cta > * { pointer-events: auto; }
  .cta .btn { animation: ctapulse 2.2s ease-in-out infinite; }
  @keyframes ctapulse { 50% { box-shadow: 0 12px 40px rgba(255, 77, 125, 0.8); } }
  .locked {
    padding: 11px 20px;
    border-radius: 999px;
    border: 1px solid var(--glass-b);
    background: rgba(40, 8, 26, 0.8);
    backdrop-filter: blur(10px);
    font-size: 0.85rem;
    color: var(--muted);
  }
</style>
