import { useEffect, useRef, useCallback } from "react";

export function SparkCursor() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: -100, y: -100 });
  const animFrame = useRef(null);
  const trailPoints = useRef([]);

  const colors = [
    "#A78BFA", "#C084FC", "#E879F9", "#F472B6",
    "#FB923C", "#FBBF24", "#34D399", "#60A5FA",
    "#818CF8", "#F9A8D4"
  ];

  const createParticle = useCallback((x, y, isClick = false) => {
    const count = isClick ? 18 : 1;
    for (let i = 0; i < count; i++) {
      const angle = isClick
        ? (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
        : Math.random() * Math.PI * 2;
      const speed = isClick
        ? 2 + Math.random() * 4
        : 0.5 + Math.random() * 1.5;
      const size = isClick
        ? 2 + Math.random() * 4
        : 1.5 + Math.random() * 2.5;

      particles.current.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isClick ? 1 : 0.5),
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: isClick ? 0.015 + Math.random() * 0.01 : 0.02 + Math.random() * 0.015,
        gravity: 0.04 + Math.random() * 0.03,
        isClick,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        type: Math.random() > 0.5 ? "star" : "circle",
      });
    }
  }, []);

  const drawStar = useCallback((ctx, x, y, size, rotation) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI / 2) * i;
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
    }
    ctx.stroke();
    ctx.restore();
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw trailing glow behind cursor
    const tp = trailPoints.current;
    if (tp.length > 1) {
      for (let i = 1; i < tp.length; i++) {
        const alpha = (i / tp.length) * 0.3;
        const size = (i / tp.length) * 6;
        ctx.beginPath();
        ctx.arc(tp[i].x, tp[i].y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
        ctx.fill();
      }
    }

    // Draw a soft glow at cursor position
    const grd = ctx.createRadialGradient(
      mouse.current.x, mouse.current.y, 0,
      mouse.current.x, mouse.current.y, 60
    );
    grd.addColorStop(0, "rgba(167, 139, 250, 0.08)");
    grd.addColorStop(0.5, "rgba(236, 72, 153, 0.04)");
    grd.addColorStop(1, "rgba(167, 139, 250, 0)");
    ctx.fillStyle = grd;
    ctx.fillRect(
      mouse.current.x - 60,
      mouse.current.y - 60,
      120, 120
    );

    // Update and draw particles
    particles.current = particles.current.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.life -= p.decay;
      p.rotation += p.rotationSpeed;

      if (p.life <= 0) return false;

      const alpha = p.life;
      const currentSize = p.size * (0.5 + p.life * 0.5);

      if (p.type === "star") {
        ctx.strokeStyle = p.color.replace(")", `, ${alpha})`).replace("rgb", "rgba").replace("#", "");
        // Convert hex to rgba for the star stroke
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = p.color;
        drawStar(ctx, p.x, p.y, currentSize, p.rotation);
        ctx.globalAlpha = 1;
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 2, 0, Math.PI * 2);
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      return true;
    });

    animFrame.current = requestAnimationFrame(animate);
  }, [drawStar]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let throttleTimer = 0;

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Trail
      trailPoints.current.push({ x: e.clientX, y: e.clientY });
      if (trailPoints.current.length > 12) {
        trailPoints.current.shift();
      }

      // Throttle particle creation
      const now = Date.now();
      if (now - throttleTimer > 30) {
        throttleTimer = now;
        createParticle(e.clientX, e.clientY);
      }
    };

    const handleClick = (e) => {
      createParticle(e.clientX, e.clientY, true);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    handleResize();
    animFrame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      if (animFrame.current) {
        cancelAnimationFrame(animFrame.current);
      }
    };
  }, [animate, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
