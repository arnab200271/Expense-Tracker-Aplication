"use client";
import React, { useEffect, useRef } from "react";

const Coinanimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return; 

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const coins = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 2,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      glow: Math.random() * 20 + 30,
      alpha: Math.random() * 0.5 + 0.3,
    }));

    const drawCoins = () => {
    
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      for (const coin of coins) {
        const gradient = ctx.createRadialGradient(
          coin.x,
          coin.y,
          0,
          coin.x,
          coin.y,
          coin.radius * 4
        );
        gradient.addColorStop(0, `rgba(255, 223, 0, ${coin.alpha})`);
        gradient.addColorStop(0.6, `rgba(255, 200, 0, ${coin.alpha * 0.8})`);
        gradient.addColorStop(1, "rgba(255, 200, 0, 0)");

        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.shadowBlur = coin.glow;
        ctx.shadowColor = "gold";
        ctx.fill();
        ctx.closePath();

        coin.x += coin.dx;
        coin.y += coin.dy;

        if (coin.x < -50) coin.x = width + 50;
        if (coin.x > width + 50) coin.x = -50;
        if (coin.y < -50) coin.y = height + 50;
        if (coin.y > height + 50) coin.y = -50;
      }

      requestAnimationFrame(drawCoins);
    };

    drawCoins();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default Coinanimation;
