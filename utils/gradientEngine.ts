// utils/gradientEngine.ts
import { MeshPoint } from "../interfaces/tool";

export const generateMeshCSS = (points: MeshPoint[], bgColor: string) => {
  // Instead of radial "dots," we create directional light flows
  // that occupy 100% of the container.
  const gradients = points.map((p, i) => {
    const angle = Math.atan2(p.y - 50, p.x - 50) * (180 / Math.PI);
    return `linear-gradient(${angle}deg, ${p.color} 0%, transparent 100%)`;
  });

  return {
    backgroundColor: bgColor,
    backgroundImage: gradients.join(", "),
    backgroundBlendMode: "hard-light", // Hard-light creates the "warp" effect
    backgroundSize: "100% 100%",
  };
};
