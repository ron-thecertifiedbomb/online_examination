import fs from "fs";
import { downloadAudio } from "../../common/services/youtubeAudioConverter.js";

export const downloadAudioController = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  try {
    const { filePath, title } = await downloadAudio(url); // destructure

    const stat = fs.statSync(filePath);

    res.status(200);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", stat.size);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${title}.mp3"` // use title from object
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Delete file after response is fully sent
    res.on("finish", () => {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    });

    fileStream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) res.sendStatus(500);
    });
  } catch (err) {
    console.error("Download/Conversion error:", err);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to download/convert video",
        details: err.message,
      });
    }
  }
};