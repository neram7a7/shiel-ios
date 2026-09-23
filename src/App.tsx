import React, { useState } from "react";
import { 
  Download, 
  Copy, 
  RotateCw, 
  Film, 
  Music, 
  Check, 
  AlertCircle 
} from "lucide-react";

interface QualityOption {
  id: string;
  label: string;
  sub: string;
  badge?: string;
  cobaltQuality?: string;
}

const VIDEO_QUALITIES: QualityOption[] = [
  { id: "max", label: "8K/4K", sub: "MAX", badge: "MAX", cobaltQuality: "max" },
  { id: "1440", label: "2K", sub: "1440p", badge: "QHD", cobaltQuality: "1440" },
  { id: "1080", label: "1080p", sub: "FHD", badge: "POPÜLER", cobaltQuality: "1080" },
  { id: "720", label: "720p", sub: "HD", cobaltQuality: "720" },
  { id: "480", label: "480p", sub: "SD", cobaltQuality: "480" },
  { id: "360", label: "360p", sub: "HIZLI", cobaltQuality: "360" },
];

const AUDIO_QUALITIES: QualityOption[] = [
  { id: "mp3", label: "MP3", sub: "320 KBPS", badge: "EN İYİ" },
  { id: "opus", label: "OPUS", sub: "NET SES", badge: "HI-FI" },
  { id: "aac", label: "AAC", sub: "APPLE STD" },
  { id: "wav", label: "WAV", sub: "KAYIPSIZ" },
];

export default function App() {
  const [url, setUrl] = useState("");
  const [mediaType, setMediaType] = useState<"video" | "audio">("video");
  const [selectedQuality, setSelectedQuality] = useState("1080");
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }
      }
    } catch {}
  };

  // Ultra Hızlı Cobalt v10 Native Engine
  const handleDownload = async () => {
    if (!url.trim()) {
      setErrorMessage("Lütfen geçerli bir link yapıştırın!");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setStatusText("Cobalt Motoru bağlanıyor...");

    const COBALT_SERVERS = [
      "https://api.cobalt.tools/api/json",
      "https://cobalt-api.kwiatekm.com/api/json",
      "https://co.wuk.sh/api/json"
    ];

    const payload: any = {
      url: url.trim(),
      videoQuality: selectedQuality,
      audioFormat: selectedQuality === "mp3" || selectedQuality === "opus" || selectedQuality === "aac" || selectedQuality === "wav" ? selectedQuality : "mp3",
      isAudioOnly: mediaType === "audio",
      downloadMode: mediaType === "audio" ? "audio" : "auto",
      youtubeVideoCodec: "h264"
    };

    let downloadUrl: string | null = null;

    for (const server of COBALT_SERVERS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(server, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) continue;

        const data = await response.json();
        if (data && (data.url || data.audio)) {
          downloadUrl = data.url || data.audio;
          break;
        }
      } catch {
        continue;
      }
    }

    if (downloadUrl) {
      setStatusText("İndirme başlatıldı!");
      window.location.href = downloadUrl;

      setTimeout(() => {
        setLoading(false);
        setStatusText("");
      }, 1500);
    } else {
      setLoading(false);
      setStatusText("");
      setErrorMessage("Video akışı çözülemedi. Lütfen linki kontrol edin.");
      setTimeout(() => setErrorMessage(null), 3500);
    }
  };

  const activeQualities = mediaType === "video" ? VIDEO_QUALITIES : AUDIO_QUALITIES;

  return (
    <div className="relative min-h-screen bg-[#02050e] text-white flex flex-col justify-center items-center p-4 sm:p-6 overflow-hidden select-none font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        <div className="p-6 sm:p-7 rounded-[32px] bg-slate-900/40 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                SHIEL
              </span>
              <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 uppercase tracking-wider">
                Cobalt v10
              </span>
            </div>

            <div className="flex p-1 rounded-2xl bg-black/50 border border-white/10">
              <button
                onClick={() => { setMediaType("video"); setSelectedQuality("1080"); }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  mediaType === "video" ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "text-slate-400 hover:text-white"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Video</span>
              </button>
              <button
                onClick={() => { setMediaType("audio"); setSelectedQuality("mp3"); }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  mediaType === "audio" ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "text-slate-400 hover:text-white"
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Ses</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-medium">
              <span>Medya Linki</span>
              <button 
                onClick={handlePaste} 
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Yapıştırıldı" : "Panodan Yapıştır"}</span>
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="YouTube, Shorts, TikTok veya Instagram linki..."
                className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-white/15 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
              />
              {url && (
                <button onClick={() => setUrl("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-5 h-5 flex items-center justify-center transition-colors">
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400 px-1 font-medium flex items-center justify-between">
              <span>Çözünürlük & Format</span>
              <span className="text-[10px] text-cyan-400 uppercase">{selectedQuality.toUpperCase()} Seçili</span>
            </div>

            <div className={`grid gap-2 ${mediaType === "video" ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-2 sm:grid-cols-4"}`}>
              {activeQualities.map((q) => {
                const active = selectedQuality === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuality(q.id)}
                    className={`relative py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      active ? "bg-cyan-400 text-black font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.45)] scale-[1.03]" : "bg-white/[0.04] text-slate-200 hover:bg-white/[0.08] border border-white/5"
                    }`}
                  >
                    {q.badge && (
                      <span className={`absolute -top-1.5 right-1 text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter ${
                        active ? "bg-black text-cyan-400" : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      }`}>
                        {q.badge}
                      </span>
                    )}
                    <span className="text-sm font-bold tracking-tight leading-none mt-0.5">{q.label}</span>
                    <span className={`text-[9px] font-semibold leading-none ${active ? "text-black/80" : "text-slate-500"}`}>
                      {q.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={!url.trim() || loading}
            className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
              !url.trim() || loading
                ? "bg-slate-800/40 text-slate-600 border border-white/5 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-black" />
                <span>{statusText || "İşleniyor..."}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{mediaType === "video" ? "Videoyu İndir" : "Sesi İndir"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
