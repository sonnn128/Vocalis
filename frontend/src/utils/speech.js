let speaking = false;
const AUDIO_SETTINGS_KEY = 'vocalis.audio.settings';

const defaultAudioSettings = {
  autoPlay: false,
  speakExample: false,
  rate: 0.95,
};

const pickVoice = (voices = []) => {
  if (!voices.length) return null;
  return (
    voices.find((v) => v.lang?.toLowerCase().startsWith('en-us')) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith('en')) ||
    voices[0]
  );
};

export const speakText = (text, options = {}) => {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return false;

  const synth = window.speechSynthesis;
  if (speaking) synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang || 'en-US';
  utterance.rate = options.rate || 0.95;
  utterance.pitch = options.pitch || 1;

  const voice = pickVoice(synth.getVoices());
  if (voice) utterance.voice = voice;

  utterance.onstart = () => {
    speaking = true;
  };
  utterance.onend = () => {
    speaking = false;
  };
  utterance.onerror = () => {
    speaking = false;
  };

  synth.speak(utterance);
  return true;
};

export const speakCard = (card, options = {}) => {
  if (!card?.frontText) return false;

  const ok = speakText(card.frontText, options);
  if (!ok || !options.speakExample || !card.example) return ok;

  setTimeout(() => {
    speakText(card.example, options);
  }, 900);
  return true;
};

export const stopSpeaking = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  speaking = false;
};

export const getAudioSettings = () => {
  try {
    const raw = localStorage.getItem(AUDIO_SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return { ...defaultAudioSettings, ...(parsed || {}) };
  } catch {
    return { ...defaultAudioSettings };
  }
};

export const saveAudioSettings = (settings) => {
  const next = { ...defaultAudioSettings, ...(settings || {}) };
  localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(next));
  return next;
};
