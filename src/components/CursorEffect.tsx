import { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  size: number;
  life: number;
  el: HTMLDivElement | null;
  color: string;
}

const CursorSparkEffect = () => {
  const sparks = useRef<Spark[]>([]);

  useEffect(() => {
    const colors = ["#ff3cac", "#784ba0", "#00f0ff", "#f9f586", "#ff5f6d"];
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const spark: Spark = {
        x: mouseX,
        y: mouseY,
        size: Math.random() * 6 + 4,
        life: 1,
        el: document.createElement("div"),
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      if (spark.el) {
        spark.el.style.position = "absolute";
        spark.el.style.left = `${spark.x}px`;
        spark.el.style.top = `${spark.y}px`;
        spark.el.style.width = `${spark.size}px`;
        spark.el.style.height = `${spark.size}px`;
        spark.el.style.backgroundColor = spark.color;
        spark.el.style.borderRadius = "50%";
        spark.el.style.pointerEvents = "none";
        spark.el.style.opacity = "1";
        spark.el.style.filter = "blur(3px)";
        spark.el.style.transition = "transform 0.2s, opacity 0.3s";
        document.body.appendChild(spark.el);
      }

      sparks.current.push(spark);

      if (sparks.current.length > 50) {
        const old = sparks.current.shift();
        if (old && old.el) old.el.remove();
      }
    };

    const animate = () => {
      sparks.current.forEach((s) => {
        s.life -= 0.03;
        if (s.el) {
          s.el.style.opacity = `${s.life}`;
          // Only small random offset relative to current position
          s.el.style.transform = `translate3d(${(Math.random() - 0.5) * 6}px, ${
            (Math.random() - 0.5) * 6
          }px, 0)`;
        }
      });

      sparks.current = sparks.current.filter((s) => s.life > 0);
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    requestAnimationFrame(animate);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return null; // System cursor visible
};

export default CursorSparkEffect;
