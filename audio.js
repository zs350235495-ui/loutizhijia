// 跑道上有只鹅 - 音效合成器 (Web Audio API)
(function() {
  let audioCtx = null;
  let isAudioEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  // 鹅叫声 Goose Honk Sound
  window.playGooseHonk = function() {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  };

  // Click Sound
  window.playClickBeep = function() {
    if (!isAudioEnabled) return;
    initAudio();

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  };

  window.toggleAudioState = function() {
    isAudioEnabled = !isAudioEnabled;
    const btn = document.getElementById('audioToggleBtn');
    if (btn) {
      btn.innerHTML = isAudioEnabled ? '<span>🔊 音效 ON</span>' : '<span>🔇 音效 OFF</span>';
    }
    if (isAudioEnabled) playGooseHonk();
    return isAudioEnabled;
  };
})();
