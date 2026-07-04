import { useEffect, useRef } from "react";

interface Heart {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

export default function FloatingHearts() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = [
      "rgba(244, 63, 94, ", // rose
      "rgba(251, 113, 133, ", // light rose
      "rgba(253, 164, 175, ", // pale pink
      "rgba(225, 29, 72, ", // crimson
      "rgba(253, 186, 116, ", // peach
    ];

    // Draw a single bezier heart
    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      opacity: number,
      colorPrefix: string
    ) => {
      context.beginPath();
      // Draw heart path starting from the top cleft
      context.moveTo(x, y + size * 0.3);
      
      // Top left curve
      context.bezierCurveTo(
        x - size / 2, y - size / 2,
        x - size, y + size / 3,
        x, y + size * 0.95
      );
      
      // Top right curve
      context.bezierCurveTo(
        x + size, y + size / 3,
        x + size / 2, y - size / 2,
        x, y + size * 0.3
      );

      context.closePath();
      context.fillStyle = colorPrefix + opacity + ")";
      context.fill();
    };

    const renderStaticHearts = () => {
      // Setup canvas dimensions
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Determine heart count based on screen size
      const isMobile = window.innerWidth < 768;
      const totalHearts = isMobile ? 15 : 35;

      // Seed-like generation to spread them nicely
      for (let i = 0; i < totalHearts; i++) {
        const size = Math.random() * 8 + 6; // soft small sizes
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const opacity = Math.random() * 0.15 + 0.05; // very soft and subtle
        const color = colors[Math.floor(Math.random() * colors.length)];

        drawHeart(ctx, x, y, size, opacity, color);
      }
    };

    // Render immediately
    renderStaticHearts();

    // Redraw only when screen size changes
    window.addEventListener("resize", renderStaticHearts);

    return () => {
      window.removeEventListener("resize", renderStaticHearts);
    };
  }, []);

  return (
    <canvas
      id="static-hearts-canvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
