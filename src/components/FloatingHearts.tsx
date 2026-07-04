import { useEffect, useRef } from "react";

interface Heart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  wiggleSpeed: number;
  wiggleWidth: number;
  wigglePhase: number;
  color: string;
}

export default function FloatingHearts() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let hearts: Heart[] = [];
    const colors = [
      "rgba(244, 63, 94, ", // rose
      "rgba(251, 113, 133, ", // light rose
      "rgba(253, 164, 175, ", // pale pink
      "rgba(225, 29, 72, ", // crimson
      "rgba(253, 186, 116, ", // peach
    ];

    // Optimize performance on mobile devices
    const isMobile = window.innerWidth < 768;
    const initialHeartCount = isMobile ? 12 : 30;
    const maxHeartsCount = isMobile ? 18 : 50;
    const spawnChance = isMobile ? 0.03 : 0.08;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Helper to draw a bezier heart
    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      opacity: number,
      colorPrefix: string
    ) => {
      context.beginPath();
      // Draw heart path
      // Start from top cleft
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

    const createHeart = (initialBottom = false): Heart => {
      const size = Math.random() * 10 + 6; // random size between 6px and 16px
      return {
        x: Math.random() * canvas.width,
        y: initialBottom ? canvas.height + 20 : Math.random() * canvas.height,
        size,
        speedY: -(Math.random() * 0.5 + 0.3), // slow upward motion
        speedX: (Math.random() - 0.5) * 0.1, // tiny default horizontal drift
        opacity: Math.random() * 0.35 + 0.1, // faint, soft transparency
        wiggleSpeed: Math.random() * 0.015 + 0.005,
        wiggleWidth: Math.random() * 15 + 5,
        wigglePhase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    // Initialize with some hearts spread across the screen
    for (let i = 0; i < initialHeartCount; i++) {
      hearts.push(createHeart(false));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn a new heart occasionally
      if (hearts.length < maxHeartsCount && Math.random() < spawnChance) {
        hearts.push(createHeart(true));
      }

      hearts.forEach((heart, idx) => {
        // Move upward
        heart.y += heart.speedY;
        
        // Sway gently side to side using sine wave
        heart.wigglePhase += heart.wiggleSpeed;
        const drift = Math.sin(heart.wigglePhase) * heart.wiggleWidth * 0.03;
        heart.x += heart.speedX + drift;

        // Fade out as it reaches the top
        let finalOpacity = heart.opacity;
        if (heart.y < 100) {
          finalOpacity = heart.opacity * (heart.y / 100);
        }

        // Draw heart
        drawHeart(ctx, heart.x, heart.y, heart.size, finalOpacity, heart.color);

        // Recycle hearts that go off screen
        if (heart.y < -20 || heart.x < -20 || heart.x > canvas.width + 20) {
          hearts[idx] = createHeart(true);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="floating-hearts-canvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
