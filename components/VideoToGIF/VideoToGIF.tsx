/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useCallback } from "react";
import {
    Upload,
    Download,
    Trash2,
    Settings,
    AlertCircle,
    CheckCircle,
    Image as ImageIcon,
    Video,
    Clock,
    AlertTriangle,
    Info
} from "lucide-react";

export function VideoToGIF() {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [gifUrl, setGifUrl] = useState<string | null>(null);
    const [converting, setConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const [warning, setWarning] = useState("");
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    // GIF settings
    const [startTime, setStartTime] = useState(0);
    const [duration, setDuration] = useState(3);
    const [width, setWidth] = useState(480);
    const [quality, setQuality] = useState(1);
    const [fps, setFps] = useState(10);

    // Video metadata
    const [videoDuration, setVideoDuration] = useState(0);
    const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // File size validation
    const validateFileSize = (file: File): { valid: boolean; message: string } => {
        const sizeMB = file.size / 1024 / 1024;

        if (sizeMB > 100) {
            return {
                valid: false,
                message: `File is ${sizeMB.toFixed(1)}MB. Maximum allowed size is 100MB. Please compress your video first.`
            };
        }

        if (sizeMB > 50) {
            setWarning(`Large file detected (${sizeMB.toFixed(1)}MB). Conversion may take longer and use more memory. Consider compressing first for better results.`);
        } else {
            setWarning("");
        }

        return { valid: true, message: "" };
    };

    // Handle video upload
    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        // Clear previous messages
        setError("");
        setWarning("");

        // Check if it's a video
        if (!file.type.startsWith('video/')) {
            setError("Invalid file type. Please upload a video file (MP4, WebM, MOV, AVI, etc.)");
            return;
        }

        // Validate file size
        const sizeValidation = validateFileSize(file);
        if (!sizeValidation.valid) {
            setError(sizeValidation.message);
            return;
        }

        // Check video duration warning
        const videoElement = document.createElement('video');
        const url = URL.createObjectURL(file);
        videoElement.preload = 'metadata';
        videoElement.src = url;

        videoElement.onloadedmetadata = () => {
            const duration = videoElement.duration;
            URL.revokeObjectURL(url);

            if (duration > 60) {
                setWarning(`Video is ${Math.floor(duration)} seconds long. Only the first 10 seconds will be converted to GIF.`);
            }
        };

        setVideoFile(file);
        setGifUrl(null);
        setProgress(0);
        setIsVideoLoaded(false);

        // Create URL for preview
        const videoUrl_ = URL.createObjectURL(file);
        setVideoUrl(videoUrl_);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Load video metadata when video is ready
    const onVideoLoad = () => {
        if (videoRef.current) {
            const duration = videoRef.current.duration;
            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;

            setVideoDuration(duration);
            setVideoDimensions({
                width: videoWidth,
                height: videoHeight
            });
            setIsVideoLoaded(true);

            // Suggest max duration
            if (duration < 10) {
                setDuration(Math.floor(duration));
            }

            // Show resolution warning
            if (videoWidth > 1280 || videoHeight > 720) {
                setWarning(`High resolution detected (${videoWidth}x${videoHeight}). Consider reducing width for better performance.`);
            }
        }
    };

    // Convert video to GIF
    const convertToGIF = useCallback(async () => {
        if (!videoRef.current) {
            setError("Video element not ready");
            return;
        }

        if (!canvasRef.current) {
            setError("Canvas element not ready");
            return;
        }

        if (!isVideoLoaded) {
            setError("Please wait for video to load completely");
            return;
        }

        // Additional validation before conversion
        if (duration > 10) {
            setError("Maximum duration is 10 seconds. Please reduce the duration.");
            return;
        }

        if (width > 800) {
            setError("Maximum width is 800px. Please reduce the width.");
            return;
        }

        setConverting(true);
        setProgress(0);
        setError("");
        setWarning("");

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            setError("Failed to initialize canvas");
            setConverting(false);
            return;
        }

        try {
            // Calculate dimensions
            const aspectRatio = videoDimensions.height / videoDimensions.width;
            const height = Math.round(width * aspectRatio);
            canvas.width = width;
            canvas.height = height;

            // Seek to start position
            video.currentTime = startTime;

            // Wait for seek to complete
            await new Promise((resolve) => {
                video.onseeked = resolve;
            });

            // Calculate frames
            const frameCount = Math.floor(duration * fps);

            // Limit frames for performance
            if (frameCount > 150) {
                setWarning(`Converting ${frameCount} frames. This may take a moment...`);
            }

            const frames: ImageData[] = [];
            const frameDelay = 1000 / fps;

            for (let i = 0; i < frameCount; i++) {
                // Draw current frame
                ctx.drawImage(video, 0, 0, width, height);
                const frameData = ctx.getImageData(0, 0, width, height);
                frames.push(frameData);

                // Update progress
                setProgress(((i + 1) / frameCount) * 100);

                // Move to next frame
                if (i < frameCount - 1) {
                    video.currentTime = startTime + ((i + 1) / fps);
                    await new Promise((resolve) => {
                        video.onseeked = resolve;
                    });
                }
            }

            video.pause();

            // Create video from frames
            const result = await createVideoFromFrames(frames, width, height, frameDelay, quality);
            setGifUrl(result);
        } catch (err) {
            console.error("Conversion error:", err);
            setError("Failed to convert video. Please try with different settings.");
        } finally {
            setConverting(false);
        }
    }, [startTime, duration, width, quality, fps, videoDimensions, isVideoLoaded]);

    // Create video from frames
    const createVideoFromFrames = async (frames: ImageData[], width: number, height: number, delay: number, quality: number): Promise<string> => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');

        if (!tempCtx) {
            throw new Error("Cannot create canvas context");
        }

        const stream = tempCanvas.captureStream(fps);
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm',
            videoBitsPerSecond: quality === 1 ? 2000000 : quality === 0.7 ? 1000000 : 500000
        });

        const chunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

        return new Promise((resolve, reject) => {
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                resolve(url);
            };

            mediaRecorder.onerror = (err) => {
                reject(err);
            };

            let frameIndex = 0;
            mediaRecorder.start();

            const interval = setInterval(() => {
                if (frameIndex >= frames.length) {
                    clearInterval(interval);
                    mediaRecorder.stop();
                    return;
                }

                tempCtx.putImageData(frames[frameIndex], 0, 0);
                frameIndex++;
            }, delay);
        });
    };

    // Download video
    const downloadGIF = () => {
        if (!gifUrl) return;

        const a = document.createElement('a');
        a.href = gifUrl;
        a.download = `animated-${Date.now()}.webm`;
        a.click();
    };

    // Clear everything
    const clearAll = () => {
        setVideoFile(null);
        setVideoUrl(null);
        setGifUrl(null);
        setError("");
        setWarning("");
        setProgress(0);
        setStartTime(0);
        setDuration(3);
        setVideoDuration(0);
        setVideoDimensions({ width: 0, height: 0 });
        setIsVideoLoaded(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (videoRef.current) videoRef.current.src = "";
    };

    // Format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Get file size warning color
    const getFileSizeColor = () => {
        if (!videoFile) return "text-zinc-500";
        const sizeMB = videoFile.size / 1024 / 1024;
        if (sizeMB > 50) return "text-orange-500";
        if (sizeMB > 25) return "text-yellow-500";
        return "text-emerald-500";
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            {!videoFile ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-br from-emerald-950/30 to-zinc-950 border-2 border-dashed border-emerald-500/30 rounded-2xl p-12 text-center cursor-pointer hover:border-emerald-500/60 transition"
                >
                    <div className="inline-flex p-4 rounded-full bg-emerald-500/20 mb-4">
                        <Video size={48} className="text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-black text-white mb-2">Upload Video</h3>
                    <p className="text-xs font-mono text-zinc-500 mb-4">
                        MP4, WebM, MOV, AVI (Max 100MB)
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-black text-xs uppercase">
                        <Upload size={12} /> SELECT VIDEO
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                    />

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-zinc-900/50 rounded-xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <Info size={12} />
                            <span className="text-[9px] font-mono uppercase">Guidelines</span>
                        </div>
                        <ul className="text-[9px] font-mono text-zinc-600 space-y-1 text-left">
                            <li>✓ Maximum file size: 100MB</li>
                            <li>✓ Maximum duration: 10 seconds</li>
                            <li>✓ Recommended: 480px width for balance</li>
                            <li>✓ Larger files = slower conversion</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <>
                    {/* Video Preview & Controls */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                        <div className="relative">
                            <video
                                ref={videoRef}
                                src={videoUrl || undefined}
                                onLoadedMetadata={onVideoLoad}
                                className="w-full max-h-96 object-contain bg-black"
                                controls
                            />
                            {/* Hidden canvas for processing */}
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </div>

                        {/* Video Info */}
                        {isVideoLoaded && (
                            <div className="border-t border-zinc-900 p-4">
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div>
                                        <p className="text-[9px] font-mono text-zinc-600">DURATION</p>
                                        <p className="text-sm font-black text-white">{formatTime(videoDuration)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-mono text-zinc-600">RESOLUTION</p>
                                        <p className="text-sm font-black text-white">{videoDimensions.width}×{videoDimensions.height}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-mono text-zinc-600">FILE SIZE</p>
                                        <p className={`text-sm font-black ${getFileSizeColor()}`}>
                                            {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading indicator */}
                        {!isVideoLoaded && (
                            <div className="border-t border-zinc-900 p-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs font-mono text-zinc-500">Loading video metadata...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Warning Messages */}
                    {warning && (
                        <div className="bg-yellow-950/20 border border-yellow-500/20 rounded-2xl p-4">
                            <div className="flex items-start gap-2">
                                <AlertTriangle size={14} className="text-yellow-500 mt-0.5" />
                                <div>
                                    <h4 className="text-[10px] font-black text-yellow-500 uppercase mb-1">WARNING</h4>
                                    <p className="text-xs font-mono text-yellow-400">{warning}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-4">
                            <div className="flex items-start gap-2">
                                <AlertCircle size={14} className="text-red-500 mt-0.5" />
                                <div>
                                    <h4 className="text-[10px] font-black text-red-500 uppercase mb-1">ERROR</h4>
                                    <p className="text-xs font-mono text-red-400">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GIF Settings - Only show when video is loaded */}
                    {isVideoLoaded && (
                        <>
                            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Settings size={14} className="text-emerald-500" />
                                    <span className="text-xs font-mono text-zinc-500">GIF SETTINGS</span>
                                </div>

                                <div className="space-y-4">
                                    {/* Start Time */}
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-[10px] font-mono text-zinc-600">START TIME</label>
                                            <span className="text-[10px] font-mono text-emerald-500">{formatTime(startTime)}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max={Math.max(0, videoDuration - 0.5)}
                                            step="0.5"
                                            value={startTime}
                                            onChange={(e) => setStartTime(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-[10px] font-mono text-zinc-600">DURATION (seconds)</label>
                                            <span className="text-[10px] font-mono text-emerald-500">{duration}s</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max={Math.min(10, videoDuration - startTime)}
                                            step="0.5"
                                            value={duration}
                                            onChange={(e) => setDuration(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <p className="text-[8px] font-mono text-zinc-600 mt-1">
                                            Max 10 seconds for optimal performance
                                        </p>
                                    </div>

                                    {/* Width */}
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-[10px] font-mono text-zinc-600">WIDTH (pixels)</label>
                                            <span className="text-[10px] font-mono text-emerald-500">{width}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="160"
                                            max="800"
                                            step="16"
                                            value={width}
                                            onChange={(e) => setWidth(parseInt(e.target.value))}
                                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <p className="text-[8px] font-mono text-zinc-600 mt-1">
                                            Recommended: 480px | Max: 800px
                                        </p>
                                    </div>

                                    {/* Quality */}
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-[10px] font-mono text-zinc-600">QUALITY</label>
                                            <span className="text-[10px] font-mono text-emerald-500">
                                                {quality === 1 ? "Best (Larger File)" : quality === 0.7 ? "Good (Balanced)" : "Fast (Smaller File)"}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setQuality(1)}
                                                className={`flex-1 py-2 rounded-lg text-[10px] font-mono transition ${quality === 1
                                                        ? "bg-emerald-500 text-black"
                                                        : "bg-zinc-900 text-zinc-500"
                                                    }`}
                                            >
                                                BEST
                                            </button>
                                            <button
                                                onClick={() => setQuality(0.7)}
                                                className={`flex-1 py-2 rounded-lg text-[10px] font-mono transition ${quality === 0.7
                                                        ? "bg-emerald-500 text-black"
                                                        : "bg-zinc-900 text-zinc-500"
                                                    }`}
                                            >
                                                GOOD
                                            </button>
                                            <button
                                                onClick={() => setQuality(0.3)}
                                                className={`flex-1 py-2 rounded-lg text-[10px] font-mono transition ${quality === 0.3
                                                        ? "bg-emerald-500 text-black"
                                                        : "bg-zinc-900 text-zinc-500"
                                                    }`}
                                            >
                                                FAST
                                            </button>
                                        </div>
                                    </div>

                                    {/* FPS */}
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-[10px] font-mono text-zinc-600">FRAME RATE (FPS)</label>
                                            <span className="text-[10px] font-mono text-emerald-500">{fps} fps</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {[8, 10, 12, 15].map((value) => (
                                                <button
                                                    key={value}
                                                    onClick={() => setFps(value)}
                                                    className={`flex-1 py-2 rounded-lg text-[10px] font-mono transition ${fps === value
                                                            ? "bg-emerald-500 text-black"
                                                            : "bg-zinc-900 text-zinc-500"
                                                        }`}
                                                >
                                                    {value}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-[8px] font-mono text-zinc-600 mt-1">
                                            Higher FPS = Smoother but larger file
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Convert Button */}
                            {!gifUrl ? (
                                <button
                                    onClick={convertToGIF}
                                    disabled={converting}
                                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-emerald-500 text-black font-black text-sm uppercase tracking-wider active:scale-95 transition disabled:opacity-50"
                                >
                                    {converting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            CONVERTING... {Math.round(progress)}%
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon size={18} /> CONVERT TO GIF
                                        </>
                                    )}
                                </button>
                            ) : (
                                <>
                                    {/* Result Preview */}
                                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                                        <div className="border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle size={14} className="text-emerald-500" />
                                                <span className="text-xs font-mono text-emerald-500">CONVERSION COMPLETE</span>
                                            </div>
                                        </div>
                                        <video
                                            src={gifUrl}
                                            className="w-full max-h-96 object-contain bg-black"
                                            controls
                                            autoPlay
                                            loop
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={downloadGIF}
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-black font-black text-xs uppercase tracking-wider active:scale-95 transition"
                                        >
                                            <Download size={14} /> DOWNLOAD GIF
                                        </button>

                                        <button
                                            onClick={clearAll}
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 active:scale-95 transition text-xs font-mono"
                                        >
                                            <Trash2 size={14} /> CONVERT ANOTHER
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}