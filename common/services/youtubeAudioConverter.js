import crypto from "crypto";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ffmpegPath from "ffmpeg-static";
import { sendProgress } from "../services/youtubeProgress.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ytDlpPath = path.join(__dirname, "tools", "yt-dlp_x86.exe");
const outputDir = path.join(__dirname, "downloads");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

export function downloadAudio(url) {
  return new Promise((resolve, reject) => {
    const downloadId = crypto.randomUUID();
    const outputTemplate = path.join(
      outputDir,
      `audio_%(title)s_%(id)s_${downloadId}.%(ext)s`,
    );

    const ytdlp = spawn(ytDlpPath, [
      "-f",
      "bestaudio",
      "-x",
      "--audio-format",
      "mp3",
      "--audio-quality",
      "0",
      "--no-playlist",
      "--ffmpeg-location",
      ffmpegPath,
      "-o",
      outputTemplate,
      url,
    ]);

    let mp3FileName = "";

    ytdlp.stdout.on("data", (data) => {
      const str = data.toString();
      const match = str.match(/\[download\]\s+(\d{1,3}\.\d)%/);
      if (match) {
        const percent = parseFloat(match[1]);
        sendProgress(percent, mp3FileName); // initially empty, but will update later
      }
    });

    ytdlp.stderr.on("data", (data) => console.error(data.toString()));
    ytdlp.on("error", reject);

    ytdlp.on("close", (code) => {
      if (code !== 0)
        return reject(new Error(`yt-dlp exited with code ${code}`));

      // Find the downloaded MP3
      const files = fs.readdirSync(outputDir);
      const mp3File = files.find(
        (f) => f.endsWith(".mp3") && f.includes(downloadId),
      );

      if (!mp3File) return reject(new Error("MP3 file not found"));

      mp3FileName = mp3File;

      const fullPath = path.join(outputDir, mp3File);
      console.log(`Conversion finished: ${fullPath}`);

      // Extract title from filename
      const matchTitle = mp3File.match(/^audio_(.+)_[^_]+_[^_]+\.mp3$/);
      const title = matchTitle ? matchTitle[1] : "audio";

      // Send final 100% with title
      sendProgress(100, title);

      resolve({ filePath: fullPath, title });
    });
  });
}
