/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as jsnes from "jsnes"; // FIX: Use ESM import instead of require
import type { NesButton } from "./input";

export type EmulatorStatus = "idle" | "running" | "paused";

export interface NesCore {
  status: EmulatorStatus;
  attachCanvas(canvas: HTMLCanvasElement): void;
  loadRom(rom: Uint8Array, fileName?: string): void;
  start(): void;
  pause(): void;
  reset(): void;
  press(btn: NesButton): void;
  release(btn: NesButton): void;
  saveState(): string | null;
  loadState(data: string): void;
  setAudioEnabled?(enabled: boolean): void;
  destroy(): void;
}

const BUTTON_A = 0,
  BUTTON_B = 1,
  BUTTON_SELECT = 2,
  BUTTON_START = 3,
  BUTTON_UP = 4,
  BUTTON_DOWN = 5,
  BUTTON_LEFT = 6,
  BUTTON_RIGHT = 7;

const BTN_MAP: Record<NesButton, number> = {
  A: BUTTON_A,
  B: BUTTON_B,
  SELECT: BUTTON_SELECT,
  START: BUTTON_START,
  UP: BUTTON_UP,
  DOWN: BUTTON_DOWN,
  LEFT: BUTTON_LEFT,
  RIGHT: BUTTON_RIGHT,
};

export function createJsnesCore(): NesCore {
  let canvasEl: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let nes: any = null;
  let rafId: number | null = null;
  let audioEnabled = true;
  let audioCtx: AudioContext | null = null;
  let scriptProcessor: ScriptProcessorNode | null = null;

  const audioSamples: number[] = [];
  const SAMPLE_RATE = 44100;
  const imageData = new ImageData(256, 240);

  // FIX: Optimized Frame Logic to prevent header distortion
  function onFrame(frameBuffer: Int32Array) {
    if (!ctx) return;
    const data = imageData.data;
    for (let i = 0; i < 256 * 240; i++) {
      const pixel = frameBuffer[i];
      // Explicitly mapping bytes fixes specific mapper glitches
      data[i * 4 + 0] = pixel & 0xff; // R
      data[i * 4 + 1] = (pixel >> 8) & 0xff; // G
      data[i * 4 + 2] = (pixel >> 16) & 0xff; // B
      data[i * 4 + 3] = 0xff; // A
    }
    ctx.putImageData(imageData, 0, 0);
  }

  function onAudioSample(left: number, right: number) {
    if (!audioEnabled) return;
    audioSamples.push((left + right) / 2);
  }

  function initAudio() {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)({ sampleRate: SAMPLE_RATE });
      scriptProcessor = audioCtx.createScriptProcessor(4096, 0, 1);
      scriptProcessor.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0);
        const len = Math.min(audioSamples.length, output.length);
        for (let i = 0; i < len; i++) output[i] = audioSamples[i];
        for (let i = len; i < output.length; i++) output[i] = 0;
        audioSamples.splice(0, len);
      };
      scriptProcessor.connect(audioCtx.destination);
    } catch (e) {
      console.warn("Audio init failed", e);
    }
  }

  const TARGET_FPS = 60;
  const FRAME_MS = 1000 / TARGET_FPS;
  let lastFrameTime = 0;

  function startLoop() {
    if (rafId !== null) return;
    lastFrameTime = performance.now();
    const tick = (now: number) => {
      if (nes && core.status === "running") {
        const elapsed = now - lastFrameTime;
        if (elapsed >= FRAME_MS) {
          const frames = Math.min(Math.floor(elapsed / FRAME_MS), 4);
          for (let i = 0; i < frames; i++) {
            try {
              nes.frame();
            } catch (e) {
              core.status = "paused";
              stopLoop();
              return;
            }
          }
          lastFrameTime = now - (elapsed % FRAME_MS);
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  const core: NesCore = {
    status: "idle",
    attachCanvas(canvas) {
      canvasEl = canvas;
      // FIX: alpha: false and desynchronized for PPU stability
      ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
      if (ctx) ctx.imageSmoothingEnabled = false;
    },

    loadRom(romBytes, _fileName) {
      if (!canvasEl || !ctx) throw new Error("Canvas not attached");
      stopLoop();
      audioSamples.length = 0;

      // FIX: Using imported ESM jsnes
      nes = new jsnes.NES({
        onFrame,
        onAudioSample,
        sampleRate: SAMPLE_RATE,
      });

      const romStr = Array.from(romBytes)
        .map((b) => String.fromCharCode(b))
        .join("");

      try {
        nes.loadROM(romStr);
      } catch (e: any) {
        nes = null;
        throw e;
      }

      if (audioEnabled) initAudio();
      core.status = "running";
      startLoop();
    },

    start() {
      if (!nes) return;
      core.status = "running";
      if (audioEnabled) {
        initAudio();
        audioCtx?.resume();
      }
      startLoop();
    },

    pause() {
      if (!nes) return;
      core.status = "paused";
      stopLoop();
      audioCtx?.suspend();
    },

    reset() {
      if (!nes) return;
      stopLoop();
      try {
        nes.reloadROM();
      } catch {
        nes.reset();
      }
      core.status = "running";
      if (audioEnabled) audioCtx?.resume();
      audioSamples.length = 0;
      startLoop();
    },

    press(btn) {
      if (nes) nes.buttonDown(1, BTN_MAP[btn]);
    },
    release(btn) {
      if (nes) nes.buttonUp(1, BTN_MAP[btn]);
    },

    saveState() {
      if (!nes) return null;
      try {
        return JSON.stringify(nes.toJSON());
      } catch {
        return null;
      }
    },

    loadState(data: string) {
      if (!nes) return;
      try {
        nes.fromJSON(JSON.parse(data));
      } catch {}
    },

    setAudioEnabled(enabled: boolean) {
      audioEnabled = enabled;
      if (enabled) {
        initAudio();
        audioCtx?.resume();
      } else {
        audioCtx?.suspend();
      }
    },

    destroy() {
      stopLoop();
      scriptProcessor?.disconnect();
      audioCtx?.close();
      nes = null;
      audioCtx = null;
      scriptProcessor = null;
    },
  };

  return core;
}
