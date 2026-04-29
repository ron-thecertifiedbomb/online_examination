import https from "https";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

export class YouTubeDownloader {
  constructor() {
    this.toolsDir = path.join(process.cwd(), "tools");
    this.ytDlpPath = path.join(this.toolsDir, "yt-dlp_x86.exe");

    if (!fs.existsSync(this.toolsDir)) fs.mkdirSync(this.toolsDir);
  }

  async ensureYtDlp() {
    if (fs.existsSync(this.ytDlpPath)) return;

    console.log("Downloading yt-dlp_x86...");
    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(this.ytDlpPath);
      https
        .get(
          "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_x86.exe",
          (res) => {
            res.pipe(file);
            file.on("finish", () => {
              file.close();
              resolve(true);
            });
          }
        )
        .on("error", (err) => reject(err));
    });
  }

  streamAudio(url) {
    return spawn(`"${this.ytDlpPath}" -x --audio-format mp3 -o - "${url}"`, {
      shell: true,
    });
  }
}
