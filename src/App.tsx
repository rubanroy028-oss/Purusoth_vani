import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Download, 
  Languages, 
  Volume2, 
  Sparkles, 
  History, 
  Copy, 
  Check, 
  CheckCircle2,
  Loader2, 
  Trash2, 
  RefreshCw, 
  Info, 
  FileAudio,
  PlusCircle,
  Clock,
  HelpCircle,
  HelpCircle as QuestionIcon,
  Key,
  X,
  Megaphone,
  Gauge,
  Wand2,
  Sliders,
  Radio,
  Mic,
  Upload
} from "lucide-react";
import { ClonedVoiceProfile } from "./types";
import { VoiceCloneModal, PRESET_VOICES } from "./components/VoiceCloneModal";

// Standard preset options for Indian and other languages
interface PresetText {
  label: string;
  language: string;
  category?: "tamil_ads" | "indian" | "global";
  style?: string;
  text: string;
}

const PRESET_TEXTS: PresetText[] = [
  // Commercial Advertisements
  {
    label: "📢 Mega Sale Advertisement",
    language: "Tamil",
    category: "tamil_ads",
    style: "tamil_ad_promo",
    text: "கவனம் நேயர்களே! இந்த ஆண்டின் மாபெரும் மெகா ஆஃபர் ஆரம்பமாகிவிட்டது! உங்கள் மனதிற்கு பிடித்த முன்னணி பிராண்டுகளுக்கு 50% வரை அதிரடி தள்ளுபடி! இந்த அரிய வாய்ப்பை தவறவிடாதீர்கள்! இன்றே உங்கள் அருகிலுள்ள கிளைக்கு வாருங்கள்!"
  },
  {
    label: "📻 Radio & TV Commercial",
    language: "Tamil",
    category: "tamil_ads",
    style: "tamil_ad_commercial",
    text: "ஹலோ மக்களே! சென்னை முதல் மதுரை வரை எல்லாரும் பேசும் ஒரே அதிரடி ஆஃபர்! தரமான தயாரிப்புகள், திகைக்க வைக்கும் தள்ளுபடி விலை! உடனே விசிட் பண்ணுங்க... ஸ்டாக் இருக்கும் வரை மட்டுமே, முந்துங்கள்!"
  },
  {
    label: "🍕 Restaurant & Food Offer",
    language: "Tamil",
    category: "tamil_ads",
    style: "tamil_ad_commercial",
    text: "சுடச்சுட மணமணக்கும் பாரம்பரிய சமையல் கலை! உங்கள் நாவிற்கு விருந்தளிக்கும் சுவையான உணவுகள், சிறப்பு தள்ளுபடி விலையில்! இன்றே குடும்பத்துடன் வந்து மகிழுங்கள், சிறந்த விருந்தோம்பலை அனுபவியுங்கள்!"
  },
  {
    label: "🌟 Brand Trust & Story",
    language: "Tamil",
    category: "tamil_ads",
    style: "tamil_ad_warm",
    text: "ஒவ்வொரு வீட்டிலும் மகிழ்ச்சியும் ஆரோக்கியமும் நிறைய வேண்டும். தலைமுறை தலைமுறையாக உங்கள் குடும்பத்தின் அசைக்க முடியாத நம்பகமான அடையாளம்! என்றென்றும் உங்கள் நல்வாழ்வுக்காக!"
  },
  {
    label: "🗣️ Natural Human Conversational",
    language: "Tamil",
    category: "tamil_ads",
    style: "natural_human_tamil",
    text: "வணக்கம் நண்பர்களே! எங்களோட இந்த புதிய குரல் தொழில்நுட்பம் மூலமா, இனி நீங்க எந்த ஒரு உரையையும் மிக இயல்பான, மனிதர் பேசுவது போன்ற தெளிவான தமிழ் குரலில் உருவாக்க முடியும். கேட்டுப் பாருங்கள்!"
  },
  // Indian Voices
  {
    label: "English (Indian Welcome)",
    language: "English (India)",
    category: "indian",
    style: "natural",
    text: "Welcome to our Text-to-Speech studio! We support incredibly natural-sounding voices for multiple Indian and global languages, running on Gemini 3.1. You can write any text and synthesize it, then download the standard WAV audio directly to your device."
  },
  {
    label: "Hindi (हिंदी - स्वागत)",
    language: "Hindi",
    category: "indian",
    style: "natural",
    text: "नमस्ते! आपका स्वागत है हमारे टेक्स्ट-टू-स्पीड स्टूडियो में। यहाँ आप किसी भी टेक्स्ट को खूबसूरत और प्राकृतिक आवाज़ों में बदल सकते हैं और डाउनलोड कर सकते हैं।"
  },
  {
    label: "Telugu (తెలుగు - స్వాగతం)",
    language: "Telugu",
    category: "indian",
    style: "natural",
    text: "నమస్తే! మా టెక్స్ట్-టు-స్పీచ్ అప్లికేషన్‌కు స్వాగతం. ఇక్కడ మీరు మీ వచనాన్ని సహజమైన మరియు స్పష్టమైన భారతీయ స్వరాలతో వినవచ్చు మరియు డౌన్‌లోడ్ చేసుకోవచ్చు."
  },
  {
    label: "Bengali (বাংলা) Greeting",
    language: "Bengali",
    category: "indian",
    style: "natural",
    text: "নমস্কার! আমাদের পাঠ্য-থেকে-বাক্য অ্যাপ্লিকেশনে আপনাকে স্বাগত জানাই। আপনার যেকোনো বাক্যকে এখানে সুন্দর এবং স্পষ্ট কন্ঠস্বরে রূপান্তর করুন।"
  },
  {
    label: "Sanskrit Shloka (संस्कृत)",
    language: "Sanskrit",
    category: "indian",
    style: "calm",
    text: "वसुधैव कुटुम्बकम्। उद्याने पुष्पं, गृहे च सन्तोषं भवतु।"
  }
];

interface VoiceOption {
  id: string;
  name: string;
  gender: "Female" | "Male";
  description: string;
  adRole: string;
}

const VOICES: VoiceOption[] = [
  { id: "Puck", name: "Puck (Male)", gender: "Male", description: "Energetic commercial voice (high impact delivery)", adRole: "Commercial / Radio Ad" },
  { id: "Kore", name: "Kore (Female)", gender: "Female", description: "Bright, lively commercial voice (engaging delivery)", adRole: "Commercial / Promo" },
  { id: "Charon", name: "Charon (Male)", gender: "Male", description: "Deep, resonant corporate and brand narrative voice", adRole: "Brand / Corporate" },
  { id: "Zephyr", name: "Zephyr (Female)", gender: "Female", description: "Warm, pleasant storytelling and friendly brand voice", adRole: "Brand Story / Narration" },
  { id: "Fenrir", name: "Fenrir (Male)", gender: "Male", description: "Crisp, authoritative announcement and broadcast voice", adRole: "Broadcast / News" }
];

interface LanguageOption {
  id: string;
  name: string;
  isIndian: boolean;
  accentOption: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  // Indian Voices & Accents
  { id: "en-IN", name: "English (Indian Accent)", isIndian: true, accentOption: "Indian English in-IN accent", flag: "🇮🇳" },
  { id: "hi", name: "Hindi (हिंदी)", isIndian: true, accentOption: "Hindi hi-IN pronunciation", flag: "🇮🇳" },
  { id: "ta", name: "Tamil (தமிழ்)", isIndian: true, accentOption: "Tamil ta-IN accent and tone", flag: "🇮🇳" },
  { id: "te", name: "Telugu (తెలుగు)", isIndian: true, accentOption: "Telugu te-IN accent", flag: "🇮🇳" },
  { id: "bn", name: "Bengali (বাংলা)", isIndian: true, accentOption: "Bengali bn-IN pronunciation", flag: "🇮🇳" },
  { id: "kn", name: "Kannada (ಕನ್ನಡ)", isIndian: true, accentOption: "Kannada kn-IN native accent", flag: "🇮🇳" },
  { id: "ml", name: "Malayalam (മലയാളം)", isIndian: true, accentOption: "Malayalam ml-IN regional tone", flag: "🇮🇳" },
  { id: "mr", name: "Marathi (मराठी)", isIndian: true, accentOption: "Marathi native pronunciation", flag: "🇮🇳" },
  
  // International Voices
  { id: "en-US", name: "English (US Accent)", isIndian: false, accentOption: "United States en-US accent", flag: "🇺🇸" },
  { id: "en-GB", name: "English (British Accent)", isIndian: false, accentOption: "British en-GB accent", flag: "🇬🇧" },
  { id: "es", name: "Spanish (Español)", isIndian: false, accentOption: "Spanish es-ES pronunciation", flag: "🇪🇸" },
  { id: "fr", name: "French (Français)", isIndian: false, accentOption: "French standard accent", flag: "🇫🇷" },
  { id: "de", name: "German (Deutsch)", isIndian: false, accentOption: "German accent", flag: "🇩🇪" },
  { id: "ja", name: "Japanese (日本語)", isIndian: false, accentOption: "Japanese native accent", flag: "🇯🇵" },
  { id: "ko", name: "Korean (한국어)", isIndian: false, accentOption: "Korean neutral accent", flag: "🇰🇷" },
  { id: "ar", name: "Arabic (العربية)", isIndian: false, accentOption: "Standard Arabic", flag: "🇸🇦" }
];

interface HistoryItem {
  id: string;
  text: string;
  originalText: string;
  languageName: string;
  voiceName: string;
  style: string;
  timestamp: string;
  audioUrl: string; // Blob URL
  audioSize: string;
}

export default function App() {
  const [text, setText] = useState<string>("");
  const [language, setLanguage] = useState<string>("ta");
  const [voiceName, setVoiceName] = useState<string>("Puck");
  const [style, setStyle] = useState<string>("tamil_ad_commercial");
  const [translationMode, setTranslationMode] = useState<boolean>(false);
  const [presetCategoryTab, setPresetCategoryTab] = useState<"all" | "tamil_ads" | "indian">("tamil_ads");
  
  // AI Tamil Ad Script Generator State
  const [showAdScriptModal, setShowAdScriptModal] = useState<boolean>(false);
  const [adPromptInput, setAdPromptInput] = useState<string>("");
  const [adCategoryType, setAdCategoryType] = useState<string>("mega_offer");
  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  const [scriptError, setScriptError] = useState<string | null>(null);

  // Active states
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [playedItemId, setPlayedItemId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Hybrid Mode Configs
  const [ttsMode, setTtsMode] = useState<"gemini" | "local">("gemini");
  const [pitch, setPitch] = useState<number>(1.0);
  const [rate, setRate] = useState<number>(1.1); // default 1.1x for brisk commercial delivery
  const [isQuotaExceeded, setIsQuotaExceeded] = useState<boolean>(false);
  const [localVoices, setLocalVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedLocalVoiceName, setSelectedLocalVoiceName] = useState<string>("");

  // Audio setup
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Custom renaming download targets
  const [customFileName, setCustomFileName] = useState<string>("commercial_voiceover");
  const [audioQuality, setAudioQuality] = useState<string>("high"); // high (24kHz Lossless) or standard (16kHz)

  // API Key Management State
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("custom_gemini_api_key") || "";
    }
    return "";
  });
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [tempApiKeyInput, setTempApiKeyInput] = useState<string>("");

  // Save custom API key
  const handleSaveApiKey = (keyToSave: string) => {
    const trimmed = keyToSave.trim();
    setCustomApiKey(trimmed);
    if (typeof window !== "undefined") {
      if (trimmed) {
        localStorage.setItem("custom_gemini_api_key", trimmed);
      } else {
        localStorage.removeItem("custom_gemini_api_key");
      }
    }
    if (trimmed) {
      setIsQuotaExceeded(false);
      setTtsMode("gemini");
      setErrorMsg(null);
    }
    setShowApiKeyModal(false);
  };

  // History session tracker
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);

  // Voice Cloning and Mimicry State
  const [showVoiceCloneModal, setShowVoiceCloneModal] = useState<boolean>(false);
  const [voiceCloneInitialTab, setVoiceCloneInitialTab] = useState<"record" | "upload" | "presets" | "saved">("upload");
  const [voiceCloneInitialFile, setVoiceCloneInitialFile] = useState<File | null>(null);
  const mainAudioFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDirectAudioFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVoiceCloneInitialFile(file);
    setVoiceCloneInitialTab("upload");
    setShowVoiceCloneModal(true);
    e.target.value = "";
  };

// Helper to strip heavy audio payloads to guarantee localStorage quota (<5MB) is never exceeded
const sanitizeVoiceForStorage = (voice: ClonedVoiceProfile): ClonedVoiceProfile => {
  if (!voice) return voice;
  const { referenceAudioBase64, referenceAudioUrl, ...lightweightProfile } = voice;
  return lightweightProfile;
};

const safeStorageSet = (key: string, value: string) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`[Storage] Quota exceeded on "${key}". Auto-recovering storage space.`);
    try {
      localStorage.removeItem("VOCAL_WAVE_ACTIVE_CLONED_VOICE");
      if (key === "VOCAL_WAVE_SAVED_CLONED_VOICES") {
        const list = JSON.parse(value);
        if (Array.isArray(list)) {
          const trimmed = list.slice(0, 5).map(sanitizeVoiceForStorage);
          localStorage.setItem(key, JSON.stringify(trimmed));
        }
      } else {
        localStorage.setItem(key, value);
      }
    } catch {
      // Fallback: state remains in React memory
    }
  }
};

  const [activeClonedVoice, setActiveClonedVoice] = useState<ClonedVoiceProfile | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("VOCAL_WAVE_ACTIVE_CLONED_VOICE");
        if (saved) {
          const parsed = JSON.parse(saved);
          const sanitized = sanitizeVoiceForStorage(parsed);
          if (parsed.referenceAudioBase64) {
            safeStorageSet("VOCAL_WAVE_ACTIVE_CLONED_VOICE", JSON.stringify(sanitized));
          }
          return sanitized;
        }
        return null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [savedClonedVoices, setSavedClonedVoices] = useState<ClonedVoiceProfile[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("VOCAL_WAVE_SAVED_CLONED_VOICES");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const sanitized = parsed.map(sanitizeVoiceForStorage);
            if (parsed.some((p: any) => p?.referenceAudioBase64)) {
              safeStorageSet("VOCAL_WAVE_SAVED_CLONED_VOICES", JSON.stringify(sanitized));
            }
            return sanitized;
          }
        }
        return PRESET_VOICES;
      } catch {
        return PRESET_VOICES;
      }
    }
    return PRESET_VOICES;
  });

  const handleSelectClonedVoice = (voice: ClonedVoiceProfile) => {
    const cleanVoice = sanitizeVoiceForStorage(voice);
    setActiveClonedVoice(cleanVoice);
    setTtsMode("gemini"); // Cloned voice uses Gemini neural speech model
    setErrorMsg(null);
    safeStorageSet("VOCAL_WAVE_ACTIVE_CLONED_VOICE", JSON.stringify(cleanVoice));
  };

  const handleSelectPrebuiltVoice = (id: string) => {
    setVoiceName(id);
    setActiveClonedVoice(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("VOCAL_WAVE_ACTIVE_CLONED_VOICE");
      } catch {
        // Safe ignore
      }
    }
  };

  const handleRemoveClonedVoice = () => {
    setActiveClonedVoice(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("VOCAL_WAVE_ACTIVE_CLONED_VOICE");
      } catch {
        // Safe ignore
      }
    }
  };

  const handleSaveVoice = (newVoice: ClonedVoiceProfile) => {
    const cleanVoice = sanitizeVoiceForStorage(newVoice);
    setSavedClonedVoices((prev) => {
      const exists = prev.some((v) => v.id === cleanVoice.id);
      const updated = exists ? prev.map((v) => (v.id === cleanVoice.id ? cleanVoice : v)) : [cleanVoice, ...prev];
      const storageList = updated.slice(0, 15).map(sanitizeVoiceForStorage);
      safeStorageSet("VOCAL_WAVE_SAVED_CLONED_VOICES", JSON.stringify(storageList));
      return updated;
    });
  };

  const handleDeleteSavedVoice = (voiceId: string) => {
    setSavedClonedVoices((prev) => {
      const updated = prev.filter((v) => v.id !== voiceId);
      const storageList = updated.slice(0, 15).map(sanitizeVoiceForStorage);
      safeStorageSet("VOCAL_WAVE_SAVED_CLONED_VOICES", JSON.stringify(storageList));
      return updated;
    });
    if (activeClonedVoice?.id === voiceId) {
      handleRemoveClonedVoice();
    }
  };

  // User's custom cloned voices list (excluding presets)
  const userCustomVoices = savedClonedVoices.filter((v) => !v.isPreset);
  const availableClonedVoices = activeClonedVoice && !userCustomVoices.some((v) => v.id === activeClonedVoice.id)
    ? [activeClonedVoice, ...userCustomVoices]
    : userCustomVoices;

  // Initialize browser-native voices lists
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadBrowserVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setLocalVoices(voices);
        if (voices.length > 0) {
          // Prefer Tamil local voice if available, else Indian voice
          const tamilVoice = voices.find(v => v.lang.startsWith("ta") || v.name.toLowerCase().includes("tamil"));
          const indianVoice = voices.find(v => v.lang.includes("IN") || v.name.toLowerCase().includes("india"));
          const defaultVoice = tamilVoice || indianVoice || voices.find(v => v.lang.startsWith("en")) || voices[0];
          setSelectedLocalVoiceName(defaultVoice.name);
        }
      };

      loadBrowserVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadBrowserVoices;
      }
    }
  }, []);

  // Initialize preset with Tamil Ad
  useEffect(() => {
    setText(PRESET_TEXTS[0].text);
    setLanguage("ta");
    setStyle(PRESET_TEXTS[0].style || "tamil_ad_commercial");
  }, []);

  // Real-time speed synchronization with HTML5 audio playback element
  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = rate;
    }
  }, [rate, audioUrl]);

  // Sync state with custom HTML audio element trigger
  useEffect(() => {
    if (audioPlayerRef.current) {
      const audio = audioPlayerRef.current;
      audio.playbackRate = rate;
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const onEnded = () => {
        setIsPlaying(false);
        setPlayedItemId(null);
      };
      const onTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      const onLoadedMetadata = () => {
        setDuration(audio.duration || 0);
        setCurrentTime(0);
      };

      audio.addEventListener("play", onPlay);
      audio.addEventListener("pause", onPause);
      audio.addEventListener("ended", onEnded);
      audio.addEventListener("timeupdate", onTimeUpdate);
      audio.addEventListener("loadedmetadata", onLoadedMetadata);

      // Trigger duration if metadata already present
      if (audio.duration) {
        setDuration(audio.duration);
      }

      return () => {
        audio.removeEventListener("play", onPlay);
        audio.removeEventListener("pause", onPause);
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("timeupdate", onTimeUpdate);
        audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      };
    }
  }, [audioUrl]);

  // Read language and accent names
  const activeLang = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];

  // Helper function to turn base64 PCM (24000Hz, 16-bit, mono) into a valid WAV file
  const convertPcmToWavBlob = (pcmBase64: string, sampleRate = 24000): Blob => {
    // Standard Base64 Decode
    const binaryString = window.atob(pcmBase64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Allocate ArrayBuffer for the wav file (44 bytes standard header + raw bytes)
    const arrayBuffer = new ArrayBuffer(44 + bytes.length);
    const view = new DataView(arrayBuffer);

    // Helpers to write text
    const writeString = (view: DataView, offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    // 1. Chunk ID "RIFF"
    writeString(view, 0, "RIFF");
    // 2. Chunk Size (36 + subChunk2Size)
    view.setUint32(4, 36 + bytes.length, true);
    // 3. Format "WAVE"
    writeString(view, 8, "WAVE");

    // "fmt " Subchunk
    // 4. Subchunk1 ID "fmt "
    writeString(view, 12, "fmt ");
    // 5. Subchunk1 Size (16 for standard PCM)
    view.setUint32(16, 16, true);
    // 6. Audio Format (1 = uncompressed PCM)
    view.setUint16(20, 1, true);
    // 7. Number of channels (1 = mono)
    view.setUint16(22, 1, true);
    // 8. Sample Rate (typically 24000Hz for Gemini TTS)
    view.setUint32(24, sampleRate, true);
    // 9. Byte Rate (SampleRate * NumChannels * BitsPerSample/8) -> 24000 * 1 * 2 = 48000
    const bytesPerSample = 2; // 16-bit = 2 bytes
    const channels = 1;
    view.setUint32(28, sampleRate * channels * bytesPerSample, true);
    // 10. Block Align (NumChannels * BitsPerSample/8) -> 1 * 2 = 2
    view.setUint16(32, channels * bytesPerSample, true);
    // 11. Bits per sample (16)
    view.setUint16(34, 16, true);

    // "data" Subchunk
    // 12. Subchunk2 ID "data"
    writeString(view, 36, "data");
    // 13. Subchunk2 Size
    view.setUint32(40, bytes.length, true);

    // Write Actual PCM bytes
    const pcmTargetView = new Uint8Array(arrayBuffer, 44);
    pcmTargetView.set(bytes);

    return new Blob([arrayBuffer], { type: "audio/wav" });
  };

  // Convert Web Audio AudioBuffer into a standard 16-bit PCM WAV Blob
  const audioBufferToWavBlob = (buffer: AudioBuffer): Blob => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const numSamples = buffer.length;
    const bytesPerSample = 2; // 16-bit PCM
    const blockAlign = numChannels * bytesPerSample;
    const dataSize = numSamples * blockAlign;
    const bufferSize = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    // RIFF identifier
    view.setUint32(0, 0x52494646, false);
    view.setUint32(4, 36 + dataSize, true);
    // WAVE identifier
    view.setUint32(8, 0x57415645, false);
    // "fmt " chunk
    view.setUint32(12, 0x666d7420, false);
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // Linear PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // 16-bit
    // "data" chunk
    view.setUint32(36, 0x64617461, false);
    view.setUint32(40, dataSize, true);

    let offset = 44;
    const channels: Float32Array[] = [];
    for (let c = 0; c < numChannels; c++) {
      channels.push(buffer.getChannelData(c));
    }

    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        let sample = channels[c][i];
        sample = Math.max(-1, Math.min(1, sample));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  };

  // Acoustic EQ and Timbre Matching Filter for Cloned Voice Profiles
  const applyClonedVoiceAcousticEQ = async (
    rawWavBlob: Blob,
    voice: ClonedVoiceProfile
  ): Promise<Blob> => {
    try {
      if (!voice.bassBoostDb && !voice.trebleBoostDb) {
        return rawWavBlob;
      }
      const arrayBuffer = await rawWavBlob.arrayBuffer();
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const tempCtx = new AudioCtxClass();
      const decodedBuffer = await tempCtx.decodeAudioData(arrayBuffer);
      tempCtx.close().catch(() => {});

      const sampleRate = decodedBuffer.sampleRate;
      const offlineCtx = new OfflineAudioContext(
        decodedBuffer.numberOfChannels,
        decodedBuffer.length,
        sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = decodedBuffer;

      let lastNode: AudioNode = source;

      // 1. Low-shelf filter for chest warmth & resonant bass
      if (voice.bassBoostDb && voice.bassBoostDb !== 0) {
        const lowShelf = offlineCtx.createBiquadFilter();
        lowShelf.type = "lowshelf";
        lowShelf.frequency.value = 220;
        lowShelf.gain.value = voice.bassBoostDb;
        lastNode.connect(lowShelf);
        lastNode = lowShelf;
      }

      // 2. High-shelf filter for vocal air & crisp articulation
      if (voice.trebleBoostDb && voice.trebleBoostDb !== 0) {
        const highShelf = offlineCtx.createBiquadFilter();
        highShelf.type = "highshelf";
        highShelf.frequency.value = 3500;
        highShelf.gain.value = voice.trebleBoostDb;
        lastNode.connect(highShelf);
        lastNode = highShelf;
      }

      lastNode.connect(offlineCtx.destination);
      source.start(0);

      const renderedBuffer = await offlineCtx.startRendering();
      return audioBufferToWavBlob(renderedBuffer);
    } catch (err) {
      console.warn("Acoustic EQ post-processing fallback to raw:", err);
      return rawWavBlob;
    }
  };

  // Support Browser-Native Speech Synthesis with Zero-Omission Sentence Chaining & Anti-Cutoff Keep-Alive
  const speakLocalVoice = (rawText: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setErrorMsg("Your web browser does not support local HTML5 speech synthesis. Please try Chrome, Safari, or Edge.");
      return;
    }

    // Cancel any active speak queues
    window.speechSynthesis.cancel();

    // Check if the input contains Tamil script
    const hasTamilScript = /[\u0B80-\u0BFF]/.test(rawText);

    // Attempt to map the selected voice or auto-select Tamil voice if Tamil script detected
    let activeLocalVoice = localVoices.find(v => v.name === selectedLocalVoiceName);
    if (hasTamilScript) {
      const tamilNativeVoice = localVoices.find(v => 
        v.lang.toLowerCase().startsWith("ta") || v.name.toLowerCase().includes("tamil")
      );
      if (tamilNativeVoice) {
        activeLocalVoice = tamilNativeVoice;
        setSelectedLocalVoiceName(tamilNativeVoice.name);
      } else if (activeLocalVoice && !activeLocalVoice.lang.toLowerCase().startsWith("ta") && !activeLocalVoice.name.toLowerCase().includes("tamil")) {
        // Inform user gently if local browser has no Tamil voice installed
        setErrorMsg("No native Tamil voice found in your browser. For authentic pronunciation, please select the 'Gemini 3.1 Neural (WAV)' mode.");
      }
    }

    // Split raw text into natural sentence / clause segments to bypass Chromium's 15-second cut-off bug!
    const segments = rawText.match(/[^.!?\n।;：；]+[.!?\n।;：；]*|\S+/g) || [rawText];
    const cleanedSegments = segments.map(s => s.trim()).filter(s => s.length > 0);

    if (cleanedSegments.length === 0) return;

    setIsSynthesizing(false);
    setIsPlaying(true);

    // Keep active references to prevent browser Garbage Collector from killing speech midway
    const utterances: SpeechSynthesisUtterance[] = [];
    (window as any).__activeSpeechUtterances = utterances;

    // Chrome keep-alive heartbeat interval to prevent sudden pause bug
    const keepAliveTimer = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        clearInterval(keepAliveTimer);
      }
    }, 4000);

    cleanedSegments.forEach((segmentText, idx) => {
      const utt = new SpeechSynthesisUtterance(segmentText);
      if (activeLocalVoice) {
        utt.voice = activeLocalVoice;
      }
      utt.pitch = pitch;
      utt.rate = rate;

      if (idx === cleanedSegments.length - 1) {
        utt.onend = () => {
          setIsPlaying(false);
          clearInterval(keepAliveTimer);
          (window as any).__activeSpeechUtterances = [];
        };
      }

      utt.onerror = (evt) => {
        console.warn("Local browser speech chunk event:", evt);
        if (idx === cleanedSegments.length - 1) {
          setIsPlaying(false);
          clearInterval(keepAliveTimer);
          (window as any).__activeSpeechUtterances = [];
        }
      };

      utterances.push(utt);
      window.speechSynthesis.speak(utt);
    });

    // Append to local generation history (flagged as Streaming)
    const voiceTag = activeLocalVoice 
      ? `${activeLocalVoice.name} (${activeLocalVoice.lang})` 
      : "System Default";

    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      text: `[Local Speech] ${rawText.substring(0, 85)}${rawText.length > 85 ? "..." : ""}`,
      originalText: rawText,
      languageName: activeLocalVoice ? `🗣️ Local (${activeLocalVoice.lang})` : "🗣️ Local (Default)",
      voiceName: activeLocalVoice ? activeLocalVoice.name.split(" ")[0] : "Browser System",
      style: `Speed: ${rate}x, Tone: ${pitch === 1 ? "Neutral" : pitch > 1 ? "High-Pitch" : "Deep-Pitch"}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      audioUrl: "", // No static file URL since it's streaming on browser hardware
      audioSize: "N/A (Local Stream)"
    };

    setHistoryList(prev => [historyItem, ...prev]);
  };

  // Trigger TTS Generation (Hybrid Gemini Server-Side & Local Hardware Fallback)
  const handleSynthesize = async () => {
    if (!text.trim()) return;

    setIsSynthesizing(true);
    setErrorMsg(null);

    // Pause any native element playbacks
    if (isPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    // Ensure we also pause local browser voice engine queue
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    // Fall back to Local Web Speech directly if selected manually or quota has already triggered
    if (ttsMode === "local") {
      speakLocalVoice(text.trim());
      return;
    }

    try {
      const payload = {
        text: text.trim(),
        language: activeLang.name,
        voiceName: activeClonedVoice ? activeClonedVoice.recommendedPrebuiltVoice : voiceName,
        style: style,
        accent: activeLang.isIndian ? activeLang.accentOption : "None",
        translationMode: translationMode,
        speed: activeClonedVoice?.recommendedSpeed ? activeClonedVoice.recommendedSpeed * rate : rate, // Send speed rate to backend prompt shaper
        customApiKey: customApiKey.trim(),
        clonedVoice: activeClonedVoice || undefined,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 120000); // 120 seconds browser client-side timeout threshold for heavy neural voices generation

      let response;
      try {
        response = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } catch (fetchErr: any) {
        if (fetchErr.name === "AbortError" || fetchErr.message?.includes("aborted")) {
          throw new Error("Neural generation took too long to complete. The system has automatically shifted to your unlimited local offline speech synthesizer!");
        }
        throw fetchErr;
      } finally {
        clearTimeout(timeoutId);
      }

      // Safely parse JSON to avoid parsing error if the response includes HTML (e.g. from Vite proxy fallback)
      let data: any = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (jsonErr) {
          console.log("Parsing info details for response:", jsonErr);
        }
      } else if (response.status !== 429) {
        // Log non-JSON output and throw a contextual error
        const textError = await response.text();
        console.log("API fallback response from /api/tts:", textError);
        throw new Error("The text-to-speech engine took too long to compile sound frames. The system has shifted to your local, offline web speech speech synthesizer.");
      }

      // Detect Quota Limit Exceeded (HTTP 429)
      if (response.status === 429 || data?.isQuotaExceeded) {
        setIsQuotaExceeded(true);
        setErrorMsg("Gemini API quota limit reached. You can switch to 'Local System' mode for unlimited synthesis or use a custom API key.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "An error occurred while generating speech audio.");
      }

      if (!data.audioBase64) {
        throw new Error("Audio data returned is empty. Please try again.");
      }

      // Convert server base64 PCM to standard WAV
      let soundBlob = convertPcmToWavBlob(data.audioBase64, data.sampleRate || 24000);
      if (activeClonedVoice) {
        soundBlob = await applyClonedVoiceAcousticEQ(soundBlob, activeClonedVoice);
      }
      const audioUrlObject = URL.createObjectURL(soundBlob);

      // Clean old active URL if any
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      setAudioUrl(audioUrlObject);

      // Track sizes
      const sizeKB = Math.round(soundBlob.size / 1024);
      const audioSizeFormatted = sizeKB > 1024 
        ? `${(sizeKB / 1024).toFixed(1)} MB` 
        : `${sizeKB} KB`;

      // Build history element
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        text: translationMode 
          ? `(Auto-Translated: ${activeLang.flag} ${activeLang.name}) ${text.substring(0, 80)}${text.length > 80 ? "..." : ""}`
          : text.substring(0, 90) + (text.length > 90 ? "..." : ""),
        originalText: text,
        languageName: `${activeLang.flag} ${activeLang.name}`,
        voiceName: activeClonedVoice ? `🎙️ ${activeClonedVoice.name}` : voiceName,
        style: style,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        audioUrl: audioUrlObject,
        audioSize: audioSizeFormatted
      };

      setHistoryList(prev => [historyItem, ...prev]);

      // Trigger automatic audio load & playback
      setTimeout(() => {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.load();
          audioPlayerRef.current.play().catch(e => {
            console.log("Auto playback was blocked by browser:", e);
          });
        }
      }, 50);

    } catch (e: any) {
      console.error("Speech engine synthesis error:", e);
      let cleanMsg = e?.message || "A temporary error occurred while generating audio. Please try again.";
      if (cleanMsg.includes("AbortError") || cleanMsg.includes("aborted")) {
        cleanMsg = "Audio generation timed out. Please try again.";
      }
      setErrorMsg(cleanMsg);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Toggle play/pause active audio
  const togglePlayMain = () => {
    if (audioPlayerRef.current && audioUrl) {
      if (isPlaying) {
        audioPlayerRef.current.pause();
      } else {
        audioPlayerRef.current.play().catch(e => {
          console.error("Trouble playing audio:", e);
        });
      }
    }
  };

  // Play a specific item from History
  const playHistoryItem = (item: HistoryItem) => {
    if (audioPlayerRef.current) {
      if (playedItemId === item.id) {
        // Toggle pause/play
        if (isPlaying) {
          audioPlayerRef.current.pause();
        } else {
          audioPlayerRef.current.play();
        }
      } else {
        // Set new audio source
        audioPlayerRef.current.src = item.audioUrl;
        audioPlayerRef.current.load();
        audioPlayerRef.current.play()
          .then(() => {
            setPlayedItemId(item.id);
            setAudioUrl(item.audioUrl);
          })
          .catch(e => console.error(e));
      }
    }
  };

  // Copy speech text to clipboard
  const handleCopyText = (textValue: string, id: string) => {
    navigator.clipboard.writeText(textValue);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Download logic helper
  const triggerDownload = (url: string | null, filenameLabel = "vocalwave-speech.wav") => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = filenameLabel;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const clearInput = () => {
    setText("");
    setErrorMsg(null);
  };

  const selectPreset = (preset: PresetText) => {
    setText(preset.text);
    // Find matching language key manually
    if (preset.language.includes("Hindi")) setLanguage("hi");
    else if (preset.language.includes("Tamil")) {
      setLanguage("ta");
      if (preset.style) setStyle(preset.style);
    }
    else if (preset.language.includes("Telugu")) setLanguage("te");
    else if (preset.language.includes("Bengali")) setLanguage("bn");
    else setLanguage("en-IN");
    if (preset.style) setStyle(preset.style);
    setErrorMsg(null);
  };

  // AI Tamil Ad Script generator handler
  const handleGenerateTamilAd = async () => {
    if (!adPromptInput.trim()) return;
    setIsGeneratingScript(true);
    setScriptError(null);
    try {
      const res = await fetch("/api/generate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: adPromptInput.trim(),
          adType: adCategoryType,
          customApiKey: customApiKey.trim()
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to generate Tamil ad script");
      }
      if (data.script) {
        setText(data.script);
        setLanguage("ta");
        const targetStyle = adCategoryType === "brand" ? "tamil_ad_warm" : adCategoryType === "conversational" ? "natural_human_tamil" : "tamil_ad_commercial";
        setStyle(targetStyle);
        setShowAdScriptModal(false);
        setAdPromptInput("");
      }
    } catch (err: any) {
      setScriptError(err.message || "Failed to generate script. You can also pick from the pre-written Tamil Ad presets!");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  return (
    <div className="min-h-screen pb-16 pt-6 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-between font-sans selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* Hidden Master Audio Control */}
      {audioUrl && (
        <audio 
          ref={audioPlayerRef} 
          src={audioUrl} 
          className="hidden" 
          preload="auto"
        />
      )}

      {/* Main Content Body */}
      <div>
        {/* Header Header */}
        <header className="mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="p-2.5 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-md">
                <Volume2 className="h-6 w-6 stroke-[2.5]" />
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight font-display bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                VocalWave Studio
              </h1>
            </div>
            <p className="text-sm text-slate-400 mt-2 font-medium">
              Next-Generation Multilingual Text To Speech powered by Gemini neural models.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Gemini 3.1 tts
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              ⚡ High-Fidelity WAV
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-950/60 border border-teal-500/40 text-xs text-teal-300 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              100% Verbatim Reading
            </span>
          </div>
        </header>

        {/* Outer Split Card Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Text inputs and quick selection presets */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-teal-500/10 text-teal-400">
                    <FileAudio className="h-4 w-4" />
                  </span>
                  <label htmlFor="tts-text-box" className="text-sm font-semibold tracking-wide text-slate-200">
                    Input Your Text
                  </label>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium">
                    Commercial Voice Supported
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {/* Hidden Global Audio File Input for Quick Sample Upload */}
                  <input
                    type="file"
                    ref={mainAudioFileInputRef}
                    accept="audio/*"
                    onChange={handleDirectAudioFileSelected}
                    className="hidden"
                  />

                  {/* Explicit Sample Audio Upload Button */}
                  <button 
                    onClick={() => mainAudioFileInputRef.current?.click()}
                    type="button"
                    className="text-xs py-1.5 px-3 rounded-lg bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ring-2 ring-teal-400/30"
                    title="Upload an audio file (MP3/WAV/M4A) directly to clone and mimic any voice"
                  >
                    <Upload className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>📁 Upload Sample Audio</span>
                  </button>

                  <button 
                    onClick={() => {
                      setVoiceCloneInitialTab("upload");
                      setVoiceCloneInitialFile(null);
                      setShowVoiceCloneModal(true);
                    }}
                    type="button"
                    className={`text-xs py-1.5 px-3 rounded-lg border font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                      activeClonedVoice
                        ? "bg-teal-500/25 hover:bg-teal-500/35 border-teal-400 text-teal-200 ring-2 ring-teal-500/30 shadow-teal-500/20"
                        : "bg-slate-900 hover:bg-slate-850 border-teal-500/40 text-teal-300"
                    }`}
                    title="Provide any voice sample to mimic and speak in that voice (Voice Mimic & Clone)"
                  >
                    <Wand2 className="h-3.5 w-3.5 text-teal-400 animate-pulse" />
                    <span>🎙️ Voice Clone Studio</span>
                    {activeClonedVoice && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-400 text-slate-950 font-bold">
                        ON
                      </span>
                    )}
                  </button>

                  <button 
                    onClick={() => {
                      setAdPromptInput("");
                      setScriptError(null);
                      setShowAdScriptModal(true);
                    }}
                    type="button"
                    className="text-xs py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-teal-500/20 hover:from-amber-500/30 hover:to-teal-500/30 border border-amber-500/40 text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    title="Generate authentic advertisement scripts with AI"
                  >
                    <Megaphone className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                    <span>AI Ad Script Generator</span>
                  </button>

                  <button 
                    onClick={clearInput}
                    type="button"
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 px-2 hover:bg-slate-800/60 rounded cursor-pointer"
                  >
                    Clear
                  </button>
                  <span className="text-xs font-mono text-slate-500">
                    {text.length} Chars
                  </span>
                </div>
              </div>

              {/* Sample Audio Upload Notification Box (When no cloned voice active) */}
              {!activeClonedVoice && (
                <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-teal-950/70 via-slate-900 to-emerald-950/60 border border-teal-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300 shrink-0 border border-teal-500/30">
                      <Upload className="h-4 w-4 text-teal-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-teal-200">
                          📁 Have a voice sample? (Upload Sample Audio)
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-teal-500/20 text-teal-300 font-mono border border-teal-500/30">
                          MP3 • WAV • M4A
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300/85 mt-0.5">
                        Upload a sample voice file to clone it — any text you type will be spoken in that exact voice!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => mainAudioFileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Audio File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVoiceCloneInitialTab("record");
                        setVoiceCloneInitialFile(null);
                        setShowVoiceCloneModal(true);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                      title="Record voice sample via microphone"
                    >
                      <Mic className="h-3.5 w-3.5 text-teal-400" />
                      <span>Record Voice</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Active Cloned Voice Banner */}
              {activeClonedVoice && (
                <div className="mb-3 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/80 border-2 border-emerald-500/70 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl animate-fade-in ring-1 ring-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-lg bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shrink-0">
                      <Radio className="h-5 w-5 text-emerald-400 animate-pulse" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                          🎙️ Active Cloned Voice:
                        </span>
                        <span className="text-xs font-extrabold text-white bg-emerald-500/30 px-2.5 py-0.5 rounded-md border border-emerald-400/50 shadow-sm">
                          {activeClonedVoice.name}
                        </span>
                        {activeClonedVoice.pitchHz && (
                          <span className="text-[11px] text-emerald-200/90 bg-slate-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                            {Math.round(activeClonedVoice.pitchHz)} Hz ({activeClonedVoice.vocalPitch || "Matched"})
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-emerald-200/90 mt-1">
                        {activeClonedVoice.vocalTimbre} • {activeClonedVoice.detectedAccent || "Natural"} • <span className="font-semibold text-emerald-300">Whatever text you type below will speak in this exact voice!</span>
                      </p>
                      <p className="text-[10px] text-teal-300/75 mt-0.5">
                        குரல் இணைப்பு தயார்: கீழே நீங்கள் கொடுக்கும் எந்த வாக்கியமும் இந்த குரலிலேயே பேசும்.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => setShowVoiceCloneModal(true)}
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold border border-teal-500/40 transition-all cursor-pointer shadow-sm hover:border-teal-400"
                    >
                      Change Voice
                    </button>
                    <button
                      onClick={handleRemoveClonedVoice}
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-500/40 transition-all cursor-pointer shadow-sm"
                      title="Reset to default voice"
                    >
                      Reset Voice
                    </button>
                  </div>
                </div>
              )}

              {/* Textarea Input Window */}
              <div className="relative group">
                <textarea
                  id="tts-text-box"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type anything here in Tamil, English, Hindi, or any chosen language, then click 'Voice Speech Options' to play and download..."
                  rows={9}
                  className="w-full bg-slate-950/80 border border-slate-800/80 focus:border-teal-500/80 text-slate-200 rounded-xl p-4 text-base leading-relaxed placeholder-slate-500 focus:outline-none transition-all group-hover:border-slate-850 resize-y"
                />
              </div>

              {/* Real-time Text Fidelity & Verbatim Reading Indicator */}
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>100% Verbatim Reading (No skipped words)</span>
                  </span>
                  {/[\u0B80-\u0BFF]/.test(text) && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-slate-400 text-[11px]">
                      ✨ Text detected — numbers and words fully articulated
                    </span>
                  )}
                </div>

                {text.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      // Clean up formatting: normalize extra whitespace, quotes and messy control chars
                      const cleaned = text
                        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
                        .replace(/[ \t]+/g, " ")
                        .replace(/\n{3,}/g, "\n\n")
                        .trim();
                      setText(cleaned);
                    }}
                    className="text-[11px] text-teal-400/80 hover:text-teal-300 transition-colors flex items-center gap-1 hover:underline cursor-pointer"
                    title="Clean extra spaces or emojis to ensure smoother TTS playback"
                  >
                    <Sparkles className="h-3 w-3" />
                    Clean Text
                  </button>
                )}
              </div>

              {/* Preset selectors segment with Category Filter Tabs */}
              <div className="mt-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <span className="block text-xs font-semibold text-slate-400 tracking-wider uppercase">
                    Text Presets & Samples
                  </span>
                  {/* Category tabs */}
                  <div className="flex items-center gap-1 bg-slate-950/80 p-1 border border-slate-800 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setPresetCategoryTab("tamil_ads")}
                      className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                        presetCategoryTab === "tamil_ads"
                          ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      📢 Commercial Ads
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetCategoryTab("indian")}
                      className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                        presetCategoryTab === "indian"
                          ? "bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      🇮🇳 Indian Languages
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetCategoryTab("all")}
                      className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                        presetCategoryTab === "all"
                          ? "bg-slate-800 text-slate-200 font-semibold"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      All Presets
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {PRESET_TEXTS.filter(p => {
                    if (presetCategoryTab === "tamil_ads") return p.category === "tamil_ads";
                    if (presetCategoryTab === "indian") return p.category === "indian";
                    return true;
                  }).map((p, i) => (
                    <button
                      key={i}
                      onClick={() => selectPreset(p)}
                      type="button"
                      className={`text-xs py-1.5 px-3 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                        p.category === "tamil_ads"
                          ? "border-amber-500/30 bg-amber-955/20 text-amber-200 hover:bg-amber-955/40 hover:border-amber-500/60"
                          : "border-slate-800 bg-slate-950/40 text-slate-300 hover:text-white hover:bg-slate-800/60 hover:border-slate-700"
                      }`}
                    >
                      {p.category === "tamil_ads" ? (
                        <Megaphone className="h-3.5 w-3.5 text-amber-400" />
                      ) : (
                        <PlusCircle className="h-3.5 w-3.5 text-teal-400" />
                      )}
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notification / Error Message Box */}
            {errorMsg && (
              <div className="bg-slate-900/90 border border-amber-500/40 text-amber-200 p-4 rounded-xl text-sm flex flex-col sm:flex-row items-start justify-between gap-3 shadow-xl backdrop-blur-md animate-fade-in">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-amber-200">
                      {isQuotaExceeded 
                        ? "Free Tier Quota Notice" 
                        : ttsMode === "local" 
                          ? "Local Voice Notice" 
                          : "TTS Generation Notice"}
                    </p>
                    <p className="text-amber-300/90 leading-relaxed text-xs">{errorMsg}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setTtsMode("gemini");
                      setErrorMsg(null);
                      handleSynthesize();
                    }}
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Retry WAV
                  </button>
                  <button
                    onClick={() => setErrorMsg(null)}
                    type="button"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Voices presets, languages options, actions synthesis */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 md:p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
              
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-teal-500/10 text-teal-400">
                      <Languages className="h-4 w-4" />
                    </span>
                    <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
                      Speech Customizer
                    </h3>
                  </div>

                  <span className={`text-[10px] tracking-wider uppercase font-mono px-2 py-0.5 rounded-full border ${
                    ttsMode === "gemini"
                      ? "bg-teal-950/40 text-teal-400 border-teal-500/20"
                      : "bg-emerald-950/40 text-emerald-400 border-emerald-500/20"
                  }`}>
                    {ttsMode === "gemini" ? "Gemini Neural" : "Local Browser"}
                  </span>
                </div>

                {/* Hybrid Engine Tab Selector */}
                <div className="grid grid-cols-2 p-1 bg-slate-950/80 border border-slate-800/80 rounded-xl relative">
                  <button
                    type="button"
                    onClick={() => {
                      setTtsMode("gemini");
                      setErrorMsg(null);
                    }}
                    className={`text-xs py-2 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                      ttsMode === "gemini"
                        ? "bg-slate-850 text-teal-450 font-semibold border border-slate-700/50 shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Gemini 3.1 Neural (WAV)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTtsMode("local");
                      setErrorMsg(null);
                    }}
                    className={`text-xs py-2 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                      ttsMode === "local"
                        ? "bg-slate-850 text-emerald-450 font-semibold border border-slate-700/50 shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Local System (Zero Quota)
                  </button>
                </div>

                {/* Quota Exhausted Auto Warning Panel */}
                {isQuotaExceeded && ttsMode === "local" && (
                  <div className="border border-amber-500/30 bg-amber-955/20 rounded-xl p-3 text-[11px] text-amber-300 leading-normal flex items-start gap-2 animate-pulse">
                    <Info className="h-4 w-4 shrink-0 text-amber-400" />
                    <div>
                      <strong>Free Tier Limits Active:</strong> Your local backup browser-level TTS is actively running! Test and preview unlimited speeches natively.
                    </div>
                  </div>
                )}

                {/* MODE A: GEMINI VOICE NEURAL RENDER */}
                {ttsMode === "gemini" && (
                  <div className="space-y-4 animate-fade-in">
                    {/* 1. Language Options */}
                    <div>
                      <label className="block text-xs text-slate-400 mb-2 font-medium font-mono uppercase tracking-wider">
                        Target Language & Accent Accent
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 p-3 rounded-xl focus:outline-none focus:border-teal-500 transition-all cursor-pointer text-sm"
                      >
                        <optgroup label="Popular Indian Language Voices" className="text-slate-400 bg-slate-950">
                          {LANGUAGES.filter(l => l.isIndian).map(l => (
                            <option key={l.id} value={l.id} className="text-slate-200 bg-slate-950">
                              {l.flag} {l.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="International Language Voices" className="text-slate-400 bg-slate-950">
                          {LANGUAGES.filter(l => !l.isIndian).map(l => (
                            <option key={l.id} value={l.id} className="text-slate-200 bg-slate-950">
                              {l.flag} {l.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>

                    {/* 2. Translation option helper */}
                    <div className="border border-slate-800/60 p-3.5 rounded-xl bg-slate-950/50 flex items-start gap-3">
                      <input
                        id="translation-toggle"
                        type="checkbox"
                        checked={translationMode}
                        onChange={(e) => setTranslationMode(e.target.checked)}
                        className="mt-1 h-4.5 w-4.5 text-teal-500 border-slate-700 bg-slate-900 rounded focus:ring-teal-500/50 cursor-pointer"
                      />
                      <div className="space-y-0.5">
                        <label htmlFor="translation-toggle" className="text-xs font-semibold text-slate-100 hover:text-white cursor-pointer select-none">
                          AI Auto-Translate Mode (Optional)
                        </label>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Toggle to translate the text automatically from your inputs to selected target ({activeLang.name}) beforehand!
                        </p>
                      </div>
                    </div>

                    {/* 3. Prebuilt Native Profiles or Cloned Voice */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                        <label className="block text-xs text-slate-400 font-medium font-mono uppercase tracking-wider">
                          Voice Profile Selection
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setVoiceCloneInitialTab("upload");
                              setVoiceCloneInitialFile(null);
                              setShowVoiceCloneModal(true);
                            }}
                            className="text-[11px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                            title="Upload sample audio to clone voice"
                          >
                            <Upload className="h-3 w-3" />
                            <span>📁 Upload Sample Audio</span>
                          </button>
                          <span className="text-slate-600 text-xs">•</span>
                          <button
                            type="button"
                            onClick={() => {
                              setVoiceCloneInitialTab("record");
                              setVoiceCloneInitialFile(null);
                              setShowVoiceCloneModal(true);
                            }}
                            className="text-[11px] text-slate-400 hover:text-teal-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <Mic className="h-3 w-3" />
                            <span>Voice Studio</span>
                          </button>
                        </div>
                      </div>

                      {/* Current Voice Status Pill */}
                      <div className={`mb-3 p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm transition-all ${
                        activeClonedVoice 
                          ? "bg-teal-950/70 border-teal-500/60 ring-1 ring-teal-500/30" 
                          : "bg-slate-900/80 border-slate-800"
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <span className={`p-2 rounded-lg border shrink-0 ${
                            activeClonedVoice 
                              ? "bg-teal-500/20 text-teal-300 border-teal-500/30" 
                              : "bg-slate-800 text-slate-300 border-slate-700"
                          }`}>
                            {activeClonedVoice ? <Mic className="h-4 w-4 text-teal-400 animate-pulse" /> : <Volume2 className="h-4 w-4 text-teal-400" />}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-white">
                                {activeClonedVoice ? `Chosen Voice: ${activeClonedVoice.name}` : `Chosen Voice: ${VOICES.find(v => v.id === voiceName)?.name || voiceName}`}
                              </span>
                              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                                activeClonedVoice 
                                  ? "bg-teal-400 text-slate-950" 
                                  : "bg-slate-800 text-teal-300 border border-teal-500/30"
                              }`}>
                                {activeClonedVoice ? "CLONED VOICE ACTIVE ✓" : "STANDARD VOICE ACTIVE"}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {activeClonedVoice 
                                ? `${activeClonedVoice.vocalTimbre} • ${activeClonedVoice.recommendedPrebuiltVoice} Base`
                                : `${VOICES.find(v => v.id === voiceName)?.description || "Pre-configured AI Voice"}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {activeClonedVoice ? (
                            <button
                              type="button"
                              onClick={() => handleSelectPrebuiltVoice("Puck")}
                              className="text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 cursor-pointer font-medium transition-all"
                              title="Switch to standard AI voice"
                            >
                              Reset to Standard
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setVoiceCloneInitialTab("upload");
                                setVoiceCloneInitialFile(null);
                                setShowVoiceCloneModal(true);
                              }}
                              className="text-[11px] text-teal-300 hover:text-white px-2.5 py-1 rounded-lg bg-teal-950/60 hover:bg-teal-900/60 border border-teal-500/40 cursor-pointer font-medium transition-all"
                            >
                              + Clone Voice
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Cloned Voices Section (when available) */}
                      {availableClonedVoices.length > 0 && (
                        <div className="mb-3.5 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-teal-300 flex items-center gap-1 uppercase tracking-wider font-mono">
                              <Mic className="h-3 w-3" />
                              <span>My Cloned Voices ({availableClonedVoices.length})</span>
                            </span>
                            <span className="text-[10px] text-slate-400">Click any card to select</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {availableClonedVoices.map((cloned) => {
                              const isSelected = activeClonedVoice?.id === cloned.id;
                              return (
                                <button
                                  key={cloned.id}
                                  type="button"
                                  onClick={() => handleSelectClonedVoice(cloned)}
                                  className={`p-3 rounded-xl text-left border cursor-pointer transition-all ${
                                    isSelected
                                      ? "bg-teal-950/90 border-teal-400 ring-2 ring-teal-400/50 text-white shadow-lg"
                                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900/70 hover:border-teal-500/40"
                                  }`}
                                >
                                  <div className="flex justify-between items-center text-xs font-semibold">
                                    <div className="flex items-center gap-1.5">
                                      <Mic className={`h-3.5 w-3.5 ${isSelected ? "text-teal-300 animate-pulse" : "text-slate-400"}`} />
                                      <span className="font-bold truncate max-w-[130px]">{cloned.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                                        CLONED
                                      </span>
                                      {isSelected && (
                                        <span className="h-4 w-4 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                                          ✓
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-[10px] mt-1 line-clamp-1 text-slate-400">
                                    {cloned.vocalTimbre || `${cloned.recommendedPrebuiltVoice} Neural Base`}
                                  </p>
                                </button>
                              );
                            })}

                            {/* Add New Cloned Voice Tile */}
                            <button
                              type="button"
                              onClick={() => {
                                setVoiceCloneInitialTab("upload");
                                setVoiceCloneInitialFile(null);
                                setShowVoiceCloneModal(true);
                              }}
                              className="p-3 rounded-xl text-left border border-dashed border-teal-500/40 hover:border-teal-400 bg-teal-950/20 hover:bg-teal-950/40 text-teal-300 transition-all cursor-pointer flex flex-col justify-center items-center text-center gap-1 min-h-[60px]"
                            >
                              <div className="flex items-center gap-1.5 text-xs font-bold">
                                <Upload className="h-3.5 w-3.5" />
                                <span>+ Clone Another Voice</span>
                              </div>
                              <span className="text-[9px] text-teal-400/70">Upload audio or record sample</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Standard Prebuilt Voices Section */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                            Standard AI Voices
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {activeClonedVoice ? "Click to switch to standard" : "Select voice"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {VOICES.map((v) => {
                            const isSelected = !activeClonedVoice && voiceName === v.id;
                            return (
                              <button
                                key={v.id}
                                onClick={() => handleSelectPrebuiltVoice(v.id)}
                                type="button"
                                className={`p-3 rounded-xl text-left border cursor-pointer transition-all ${
                                  isSelected 
                                    ? "bg-slate-800/90 border-teal-400 ring-2 ring-teal-500/40 text-white shadow" 
                                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900/60 hover:border-slate-700"
                                }`}
                              >
                                <div className="flex justify-between items-center text-xs font-semibold">
                                  <div className="flex items-center gap-1.5">
                                    <span>{v.name}</span>
                                    {isSelected && (
                                      <span className="h-3.5 w-3.5 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center text-[9px] font-black">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                                    v.gender === "Female" ? "bg-purple-950/80 text-purple-300" : "bg-sky-950/80 text-sky-300"
                                  }`}>
                                    {v.gender}
                                  </span>
                                </div>
                                <p className="text-[10px] mt-1 lines-clamp-2 leading-relaxed text-slate-400 font-sans">
                                  {v.description}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* 4. Emotional Tone & Advertisement styles */}
                    <div>
                      <label className="block text-xs text-slate-400 mb-2 font-medium font-mono uppercase tracking-wider flex items-center justify-between">
                        <span>Voice Style & Tone (Style)</span>
                        <span className="text-[10px] text-teal-400 font-sans">
                          {style.includes("tamil") ? "Commercial Mode" : "General"}
                        </span>
                      </label>
                      <select
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 p-3 rounded-xl focus:outline-none focus:border-teal-500 transition-all cursor-pointer text-sm"
                      >
                        <optgroup label="📢 Commercial & Human Conversational" className="text-amber-400 bg-slate-950 font-semibold">
                          <option value="tamil_ad_commercial" className="text-slate-200 bg-slate-950">
                            📢 Dynamic Commercial (TV / FM Radio Ad - Energetic)
                          </option>
                          <option value="tamil_ad_promo" className="text-slate-200 bg-slate-950">
                            ⚡ Mega Offer & Sale (Catchy Mega Sale & Promo)
                          </option>
                          <option value="tamil_ad_warm" className="text-slate-200 bg-slate-950">
                            🌟 Brand Story & Trust (Warm & Trustworthy Brand Narrative)
                          </option>
                          <option value="natural_human_tamil" className="text-slate-200 bg-slate-950">
                            🗣️ Natural Human Conversational (Clear & Friendly)
                          </option>
                        </optgroup>
                        <optgroup label="General Tone Styles" className="text-slate-400 bg-slate-950">
                          <option value="natural" className="text-slate-200 bg-slate-950">Natural Accent Tone (Adaptive / Neutral)</option>
                          <option value="cheerful" className="text-slate-200 bg-slate-950">Cheerful & Dynamic (Lively Voice)</option>
                          <option value="calm" className="text-slate-200 bg-slate-950">Calm & Serene (Storytelling & Relaxed)</option>
                          <option value="formal" className="text-slate-200 bg-slate-950">Formal & Authoritative (News & Broadcast)</option>
                          <option value="empathetic" className="text-slate-200 bg-slate-950">Soft & Conversational (Support Voice)</option>
                          <option value="excited" className="text-slate-200 bg-slate-950">Energetic & Playful (Promo Style)</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* 5. Speech Speed (Rate) Control with Quick Presets */}
                    <div className="space-y-2 p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-sans font-semibold flex items-center gap-1.5">
                          <Gauge className="h-3.5 w-3.5 text-teal-400" />
                          <span>Voice Speed Control</span>
                        </span>
                        <span className="text-teal-400 font-mono font-bold px-2 py-0.5 rounded bg-teal-955/60 border border-teal-500/30">
                          {rate}x {rate >= 1.25 ? "(Ad Pace)" : rate <= 0.85 ? "(Slow)" : "(Normal)"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.05"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-400 focus:outline-none"
                      />
                      {/* Quick Speed Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {[
                          { val: 0.75, label: "0.75x Slow" },
                          { val: 1.0, label: "1.0x Normal" },
                          { val: 1.15, label: "1.15x Ad Pace" },
                          { val: 1.3, label: "1.3x Promo" },
                          { val: 1.5, label: "1.5x Fast" },
                          { val: 2.0, label: "2.0x" },
                        ].map((sp) => (
                          <button
                            key={sp.val}
                            type="button"
                            onClick={() => setRate(sp.val)}
                            className={`text-[10px] py-1 px-2 rounded-md font-mono transition-all border cursor-pointer ${
                              Math.abs(rate - sp.val) < 0.03
                                ? "bg-teal-500/20 text-teal-300 border-teal-500/50 font-bold shadow-sm"
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
                            }`}
                          >
                            {sp.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE B: BROWSER LOCAL OFFLINE HARDWARE VOICE RENDER */}
                {ttsMode === "local" && (
                  <div className="space-y-4 animate-fade-in bg-slate-950/30 border border-slate-850 p-4 rounded-xl">
                    <span className="text-[10px] tracking-wider uppercase font-mono block text-emerald-400">
                      System hardware mode (No Limits)
                    </span>

                    {/* Local dynamic system voice dropdown */}
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-medium font-mono">
                        Select Installed Local Voice
                      </label>
                      {localVoices.length === 0 ? (
                        <div className="text-xs bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-400">
                          Detecting browser voices... Click generate to speak.
                        </div>
                      ) : (
                        <select
                          value={selectedLocalVoiceName}
                          onChange={(e) => setSelectedLocalVoiceName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-emerald-500 transition-all cursor-pointer text-xs font-sans"
                        >
                          {localVoices.map((v, i) => (
                            <option key={i} value={v.name} className="text-slate-200 bg-slate-950">
                              {v.name} ({v.lang})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Speech Velocity (Rate) Control */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono text-slate-400">
                        <span>Speech Speed</span>
                        <span className="text-emerald-400 font-bold">{rate}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.05"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 focus:outline-none"
                      />
                      {/* Quick Speed Pills for Local Mode */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {[
                          { val: 0.75, label: "0.75x" },
                          { val: 1.0, label: "1.0x" },
                          { val: 1.15, label: "1.15x Ad" },
                          { val: 1.3, label: "1.3x Promo" },
                          { val: 1.5, label: "1.5x" },
                          { val: 2.0, label: "2.0x" },
                        ].map((sp) => (
                          <button
                            key={sp.val}
                            type="button"
                            onClick={() => setRate(sp.val)}
                            className={`text-[10px] py-1 px-2 rounded-md font-mono transition-all border cursor-pointer ${
                              Math.abs(rate - sp.val) < 0.03
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold shadow-sm"
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
                            }`}
                          >
                            {sp.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Speech Tone (Pitch) Control */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono text-slate-400">
                        <span>Pitch Control</span>
                        <span className="text-emerald-400 font-bold">{pitch}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={pitch}
                        onChange={(e) => setPitch(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 focus:outline-none"
                      />
                    </div>

                    <p className="text-[10px] text-slate-400 leading-normal bg-slate-900/60 p-2.5 border border-slate-850 rounded-lg font-sans">
                      💡 <strong>Note:</strong> Web Speech synthesizes audio live in your operating system's local sound output card. Download exports are supported for server-side Gemini high-fidelity WAVs. Use this mode for unlimited free previews!
                    </p>
                  </div>
                )}

              </div>

              {/* Synthesis core trigger */}
              <div className="pt-6 border-t border-slate-800/80 mt-6">
                <button
                  onClick={handleSynthesize}
                  disabled={isSynthesizing || !text.trim()}
                  type="button"
                  className={`w-full py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-semibold text-slate-950 cursor-pointer shadow-lg transition-all ${
                    !text.trim()
                      ? "bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed shadow-none"
                      : isSynthesizing
                        ? "bg-slate-800 text-slate-400 border border-slate-750 cursor-wait"
                        : activeClonedVoice
                          ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-300 hover:from-emerald-350 hover:to-cyan-250 text-slate-950 font-bold shadow-emerald-500/20 shadow-xl active:scale-[0.982]"
                          : "bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 hover:from-teal-350 hover:to-cyan-350 text-slate-900 active:scale-[0.982]"
                  }`}
                >
                  {isSynthesizing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{activeClonedVoice ? `Generating Speech in Cloned Voice (${activeClonedVoice.name})...` : "Generating Intelligent Speech..."}</span>
                    </>
                  ) : activeClonedVoice ? (
                    <>
                      <Radio className="h-5 w-5 text-slate-950 animate-pulse" />
                      <span>🎙️ Speak in Cloned Voice ({activeClonedVoice.name})</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 fill-slate-900" />
                      <span>Synthesize & Speak (WAV)</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Dynamic Voice synthesis result & Audio Player display */}
        {audioUrl && (
          <div className="mt-8 bg-slate-900/60 border border-teal-500/30 rounded-2xl p-5 md:p-6 shadow-2xl animate-fade-in space-y-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-5 border-b border-slate-800">
              
              <div className="flex items-center gap-4 text-left">
                <div className={`p-4 rounded-xl ${isPlaying ? "bg-teal-500/20 text-teal-400 animate-pulse" : "bg-slate-800 text-slate-400"}`}>
                  <Volume2 className="h-7 w-7 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-100 text-base">
                    Active Audio Synthesized Output
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3 font-mono">
                    <span>Language: <strong className="text-teal-400">{activeLang.flag} {activeLang.name}</strong></span>
                    <span className="text-slate-700 font-sans">•</span>
                    <span>Voice ID: <strong className="text-emerald-400">{voiceName}</strong></span>
                    <span className="text-slate-700 font-sans">•</span>
                    <span>Format: <strong>WAV (Lossless 24kHz)</strong></span>
                  </p>
                </div>
              </div>

              {/* Play / Pause with time duration indicators */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlayMain}
                  className="px-5 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-100 hover:text-white flex items-center gap-2.5 font-semibold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 text-teal-400 fill-teal-400" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 text-emerald-400 fill-emerald-400" />
                      <span>Play / Listen</span>
                    </>
                  )}
                </button>
                <div className="text-xs font-mono text-slate-400 px-3 py-2 bg-slate-950/60 border border-slate-850 rounded-lg">
                  {(() => {
                    const formatTime = (secs: number) => {
                      if (isNaN(secs)) return "00:00";
                      const m = Math.floor(secs / 60);
                      const s = Math.floor(secs % 60);
                      return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
                    };
                    return `${formatTime(currentTime)} / ${formatTime(duration)}`;
                  })()}
                </div>
              </div>
            </div>

            {/* Seeking / scrubbing control */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-500 px-1">
                <span>Play progress</span>
                <span>Seek / Scrub track</span>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.05"
                value={currentTime}
                onChange={(e) => {
                  const targetTime = parseFloat(e.target.value);
                  if (audioPlayerRef.current) {
                    audioPlayerRef.current.currentTime = targetTime;
                    setCurrentTime(targetTime);
                  }
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-400 focus:outline-none"
              />
            </div>

            {/* Real-Time Playback Speed Adjustment Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Gauge className="h-4 w-4 text-teal-400" />
                <span>Playback Speed:</span>
                <span className="font-mono text-teal-300 font-bold px-1.5 py-0.5 rounded bg-teal-950/60 border border-teal-500/30 text-[11px]">
                  {rate}x {rate >= 1.25 ? "⚡ Ad Pace" : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { val: 0.8, label: "0.8x" },
                  { val: 1.0, label: "1.0x Normal" },
                  { val: 1.15, label: "1.15x Ad" },
                  { val: 1.3, label: "1.3x Promo" },
                  { val: 1.5, label: "1.5x" },
                  { val: 2.0, label: "2.0x" }
                ].map((s) => (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => {
                      setRate(s.val);
                      if (audioPlayerRef.current) {
                        audioPlayerRef.current.playbackRate = s.val;
                      }
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all border cursor-pointer ${
                      Math.abs(rate - s.val) < 0.03
                        ? "bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-md shadow-teal-500/20"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DEDICATED CUSTOM DOWNLOAD CONFIGURATION BOX */}
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="space-y-1 md:max-w-md">
                <span className="text-xs font-bold text-slate-200 block">
                  Configure Download Options
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Name your file below and download instantly as high-fidelity lossless WAV format, compatible with any video editor or media system.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value.replace(/[^a-zA-Z0-9_\-]/g, ""))}
                    placeholder="Enter file name..."
                    className="bg-slate-900 border border-slate-800 focus:border-teal-500/80 rounded-lg py-2 pl-3 pr-12 text-xs text-slate-200 focus:outline-none w-full sm:w-52"
                  />
                  <span className="absolute right-3 top-2 text-[10px] font-mono text-slate-500 select-none">
                    .wav
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => triggerDownload(audioUrl, `${customFileName || "vocalwave"}.wav`)}
                  className="bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs hover:from-teal-350 hover:to-emerald-350 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/10 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download file</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Synthesis History segment */}
        <section className="mt-10 bg-slate-900/30 border border-slate-850 rounded-2xl p-5 md:p-6">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-teal-400" />
              <h3 className="font-bold text-slate-200 tracking-wide text-base">
                Recent Audio Generations ({historyList.length})
              </h3>
            </div>
            
            {historyList.length > 0 && (
              <button
                onClick={() => setHistoryList([])}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 py-1 px-2 hover:bg-rose-950/20 rounded cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Session
              </button>
            )}
          </div>

          {historyList.length === 0 ? (
            <div className="text-center py-10 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
              <Volume2 className="h-10 w-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-400">
                Silence is gold. Synthesize your first translation or text input above to populate history.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Generated audios can be stored locally, replayed, and downloaded as standard WAV voiceovers.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <table className="min-w-full divide-y divide-slate-800 text-sm">
                  <thead>
                    <tr className="text-slate-400 text-left font-semibold text-xs font-mono uppercase tracking-wider">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Language</th>
                      <th className="py-3 px-4">Voice/Profile</th>
                      <th className="py-3 px-4">Preview Text</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {historyList.map((item) => {
                      const isActive = playedItemId === item.id;
                      return (
                        <tr key={item.id} className="hover:bg-slate-800/20 transition-all">
                          <td className="py-3.5 px-4 font-mono text-xs whitespace-nowrap text-slate-500">
                            {item.timestamp}
                          </td>
                          <td className="py-3.5 px-4 font-medium whitespace-nowrap text-slate-200">
                            {item.languageName}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                              {item.voiceName}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 max-w-sm truncate text-slate-400 pr-8">
                            {item.text}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => playHistoryItem(item)}
                                type="button"
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  isActive && isPlaying
                                    ? "bg-teal-500 text-slate-950 border-teal-500"
                                    : "bg-slate-950 hover:bg-slate-800 border-slate-800 text-teal-400"
                                }`}
                                title="Listen to Voice"
                              >
                                {isActive && isPlaying ? (
                                  <Pause className="h-3.5 w-3.5 fill-slate-950" />
                                ) : (
                                  <Play className="h-3.5 w-3.5 fill-teal-400" />
                                )}
                              </button>

                              <button
                                onClick={() => handleCopyText(item.originalText, item.id)}
                                type="button"
                                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                                title="Copy Speech Text"
                              >
                                {copiedId === item.id ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>

                              <button
                                onClick={() => triggerDownload(item.audioUrl, `vocalwave-saved-${item.id}.wav`)}
                                type="button"
                                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer"
                                title="Download Audio File"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

      </div>

      {/* AI Tamil Ad Script Generator Modal */}
      {showAdScriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Megaphone className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    AI Commercial Script Generator
                  </h3>
                  <p className="text-xs text-slate-400">
                    Generate natural, high-converting advertisement scripts with AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAdScriptModal(false)}
                type="button"
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {scriptError && (
              <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs">
                {scriptError}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product / Store Name / Offer Details:
                </label>
                <textarea
                  value={adPromptInput}
                  onChange={(e) => setAdPromptInput(e.target.value)}
                  placeholder="e.g., Festival mega offer with 50% discount on clothing, or grand opening of a new authentic biryani restaurant..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all resize-y"
                />
              </div>

              {/* Quick sample topic pills */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                  Quick Sample Prompts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Clothing Store 50% Off",
                    "Aromatic Biryani Restaurant",
                    "New Mobile Store Grand Opening",
                    "Jewelry Savings Plan",
                    "Fresh Organic Dairy Milk",
                  ].map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAdPromptInput(sample)}
                      className="text-[11px] py-1 px-2.5 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 transition-all cursor-pointer"
                    >
                      + {sample}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ad Style & Tone:
                </label>
                <select
                  value={adCategoryType}
                  onChange={(e) => setAdCategoryType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500 text-xs cursor-pointer"
                >
                  <option value="mega_offer">⚡ Catchy Mega Offer & Super Sale</option>
                  <option value="commercial">📻 Fast Commercial (Radio & TV)</option>
                  <option value="restaurant">🍕 Food & Restaurant Dining Offer</option>
                  <option value="brand">🌟 Warm Brand Trust & Storytelling</option>
                  <option value="conversational">🗣️ Friendly Conversational Recommendation</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAdScriptModal(false)}
                type="button"
                className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateTamilAd}
                disabled={isGeneratingScript || !adPromptInput.trim()}
                type="button"
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                  !adPromptInput.trim() || isGeneratingScript
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 hover:brightness-110 active:scale-95 shadow-amber-500/20"
                }`}
              >
                {isGeneratingScript ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                    <span>Generating Script...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 text-slate-950" />
                    <span>Generate Ad Script</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Clone and Mimicry Studio Modal */}
      <VoiceCloneModal
        isOpen={showVoiceCloneModal}
        onClose={() => {
          setShowVoiceCloneModal(false);
          setVoiceCloneInitialFile(null);
        }}
        activeClonedVoice={activeClonedVoice}
        onSelectClonedVoice={handleSelectClonedVoice}
        onRemoveClonedVoice={handleRemoveClonedVoice}
        savedVoices={savedClonedVoices}
        onSaveVoice={handleSaveVoice}
        onDeleteSavedVoice={handleDeleteSavedVoice}
        initialTab={voiceCloneInitialTab}
        initialAudioFile={voiceCloneInitialFile}
      />

      {/* Footer credits block */}
      <footer className="mt-12 text-center text-xs text-slate-500 border-t border-slate-800/80 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 VocalWave Studio. Powered by the generative intelligence of Google Gemini 3.1 Neural TTS.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400">Lossless WAV Encoding</span>
            <span>•</span>
            <span className="hover:text-slate-400 text-emerald-400">All Indian Accent Profiles Enabled</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
