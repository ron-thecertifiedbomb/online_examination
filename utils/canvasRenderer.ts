import { MeshPoint } from "../interfaces/tool";

export const renderTo8K = async (
  points: MeshPoint[],
  bgColor: string,
): Promise<string> => {
  const canvas = document.createElement("canvas");
  canvas.width = 7680;
  canvas.height = 4320;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas_Context_Null");

  // 1. Fill Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Set Blending Mode (Matches CSS screen/overlay)
  ctx.globalCompositeOperation = "screen";

  // 3. Render each Point as a Radial Gradient
  points.forEach((p) => {
    const centerX = (p.x / 100) * canvas.width;
    const centerY = (p.y / 100) * canvas.height;
    // Size scales relative to 8K width
    const radius = (p.size / 100) * canvas.width * 0.8;

    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius,
    );
    gradient.addColorStop(0, p.color);
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  // 4. Add Noise Overlay (Essential for 8K quality)
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  for (let i = 0; i < 100000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 2, 2);
  }

  return canvas.toDataURL("image/png", 1.0);
};
