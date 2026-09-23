import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { spawn } from 'child_process';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Doğrudan yt-dlp Tabanlı İndirme Servisi
app.get('/api/download', async (req, res) => {
  const videoUrl = req.query.url as string;
  const type = (req.query.type as string) || 'video';
  const quality = (req.query.quality as string) || '1080';

  if (!videoUrl) {
    return res.status(400).json({ error: 'URL parametresi gerekli' });
  }

  try {
    const isAudio = type === 'audio';
    const filename = `SHIEL_${Date.now()}.${isAudio ? 'mp3' : 'mp4'}`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', isAudio ? 'audio/mpeg' : 'video/mp4');

    const ytArgs = isAudio
      ? ['-x', '--audio-format', 'mp3', '-o', '-', videoUrl]
      : ['-f', `bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]/best`, '--merge-output-format', 'mp4', '-o', '-', videoUrl];

    const ytdlProcess = spawn('yt-dlp', ytArgs);

    ytdlProcess.stdout.pipe(res);

    ytdlProcess.stderr.on('data', (data) => {
      console.error(`yt-dlp log: ${data}`);
    });

    req.on('close', () => {
      ytdlProcess.kill();
    });

  } catch (error: any) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Sunucu hatası' });
    }
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server çalışıyor: http://0.0.0.0:${PORT}`);
  });
}

startServer();
