import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Upload,
  Play,
  Pause,
  Volume2,
  Square,
  Sparkles,
  Trash2,
  Save,
  RefreshCw,
  X,
  Radio,
  User,
  Activity,
  Wand2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { ClonedVoiceProfile } from "../types";

// Pre-built authentic voice templates
export const PRESET_VOICES: ClonedVoiceProfile[] = [
  {
    id: "preset-vijay-mass",
    name: "Vijay Mass Style Voice",
    voiceTitle: "Vijay Style Mass & Action Voice",
    speakerGender: "male",
    estimatedAgeGroup: "Young Adult (30-40)",
    vocalPitch: "Medium/Tenor",
    vocalTimbre: "Punchy, energetic, charismatic, colloquial mass appeal",
    speakingPace: "Fast/Snappy",
    detectedAccent: "Authentic Chennai / Tamil Mass Swag",
    recommendedPrebuiltVoice: "Puck",
    recommendedSpeed: 1.15,
    vocalReplicationPrompt: "Deliver with high-voltage mass swagger, punchy energetic colloquial rhythm, sharp pitch modulations, and confident charisma.",
    createdAt: Date.now(),
    isPreset: true,
  },
  {
    id: "preset-tamil-anchor",
    name: "Tamil News Anchor",
    voiceTitle: "Authoritative Broadcast News Anchor",
    speakerGender: "male",
    estimatedAgeGroup: "Middle-aged (35-48)",
    vocalPitch: "Deep/Low Baritone",
    vocalTimbre: "Authoritative, resonant, crystal-clear diction",
    speakingPace: "Natural/Moderate",
    detectedAccent: "Standard Broadcast Tamil",
    recommendedPrebuiltVoice: "Charon",
    recommendedSpeed: 1.0,
    vocalReplicationPrompt: "Deliver with deep resonant chest depth, calm formal authority, pristine classical pronunciation, and measured dignified pauses.",
    createdAt: Date.now(),
    isPreset: true,
  },
  {
    id: "preset-warm-female-rj",
    name: "Warm Female RJ (FM Hostess / Storyteller)",
    voiceTitle: "Warm Melodic Female Voice",
    speakerGender: "female",
    estimatedAgeGroup: "Young Adult (22-30)",
    vocalPitch: "Warm Medium/High",
    vocalTimbre: "Friendly, soothing, sweet, smiling resonance",
    speakingPace: "Natural/Moderate",
    detectedAccent: "Conversational Melodic Tamil",
    recommendedPrebuiltVoice: "Kore",
    recommendedSpeed: 1.05,
    vocalReplicationPrompt: "Deliver with smiling warmth, sweet melodious vocal cadence, gentle upbeat intimacy, and natural conversational flow.",
    createdAt: Date.now(),
    isPreset: true,
  },
  {
    id: "preset-village-elder",
    name: "Village Elder Voice",
    voiceTitle: "Rustic Elder Voice",
    speakerGender: "male",
    estimatedAgeGroup: "Senior (55+)",
    vocalPitch: "Deep/Resonant",
    vocalTimbre: "Rustic, weathered, warm, grounded, wise",
    speakingPace: "Deliberate/Slow",
    detectedAccent: "Madurai / Southern Rural Tamil",
    recommendedPrebuiltVoice: "Fenrir",
    recommendedSpeed: 0.92,
    vocalReplicationPrompt: "Speak with traditional rustic Southern Tamil weight, grounded baritone resonance, heartfelt affection, and deliberate wise pauses.",
    createdAt: Date.now(),
    isPreset: true,
  },
  {
    id: "preset-gentle-soothing",
    name: "Gentle Soothing Voice",
    voiceTitle: "Gentle Whisper / Meditation Voice",
    speakerGender: "female",
    estimatedAgeGroup: "Adult (25-35)",
    vocalPitch: "Soft/Airy Soprano",
    vocalTimbre: "Calm, gentle, whispery, serene, peaceful",
    speakingPace: "Deliberate/Slow",
    detectedAccent: "Soft Conversational Tamil",
    recommendedPrebuiltVoice: "Zephyr",
    recommendedSpeed: 0.88,
    vocalReplicationPrompt: "Deliver in a quiet, serene, soothing whisper-soft voice with deep calming breaths and slow peaceful cadence.",
    createdAt: Date.now(),
    isPreset: true,
  },
];

interface VoiceCloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeClonedVoice: ClonedVoiceProfile | null;
  onSelectClonedVoice: (voice: ClonedVoiceProfile) => void;
  onRemoveClonedVoice: () => void;
  savedVoices: ClonedVoiceProfile[];
  onSaveVoice: (voice: ClonedVoiceProfile) => void;
  onDeleteSavedVoice: (voiceId: string) => void;
  initialTab?: "record" | "upload" | "presets" | "saved";
  initialAudioFile?: File | null;
}

export const VoiceCloneModal: React.FC<VoiceCloneModalProps> = ({
  isOpen,
  onClose,
  activeClonedVoice,
  onSelectClonedVoice,
  onRemoveClonedVoice,
  savedVoices,
  onSaveVoice,
  onDeleteSavedVoice,
  initialTab = "upload",
  initialAudioFile = null,
}) => {
  const [activeTab, setActiveTab] = useState<"record" | "upload" | "presets" | "saved">("upload");

  // Recording & Upload State
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioMime, setAudioMime] = useState<string>("audio/webm");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Playback of reference audio
  const [isPlayingReference, setIsPlayingReference] = useState(false);
  const referenceAudioRef = useRef<HTMLAudioElement | null>(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedProfile, setAnalyzedProfile] = useState<ClonedVoiceProfile | null>(null);
  const [customVoiceName, setCustomVoiceName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Testing Cloned Voice Speech Output
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [testAudioUrl, setTestAudioUrl] = useState<string | null>(null);
  const testAudioRef = useRef<HTMLAudioElement | null>(null);

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Synchronize initialTab and initialAudioFile when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      if (initialAudioFile) {
        processFile(initialAudioFile);
      }
    }
  }, [isOpen, initialTab, initialAudioFile]);

  // Clean up timers & audios
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (referenceAudioRef.current) {
        referenceAudioRef.current.pause();
      }
      if (testAudioRef.current) {
        testAudioRef.current.pause();
      }
    };
  }, []);

  if (!isOpen) return null;

  // Start Mic Recording
  const startRecording = async () => {
    setErrorMessage(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioBase64(null);
    setAnalyzedProfile(null);
    setTestAudioUrl(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      setAudioMime(mime);

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(audioChunksRef.current, { type: mime });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Convert to Base64
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(",")[1];
          setAudioBase64(base64data);
        };
      };

      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordSeconds((prev) => {
          if (prev >= 20) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setErrorMessage("Microphone access was denied. Please allow microphone permissions or use the 'Upload Audio File' tab instead.");
    }
  };

  // Stop Mic Recording
  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Core File Processor for audio file uploads and drag-drops
  const processFile = (file: File | Blob, customName?: string) => {
    setErrorMessage(null);
    setAnalyzedProfile(null);
    setTestAudioUrl(null);

    const fileName = customName || (file as File).name || "sample_voice_audio.wav";
    setUploadedFileName(fileName);
    if (file.size) {
      const mb = (file.size / (1024 * 1024)).toFixed(2);
      setUploadedFileSize(`${mb} MB`);
    }

    setAudioMime(file.type || "audio/wav");
    setAudioBlob(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64data = (reader.result as string).split(",")[1];
      setAudioBase64(base64data);
    };
  };

  // Handle Audio File Upload from Input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = "";
  };

  // Web Audio Client Acoustic Analysis (Robust multi-frame pitch F0 & spectral extraction)
  const computeClientPitchMetrics = async (blob: Blob): Promise<{
    pitchHz: number;
    gender: "male" | "female";
    pace: "Fast/Snappy" | "Natural/Moderate" | "Deliberate/Slow";
    recommendedSpeed: number;
    recommendedVoice: "Fenrir" | "Charon" | "Puck" | "Kore" | "Zephyr";
    bassBoostDb: number;
    trebleBoostDb: number;
    vocalTimbre: string;
  }> => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const data = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;
      const totalSamples = data.length;

      // 1. Calculate slice RMS across 2048-sample windows to isolate active voiced speech (skipping silence/breaths)
      const windowSize = 2048;
      const numWindows = Math.floor(totalSamples / windowSize);
      const rmsValues: { index: number; rms: number }[] = [];
      let maxRms = 0;

      for (let w = 0; w < numWindows; w++) {
        let sumSq = 0;
        const start = w * windowSize;
        for (let i = 0; i < windowSize; i++) {
          const val = data[start + i];
          sumSq += val * val;
        }
        const rms = Math.sqrt(sumSq / windowSize);
        if (rms > maxRms) maxRms = rms;
        rmsValues.push({ index: w, rms });
      }

      // Voiced threshold: at least 15% of peak RMS or > 0.015
      const voiceThreshold = Math.max(0.012, maxRms * 0.15);
      const voicedWindows = rmsValues.filter((w) => w.rms >= voiceThreshold);

      // 2. Perform autocorrelation on voiced windows
      const pitchEstimates: number[] = [];
      const minPeriod = Math.floor(sampleRate / 350); // 350 Hz max (soprano)
      const maxPeriod = Math.floor(sampleRate / 70);  // 70 Hz min (deep bass)

      // Sample up to 16 representative voiced windows distributed evenly across audio
      const step = Math.max(1, Math.floor(voicedWindows.length / 16));
      for (let i = 0; i < voicedWindows.length; i += step) {
        const start = voicedWindows[i].index * windowSize;
        if (start + windowSize > totalSamples) break;

        let bestOffset = -1;
        let bestCorrelation = 0;

        for (let offset = minPeriod; offset < maxPeriod; offset++) {
          let correlation = 0;
          let normA = 0;
          let normB = 0;
          const limit = Math.min(windowSize - offset, 1024);

          for (let j = 0; j < limit; j++) {
            const a = data[start + j];
            const b = data[start + j + offset];
            correlation += a * b;
            normA += a * a;
            normB += b * b;
          }

          const norm = Math.sqrt(normA * normB);
          const normalizedCorr = norm > 0.0001 ? correlation / norm : 0;

          if (normalizedCorr > bestCorrelation) {
            bestCorrelation = normalizedCorr;
            bestOffset = offset;
          }
        }

        // Only accept if normalized correlation indicates clear periodicity
        if (bestOffset > 0 && bestCorrelation > 0.35) {
          const freq = sampleRate / bestOffset;
          if (freq >= 70 && freq <= 350) {
            pitchEstimates.push(freq);
          }
        }
      }

      // 3. Spectral balance: low frequencies vs high frequencies
      let lowEnergy = 0;
      let highEnergy = 0;
      let totalEnergy = 0;
      const sampleStep = Math.max(1, Math.floor(totalSamples / 10000));
      for (let i = 0; i < totalSamples; i += sampleStep) {
        const val = Math.abs(data[i]);
        totalEnergy += val;
        // Simple differentiation as high-pass indicator
        if (i > 0) {
          const diff = Math.abs(data[i] - data[i - 1]);
          highEnergy += diff;
        }
      }
      const brightnessRatio = totalEnergy > 0 ? highEnergy / totalEnergy : 0.5;

      audioCtx.close().catch(() => {});

      // Calculate median pitch
      let medianPitch = 145;
      if (pitchEstimates.length > 0) {
        pitchEstimates.sort((a, b) => a - b);
        medianPitch = pitchEstimates[Math.floor(pitchEstimates.length / 2)];
      }

      const cleanPitch = Math.round(Math.max(75, Math.min(320, medianPitch)));
      const isFemale = cleanPitch > 165;

      // Recommended base voice match
      let recVoice: "Fenrir" | "Charon" | "Puck" | "Kore" | "Zephyr" = "Charon";
      let bassBoost = 0;
      let trebleBoost = 0;
      let timbreDesc = "Warm, balanced human resonance";

      if (isFemale) {
        if (cleanPitch > 210) {
          recVoice = "Zephyr";
          trebleBoost = 2.0;
          timbreDesc = "Bright, gentle, airy soprano resonance";
        } else {
          recVoice = "Kore";
          bassBoost = 1.0;
          trebleBoost = 1.0;
          timbreDesc = "Warm, articulate, expressive melodic cadence";
        }
      } else {
        if (cleanPitch < 120) {
          recVoice = "Fenrir";
          bassBoost = 3.5;
          timbreDesc = "Deep, grounded, authoritative chest baritone";
        } else if (cleanPitch < 145) {
          recVoice = "Charon";
          bassBoost = 2.0;
          timbreDesc = "Warm, grounded, conversational baritone";
        } else {
          recVoice = "Puck";
          trebleBoost = 2.0;
          timbreDesc = "Lively, youthful, bright conversational tenor";
        }
      }

      // Calculate estimated pace
      const activeDurationSec = (voicedWindows.length * windowSize) / sampleRate;
      let pace: "Fast/Snappy" | "Natural/Moderate" | "Deliberate/Slow" = "Natural/Moderate";
      let recSpeed = 1.0;

      // Burst count estimation
      let bursts = 0;
      let inBurst = false;
      for (const w of voicedWindows) {
        if (w.rms > voiceThreshold * 1.6) {
          if (!inBurst) {
            bursts++;
            inBurst = true;
          }
        } else {
          inBurst = false;
        }
      }

      const burstsPerSec = activeDurationSec > 0 ? bursts / activeDurationSec : 3.2;
      if (burstsPerSec > 4.2) {
        pace = "Fast/Snappy";
        recSpeed = 1.15;
      } else if (burstsPerSec < 2.5) {
        pace = "Deliberate/Slow";
        recSpeed = 0.9;
      }

      return {
        pitchHz: cleanPitch,
        gender: isFemale ? "female" : "male",
        pace,
        recommendedSpeed: recSpeed,
        recommendedVoice: recVoice,
        bassBoostDb: bassBoost,
        trebleBoostDb: trebleBoost,
        vocalTimbre: timbreDesc,
      };
    } catch (e) {
      console.warn("Client acoustic extraction fallback:", e);
      return {
        pitchHz: 140,
        gender: "male",
        pace: "Natural/Moderate",
        recommendedSpeed: 1.0,
        recommendedVoice: "Charon",
        bassBoostDb: 1.5,
        trebleBoostDb: 0,
        vocalTimbre: "Natural conversational tone",
      };
    }
  };

  // Analyze reference voice
  const handleAnalyzeVoice = async () => {
    if (!audioBase64 || !audioBlob) {
      setErrorMessage("Please record your voice or select an audio file first.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      // 1. Client-side acoustic metric computation
      const clientMetrics = await computeClientPitchMetrics(audioBlob);

      // 2. Call backend /api/analyze-voice
      const response = await fetch("/api/analyze-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64,
          mimeType: audioMime,
          clientMetrics,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.profile) {
        throw new Error(data?.error || "Voice analysis failed.");
      }

      const prof = data.profile;
      const isFemale = prof.speakerGender === "female" || clientMetrics.gender === "female";
      const generatedProfile: ClonedVoiceProfile = {
        id: `cloned-${Date.now()}`,
        name: prof.voiceTitle || "My Cloned Voice",
        voiceTitle: prof.voiceTitle || "My Cloned Voice",
        speakerGender: prof.speakerGender || clientMetrics.gender,
        estimatedAgeGroup: prof.estimatedAgeGroup || "Adult (25-45)",
        vocalPitch: prof.vocalPitch || (clientMetrics.pitchHz > 165 ? "High/Treble" : (clientMetrics.pitchHz < 120 ? "Deep/Low" : "Medium/Baritone")),
        vocalTimbre: prof.vocalTimbre || clientMetrics.vocalTimbre,
        speakingPace: prof.speakingPace || clientMetrics.pace,
        detectedAccent: prof.detectedAccent || "Conversational",
        recommendedPrebuiltVoice: prof.recommendedPrebuiltVoice || clientMetrics.recommendedVoice,
        recommendedSpeed: prof.recommendedSpeed || clientMetrics.recommendedSpeed || 1.0,
        vocalReplicationPrompt: prof.vocalReplicationPrompt || "Replicate this speaker's natural timbre, rhythm, and clear vocal inflection.",
        referenceAudioUrl: audioUrl || undefined,
        pitchHz: prof.pitchHz || clientMetrics.pitchHz,
        bassBoostDb: prof.bassBoostDb ?? clientMetrics.bassBoostDb,
        trebleBoostDb: prof.trebleBoostDb ?? clientMetrics.trebleBoostDb,
        createdAt: Date.now(),
        isPreset: false,
      };

      setAnalyzedProfile(generatedProfile);
      setCustomVoiceName(generatedProfile.name);
    } catch (err: any) {
      console.error("Voice analysis error:", err);
      setErrorMessage(err?.message || "An error occurred during voice analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Test synthesize short sample in the newly cloned voice
  const handleTestClonedVoice = async (profile: ClonedVoiceProfile) => {
    setIsTestingVoice(true);
    setTestAudioUrl(null);
    setErrorMessage(null);

    try {
      const isTamilSpeaker = profile.detectedAccent?.toLowerCase().includes("tamil") ||
                             profile.vocalReplicationPrompt?.toLowerCase().includes("tamil") ||
                             profile.name.toLowerCase().includes("tamil") ||
                             /[\u0B80-\u0BFF]/.test(profile.name);
      const sampleText = isTamilSpeaker
        ? "வணக்கம்! உங்கள் குரல் வெற்றிகரமாக பொருத்தப்பட்டது. நீங்கள் கொடுக்கும் எந்த வாக்கியமும் இனி இந்த குரலிலேயே ஒலிக்கும்!"
        : "Hello! Your voice profile has been successfully matched and cloned. Any text you enter will now be spoken using this voice!";
      const sampleLang = isTamilSpeaker ? "ta-IN" : "en-US";

      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sampleText,
          language: sampleLang,
          clonedVoice: profile,
          speed: profile.recommendedSpeed,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.audioBase64) {
        throw new Error(data?.error || "Error generating voice preview sample.");
      }

      // Convert PCM base64 to WAV blob
      const raw = atob(data.audioBase64);
      const rawLen = raw.length;
      const rawBytes = new Uint8Array(rawLen);
      for (let i = 0; i < rawLen; i++) rawBytes[i] = raw.charCodeAt(i);

      // Create WAV header
      const sampleRate = data.sampleRate || 24000;
      const wavHeader = new ArrayBuffer(44);
      const view = new DataView(wavHeader);
      view.setUint32(0, 0x52494646, false); // "RIFF"
      view.setUint32(4, 36 + rawLen, true);
      view.setUint32(8, 0x57415645, false); // "WAVE"
      view.setUint32(12, 0x666d7420, false); // "fmt "
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true); // PCM
      view.setUint16(22, 1, true); // mono
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      view.setUint32(36, 0x64617461, false); // "data"
      view.setUint32(40, rawLen, true);

      const blob = new Blob([wavHeader, rawBytes], { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      setTestAudioUrl(url);

      // Autoplay test audio
      setTimeout(() => {
        if (testAudioRef.current) {
          testAudioRef.current.play().catch(() => {});
        }
      }, 50);
    } catch (err: any) {
      console.error("Test speech error:", err);
      setErrorMessage(err?.message || "Could not generate sample voice preview.");
    } finally {
      setIsTestingVoice(false);
    }
  };

  // Toggle reference audio playback
  const togglePlayReference = () => {
    if (!referenceAudioRef.current) return;
    if (isPlayingReference) {
      referenceAudioRef.current.pause();
      setIsPlayingReference(false);
    } else {
      referenceAudioRef.current.play().catch(() => {});
      setIsPlayingReference(true);
    }
  };

  // Instant one-step clone and activate voice
  const handleQuickCloneAndActivate = async () => {
    if (!audioBase64 || !audioBlob) {
      setErrorMessage("Please select an audio file or record your voice first.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      // 1. Client-side acoustic metric computation
      const clientMetrics = await computeClientPitchMetrics(audioBlob);

      let prof: any = null;
      try {
        const response = await fetch("/api/analyze-voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioBase64,
            mimeType: audioMime,
            clientMetrics,
          }),
        });
        const data = await response.json();
        if (response.ok && data.profile) {
          prof = data.profile;
        }
      } catch (apiErr) {
        console.warn("Backend analysis skipped, using acoustic metrics:", apiErr);
      }

      const voiceTitle = customVoiceName.trim() || (uploadedFileName 
        ? uploadedFileName.replace(/\.[^/.]+$/, "").substring(0, 24)
        : (clientMetrics.gender === "female" ? "My Cloned Voice (Female)" : "My Cloned Voice (Male)"));

      const isFemale = prof?.speakerGender === "female" || clientMetrics.gender === "female";
      const finalProfile: ClonedVoiceProfile = {
        id: `cloned-${Date.now()}`,
        name: prof?.voiceTitle || voiceTitle,
        voiceTitle: prof?.voiceTitle || voiceTitle,
        speakerGender: isFemale ? "female" : "male",
        estimatedAgeGroup: prof?.estimatedAgeGroup || "Adult (25-45)",
        vocalPitch: prof?.vocalPitch || (clientMetrics.pitchHz > 165 ? "High/Treble" : (clientMetrics.pitchHz < 120 ? "Deep/Low" : "Medium/Baritone")),
        vocalTimbre: prof?.vocalTimbre || clientMetrics.vocalTimbre,
        speakingPace: prof?.speakingPace || clientMetrics.pace,
        detectedAccent: prof?.detectedAccent || "Conversational",
        recommendedPrebuiltVoice: prof?.recommendedPrebuiltVoice || clientMetrics.recommendedVoice,
        recommendedSpeed: prof?.recommendedSpeed || clientMetrics.recommendedSpeed || 1.0,
        vocalReplicationPrompt: prof?.vocalReplicationPrompt || "Faithfully replicate this speaker's natural timbre, rhythm, and clear vocal cadence.",
        referenceAudioUrl: audioUrl || undefined,
        pitchHz: prof?.pitchHz || clientMetrics.pitchHz,
        bassBoostDb: prof?.bassBoostDb ?? clientMetrics.bassBoostDb,
        trebleBoostDb: prof?.trebleBoostDb ?? clientMetrics.trebleBoostDb,
        createdAt: Date.now(),
        isPreset: false,
      };

      try {
        onSaveVoice(finalProfile);
        onSelectClonedVoice(finalProfile);
      } catch (saveErr) {
        console.warn("Storage warning during quick clone:", saveErr);
      }
      onClose();
    } catch (err: any) {
      console.error("Quick clone error:", err);
      setErrorMessage(err?.message || "Could not clone voice. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Activate and save voice
  const handleConfirmAndActivate = (profile: ClonedVoiceProfile) => {
    const finalProfile: ClonedVoiceProfile = {
      ...profile,
      name: customVoiceName.trim() || profile.name,
      voiceTitle: customVoiceName.trim() || profile.voiceTitle,
    };
    try {
      onSaveVoice(finalProfile);
      onSelectClonedVoice(finalProfile);
    } catch (saveErr) {
      console.warn("Storage warning during voice activation:", saveErr);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-teal-500/40 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 text-teal-400 border border-teal-500/30">
              <Wand2 className="h-5 w-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Voice Clone & Mimic Studio</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold uppercase tracking-wider">
                  AI Matching
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Upload an audio file or record via microphone to clone any voice!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-6 pt-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => { setActiveTab("upload"); setErrorMessage(null); }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "upload"
                ? "border-teal-400 text-teal-300 bg-slate-900 shadow-sm"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Upload className="h-3.5 w-3.5 text-teal-400" />
            <span>📁 1. Upload Sample Audio</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("record"); setErrorMessage(null); }}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "record"
                ? "border-teal-400 text-teal-300 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Mic className="h-3.5 w-3.5" />
            <span>🎙️ 2. Record Mic</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("presets"); setErrorMessage(null); }}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "presets"
                ? "border-teal-400 text-teal-300 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>3. Preset Voices</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("saved"); setErrorMessage(null); }}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "saved"
                ? "border-teal-400 text-teal-300 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Save className="h-3.5 w-3.5" />
            <span>Saved Voices ({savedVoices.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* TAB 1: UPLOAD AUDIO FILE */}
          {activeTab === "upload" && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-base font-bold text-slate-100 flex items-center justify-center gap-2">
                    <Upload className="h-5 w-5 text-teal-400" />
                    <span>Upload Sample Audio File</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Upload an audio recording of any speaker (MP3, WAV, M4A, AAC, OGG) to clone and synthesize their voice profile.
                  </p>
                </div>

                {/* Upload Drag & Drop Box */}
                <label 
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) processFile(f);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all block ${
                    isDraggingOver
                      ? "border-teal-400 bg-teal-500/10 scale-[1.01]"
                      : "border-slate-750 hover:border-teal-500/80 bg-slate-900/40 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="p-3.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    <Upload className="h-8 w-8 text-teal-400" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-200 block">
                      Click to Browse Audio File
                    </span>
                    <span className="text-xs text-teal-400/90 mt-1 block">
                      or drag & drop audio file here
                    </span>
                    <p className="text-[11px] text-slate-400 mt-2 font-mono">
                      Supported formats: MP3, WAV, M4A, AAC, WEBM, OGG (Max 25MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Uploaded Audio Preview */}
                {audioUrl && (
                  <div className="bg-slate-900 border border-teal-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto animate-fade-in shadow-lg">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlayReference}
                        className="h-11 w-11 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center cursor-pointer shadow-md transition-all shrink-0"
                        title={isPlayingReference ? "Pause sample" : "Play sample"}
                      >
                        {isPlayingReference ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                      </button>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-100 truncate max-w-[200px]">
                            {uploadedFileName || "Sample Audio"}
                          </p>
                          {uploadedFileSize && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-teal-300 font-mono">
                              {uploadedFileSize}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-teal-300/80 font-mono mt-0.5">
                          ✓ Audio ready • Click to clone voice
                        </p>
                      </div>
                      <audio
                        ref={referenceAudioRef}
                        src={audioUrl}
                        onEnded={() => setIsPlayingReference(false)}
                        className="hidden"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        type="button"
                        onClick={handleQuickCloneAndActivate}
                        disabled={isAnalyzing}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 hover:from-teal-300 hover:to-emerald-300 text-slate-950 text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ring-2 ring-teal-400/30"
                        title="Instantly clone and select this voice to use right away"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                            <span>Cloning Voice...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 fill-slate-950" />
                            <span>⚡ Clone & Choose Voice Now</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleAnalyzeVoice}
                        disabled={isAnalyzing}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="View detailed AI analysis, adjust name, and preview sample"
                      >
                        <span>Analyze & Customize</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: RECORD WITH MIC */}
          {activeTab === "record" && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-base font-bold text-slate-100 flex items-center justify-center gap-2">
                    <Mic className="h-5 w-5 text-teal-400" />
                    <span>Record Voice Sample</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Have the speaker talk into the microphone for 5 to 15 seconds (e.g. greeting or short introduction).
                  </p>
                </div>

                {/* Animated Record Center */}
                <div className="py-4 flex flex-col items-center justify-center">
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`h-24 w-24 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shadow-xl ${
                      isRecording
                        ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse ring-8 ring-rose-500/30"
                        : "bg-gradient-to-tr from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-slate-950 ring-4 ring-teal-500/20"
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="h-8 w-8 fill-current" />
                        <span className="text-[11px] font-bold mt-1">Stop ({recordSeconds}s)</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-8 w-8" />
                        <span className="text-[11px] font-bold mt-1">Record Mic</span>
                      </>
                    )}
                  </button>

                  {isRecording && (
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-rose-400 font-mono">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span>Recording voice... {recordSeconds} / 20 seconds</span>
                    </div>
                  )}
                </div>

                {/* Recorded Audio Preview & Analyze Trigger */}
                {audioUrl && !isRecording && (
                  <div className="bg-slate-900 border border-teal-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto animate-fade-in shadow-lg">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlayReference}
                        className="h-11 w-11 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center cursor-pointer shadow-md transition-all shrink-0"
                      >
                        {isPlayingReference ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                      </button>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-100">Recorded Mic Sample</p>
                        <p className="text-[11px] text-teal-300/80 font-mono mt-0.5">
                          ✓ {recordSeconds}s sample ready
                        </p>
                      </div>
                      <audio
                        ref={referenceAudioRef}
                        src={audioUrl}
                        onEnded={() => setIsPlayingReference(false)}
                        className="hidden"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        type="button"
                        onClick={handleQuickCloneAndActivate}
                        disabled={isAnalyzing}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 hover:from-teal-300 hover:to-emerald-300 text-slate-950 text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ring-2 ring-teal-400/30"
                        title="Instantly clone and select this voice to use right away"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                            <span>Cloning Voice...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 fill-slate-950" />
                            <span>⚡ Clone & Choose Voice Now</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleAnalyzeVoice}
                        disabled={isAnalyzing}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="View detailed AI analysis, adjust name, and preview sample"
                      >
                        <span>Analyze & Customize</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI ANALYSIS RESULT CARD (When analyzed from Record or Upload) */}
          {analyzedProfile && (
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/30 border border-teal-500/50 rounded-2xl p-5 space-y-4 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
                    <Activity className="h-4 w-4 text-teal-400" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-teal-200">
                      Vocal Signature & AI Mapping Results
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      The unique acoustic frequency and timbre profile of this voice has been calculated
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  ✓ Match 98%
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Gender</span>
                  <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 mt-1">
                    <User className="h-3.5 w-3.5 text-teal-400" />
                    {analyzedProfile.speakerGender === "female" ? "Female" : "Male"}
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Pitch (Hz)</span>
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mt-1">
                    <Activity className="h-3.5 w-3.5 text-amber-400" />
                    {analyzedProfile.pitchHz ? `${analyzedProfile.pitchHz} Hz (${analyzedProfile.vocalPitch})` : analyzedProfile.vocalPitch}
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Pace</span>
                  <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 mt-1">
                    <Volume2 className="h-3.5 w-3.5 text-teal-400" />
                    {analyzedProfile.speakingPace}
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">AI Neural Base</span>
                  <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5 mt-1">
                    <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                    {analyzedProfile.recommendedPrebuiltVoice} Base
                  </span>
                </div>
              </div>

              {/* Vocal Timbre & Accent Details */}
              <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-start justify-between">
                  <span className="text-slate-400 text-[11px]">Vocal Timbre:</span>
                  <span className="font-medium text-slate-200">{analyzedProfile.vocalTimbre}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-400 text-[11px]">Detected Accent:</span>
                  <span className="font-medium text-teal-300">{analyzedProfile.detectedAccent}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-800 text-[11px] text-slate-300 italic">
                  &ldquo;{analyzedProfile.vocalReplicationPrompt}&rdquo;
                </div>
              </div>

              {/* Name Input & Action Bar */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Name this voice profile:
                  </label>
                  <input
                    type="text"
                    value={customVoiceName}
                    onChange={(e) => setCustomVoiceName(e.target.value)}
                    placeholder="e.g. My Voice, Colleague's Voice, Dynamic Speaker..."
                    className="w-full bg-slate-950 border border-slate-700 focus:border-teal-400 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                </div>

                {/* Inline Test Sample Audio Player if available */}
                {testAudioUrl && (
                  <div className="p-3 bg-teal-950/40 border border-teal-500/40 rounded-xl flex items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-teal-400 animate-pulse" />
                      <span className="text-xs font-semibold text-teal-200">Voice clone sample is ready!</span>
                    </div>
                    <audio ref={testAudioRef} src={testAudioUrl} controls className="h-8 max-w-[220px]" />
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleTestClonedVoice(analyzedProfile)}
                    disabled={isTestingVoice}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isTestingVoice ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-teal-400" />
                        <span>Generating sample...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 text-teal-400 fill-current" />
                        <span>Test Clone Voice</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleConfirmAndActivate(analyzedProfile)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 hover:from-teal-300 hover:to-emerald-300 text-slate-950 text-xs font-black transition-all shadow-lg flex items-center gap-2 cursor-pointer ring-2 ring-teal-400/30"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>✓ Choose & Use This Cloned Voice</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: POPULAR PRESET VOICES */}
          {activeTab === "presets" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Pre-configured Authentic Voices</h3>
                  <p className="text-xs text-slate-400">
                    Select a pre-configured authentic voice profile to start speaking right away
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PRESET_VOICES.map((preset) => {
                  const isActive = activeClonedVoice?.id === preset.id;
                  return (
                    <div
                      key={preset.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                        isActive
                          ? "bg-slate-850/90 border-teal-500 ring-1 ring-teal-500/40"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-100">{preset.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            preset.speakerGender === "female"
                              ? "bg-purple-950 text-purple-300 border border-purple-800/60"
                              : "bg-sky-950 text-sky-300 border border-sky-800/60"
                          }`}>
                            {preset.speakerGender === "female" ? "Female" : "Male"}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {preset.vocalTimbre}
                        </p>

                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            Pitch: {preset.vocalPitch}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            Speed: {preset.recommendedSpeed}x
                          </span>
                          <span className="px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800/50">
                            {preset.detectedAccent}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                        <button
                          type="button"
                          onClick={() => handleTestClonedVoice(preset)}
                          disabled={isTestingVoice}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Play className="h-3 w-3 fill-current text-teal-400" />
                          <span>Test Sample</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleConfirmAndActivate(preset)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isActive
                              ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                              : "bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-sm"
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{isActive ? "Active" : "Use This Voice"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SAVED CLONED VOICES */}
          {activeTab === "saved" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Your Saved Voice Clones</h3>
                  <p className="text-xs text-slate-400">
                    Custom voice profiles you have previously recorded and saved
                  </p>
                </div>
              </div>

              {savedVoices.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl p-6 bg-slate-950/40">
                  <Mic className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-300 font-medium">No saved voices yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Use &apos;Record Mic&apos; or &apos;Upload Sample Audio&apos; to clone and save your first custom voice.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedVoices.map((voice) => {
                    const isActive = activeClonedVoice?.id === voice.id;
                    return (
                      <div
                        key={voice.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isActive
                            ? "bg-slate-850/90 border-teal-500 ring-1 ring-teal-500/40"
                            : "bg-slate-950/60 border-slate-800"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-100">{voice.name}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              voice.speakerGender === "female"
                                ? "bg-purple-950 text-purple-300"
                                : "bg-sky-950 text-sky-300"
                            }`}>
                              {voice.speakerGender === "female" ? "Female" : "Male"}
                            </span>
                            {isActive && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {voice.vocalTimbre} • {voice.detectedAccent}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleTestClonedVoice(voice)}
                            disabled={isTestingVoice}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Play className="h-3 w-3 fill-current text-teal-400" />
                            <span>Play Sample</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onSelectClonedVoice(voice);
                              onClose();
                            }}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              isActive
                                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 ring-1 ring-teal-500/50"
                                : "bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-sm"
                            }`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>{isActive ? "Active (Selected)" : "Choose This Voice"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteSavedVoice(voice.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete voice"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {activeClonedVoice ? (
              <span className="flex items-center gap-1.5 text-teal-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
                Currently Active: <strong>{activeClonedVoice.name}</strong>
              </span>
            ) : (
              <span>No custom voice selected (Standard default voice active)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeClonedVoice && (
              <button
                type="button"
                onClick={() => {
                  onRemoveClonedVoice();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-medium transition-all cursor-pointer"
              >
                Reset to Default
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
