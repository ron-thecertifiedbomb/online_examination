/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { GbaButton } from "@/lib/input";
import { loadMgbaFactory } from "./mgba-loader";

export type EmulatorStatus = "idle" | "running" | "paused";
export type TurboRate = 1 | 2 | 4;

export interface GbaCore {
  status: EmulatorStatus;
  attachCanvas(canvas: HTMLCanvasElement): void;
  loadRom(rom: Uint8Array, fileName?: string): Promise<void>;
  start(): void;
  pause(): void;
  reset(): void;
  press(btn: GbaButton): void;
  release(btn: GbaButton): void;
  saveState(slot: number): Promise<void>;
  loadState(slot: number): Promise<void>;
  saveStateBytes?(slot: number): Promise<Uint8Array | null>;
  loadStateBytes?(slot: number, bytes: Uint8Array): Promise<void>;
  setAudioEnabled?(enabled: boolean): void;
  setTurbo?(rate: TurboRate): void;
  getTurbo?(): TurboRate;
}

const BTN_MAP: Record<GbaButton, string> = {
  A: "a",
  B: "b",
  L: "l",
  R: "r",
  START: "start",
  SELECT: "select",
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

function safeCall(Module: any, fnName: string, ...args: any[]) {
  const fn = Module?.[fnName];
  if (typeof fn === "function") {
    fn(...args);
    return true;
  }
  return false;
}

function applyTurboToModule(Module: any, rate: TurboRate) {
  if (!Module) return false;
  const enable = rate > 1;
  if (safeCall(Module, "setTurbo", rate)) return true;
  if (safeCall(Module, "setSpeedMultiplier", rate)) return true;
  if (safeCall(Module, "setEmulationSpeed", rate)) return true;

  const ffEnabled =
    safeCall(Module, "setFastForward", enable) ||
    safeCall(Module, "setFastForwardEnabled", enable) ||
    safeCall(Module, "toggleFastForward", enable);

  if (ffEnabled) {
    safeCall(Module, "setFastForwardMultiplier", rate);
    safeCall(Module, "setSpeedMultiplier", rate);
    return true;
  }
  return false;
}

export async function createMgbaWasmCore(): Promise<GbaCore> {
  let canvasEl: HTMLCanvasElement | null = null;
  let Module: any = null;
  let audioOn = true;
  let currentRomPath = "";
  let turboRate: TurboRate = 1;
  let warnedTurbo = false;

  const core: GbaCore = {
    status: "idle",

    attachCanvas(canvas) {
      canvasEl = canvas;
      // FIX: Force hardware acceleration and disable transparency to stop flickering
      const ctx = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
      });
      if (ctx) ctx.imageSmoothingEnabled = false;
    },

    getTurbo() {
      return turboRate;
    },

    setTurbo(rate: TurboRate) {
      turboRate = rate;
      if (Module) applyTurboToModule(Module, turboRate);
    },

    async loadRom(romBytes, fileName = "game.gba") {
      if (!canvasEl) throw new Error("Canvas not attached");

      const factory = await loadMgbaFactory();

      const moduleConfig: any = {
        canvas: canvasEl,
        // FIX: Pass low-latency arguments to stabilize video output
        arguments: ["-l", "0"],
        locateFile: (path: string) => `/mgba/${path}`,
        preRun: [
          () => {
            // Force the canvas state before WASM takes over
            if (canvasEl) {
              const ctx = canvasEl.getContext("2d");
              if (ctx) ctx.imageSmoothingEnabled = false;
            }
          },
        ],
      };

      Module = await factory(moduleConfig);
      (window as any).__mgba = Module;
      Module.FSInit();

      try {
        Module.FS.mkdir("/roms");
      } catch {}
      const romPath = `/roms/${fileName}`;
      currentRomPath = romPath;
      Module.FS.writeFile(romPath, romBytes);
      Module.loadGame(romPath, null);

      if (audioOn) Module.resumeAudio?.();
      else Module.pauseAudio?.();

      applyTurboToModule(Module, turboRate);
      core.status = "running";
    },

    start() {
      if (!Module) return;
      Module.resumeGame?.();
      if (audioOn) Module.resumeAudio?.();
      applyTurboToModule(Module, turboRate);
      core.status = "running";
    },

    pause() {
      if (!Module) return;
      Module.pauseGame?.();
      Module.pauseAudio?.();
      core.status = "paused";
    },

    reset() {
      if (!Module) return;
      Module.quickReload?.();
      if (audioOn) Module.resumeAudio?.();
      applyTurboToModule(Module, turboRate);
      core.status = "running";
    },

    setAudioEnabled(enabled: boolean) {
      audioOn = enabled;
      if (!Module) return;
      enabled ? Module.resumeAudio?.() : Module.pauseAudio?.();
    },

    press(btn) {
      if (Module) Module.buttonPress?.(BTN_MAP[btn]);
    },
    release(btn) {
      if (Module) Module.buttonUnpress?.(BTN_MAP[btn]);
    },

    async saveState(slot: number) {
      if (Module) Module.saveState?.(slot);
    },
    async loadState(slot: number) {
      if (Module) {
        Module.loadState?.(slot);
        applyTurboToModule(Module, turboRate);
      }
    },

    async saveStateBytes(slot: number): Promise<Uint8Array | null> {
      if (!Module) return null;
      try {
        Module.saveState?.(slot);
        await new Promise<void>((resolve) => setTimeout(resolve, 150));

        const romFileName = currentRomPath.split("/").pop() ?? "";
        const romBaseName = romFileName.replace(/\.gba$/i, "");
        const path = `/data/states/${romBaseName}.ss${slot}`;

        return Module.FS.readFile(path);
      } catch (e) {
        return null;
      }
    },

    async loadStateBytes(slot: number, bytes: Uint8Array): Promise<void> {
      if (!Module) return;
      try {
        const romBaseName = (currentRomPath.split("/").pop() ?? "").replace(
          /\.gba$/i,
          "",
        );
        const targetPath = `/data/states/${romBaseName}.ss${slot}`;
        try {
          Module.FS.mkdir("/data/states");
        } catch {}
        Module.FS.writeFile(targetPath, bytes);
        Module.loadState?.(slot);
        applyTurboToModule(Module, turboRate);
      } catch (e) {
        console.error(e);
      }
    },
  };

  return core;
}

export function createStubCore(): GbaCore {
  return {
    status: "idle",
    attachCanvas: () => {},
    loadRom: async () => {},
    start: () => {},
    pause: () => {},
    reset: () => {},
    press: () => {},
    release: () => {},
    saveState: async () => {},
    loadState: async () => {},
    getTurbo: () => 1,
    setTurbo: () => {},
  };
}
