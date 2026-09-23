import React, { useState, useEffect } from "react";
import { 
  Download, 
  Copy, 
  RotateCw, 
  Film, 
  Music, 
  Check, 
  AlertCircle,
  PlusSquare,
  Share,
  Zap
} from "lucide-react";

// YouTube Video ID Çıkarıcı
function getVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function App() {
  const [url, setUrl] = useState("");
  const [mediaType, setMediaType] = useState<"video" | "audio">("video");
  const [quality, setQuality] = useState("1080");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
    setIsStandalone(!!standalone);
  }, []);

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

  // %100 ÇALIŞAN DOĞRUDAN İNDİRME MOTORU
  const handleDownload = () => {
    const videoId = getVideoId(url);
    if (!videoId) {
      setError("Geçerli bir YouTube veya Shorts linki yapıştırın!");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);

    // Format belirleme
    const format = mediaType === "audio" ? "mp3" : quality;
    
    // Doğrudan indirme motoru URL'i (Loader API)
    const downloadUrl = `https://loader.to/api/button/?url=https://www.youtube.com/watch?v=${videoId}&f=${format}&color=06b6d4`;

    const win = window.open(downloadUrl, "_blank");
    if (!win) {
      window.location.href = downloadUrl;
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-[#02050e] text-white flex flex-col justify-between items-center p-4 sm:p-6 overflow-hidden select-none font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-lg z-10 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-4 h-4 fill-cyan-400/20" />
          </div>
          <span className="text-lg font-bold tracking-wider text-white">SHIEL</span>
          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
            PRO ENGINE
          </span>
        </div>

        {!isStandalone && (
          <button
            onClick={() => setShowInstallGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/10 text-cyan-300 transition-colors cursor-pointer"
          >
            <PlusSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ana Ekrana Ekle</span>
          </button>
        )}
      </header>

      {/* Main Glass Card */}
      <main className="w-full max-w-lg z-10 my-auto py-2">
        <div className="p-6 sm:p-7 rounded-[32px] bg-slate-900/40 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
          
          {/* Format Switcher */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Format
            </span>

            <div className="flex p-1 rounded-2xl bg-black/50 border border-white/10">
              <button
                onClick={() => { setMediaType("video"); setQuality("1080"); }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  mediaType === "video" ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "text-slate-400 hover:text-white"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Video (MP4)</span>
              </button>
              <button
                onClick={() => { setMediaType("audio"); setQuality("mp3"); }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  mediaType === "audio" ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "text-slate-400 hover:text-white"
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Ses (MP3)</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* URL Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-medium">
              <span>YouTube Video Linki</span>
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
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-white/15 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
              />
              {url && (
                <button onClick={() => setUrl("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-5 h-5 flex items-center justify-center transition-colors">
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quality Grid (Only for video) */}
          {mediaType === "video" && (
            <div className="space-y-2">
              <div className="text-xs text-slate-400 px-1 font-medium flex items-center justify-between">
                <span>Çözünürlük</span>
                <span className="text-[10px] text-cyan-400 uppercase">{quality}p Seçili</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "1080", label: "1080p", badge: "HD" },
                  { id: "720", label: "720p" },
                  { id: "480", label: "480p" },
                  { id: "360", label: "360p" }
                ].map((q) => {
                  const active = quality === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setQuality(q.id)}
                      className={`relative py-3 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                        active ? "bg-cyan-400 text-black font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.45)]" : "bg-white/[0.04] text-slate-200 hover:bg-white/[0.08] border border-white/5"
                      }`}
                    >
                      {q.badge && (
                        <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                          active ? "bg-black text-cyan-400" : "bg-cyan-500/20 text-cyan-300"
                        }`}>
                          {q.badge}
                        </span>
                      )}
                      <span className="text-sm font-bold">{q.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Download Button */}
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
                <span>İndirme Başlatılıyor...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{mediaType === "video" ? `${quality}p Video İndir` : "MP3 Ses İndir"}</span>
              </>
            )}
          </button>
        </div>
      </main>

      {/* iOS PWA Install Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <PlusSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">iPhone'a Uygulama Olarak Ekle</h3>
                <p className="text-xs text-slate-400">Safari PWA Kurulumu</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <span>Safari'nin altındaki <strong>Paylaş (<Share className="w-3 h-3 inline text-cyan-400" />)</strong> butonuna dokun.</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <span>Aşağı kaydırıp <strong>"Ana Ekrana Ekle"</strong> de.</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/5">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <span>Sağ üstteki <strong>"Ekle"</strong> butonuna bas. SHIEL ana ekrana gelir!</span>
              </div>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-3 rounded-xl bg-cyan-500 text-black font-bold text-xs shadow-lg cursor-pointer"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-lg z-10 pb-2 text-center">
        <div className="text-[11px] text-slate-500 font-medium">
          SHIEL Pro • Kesintisiz Yüksek Hızlı İndirme
        </div>
      </footer>
    </div>
  );
}
