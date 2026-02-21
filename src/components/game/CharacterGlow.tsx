
"use client";

import { useEffect, useRef } from "react";

interface CharacterGlowProps {
  characterSlug: string;
  colorGlow: string;
  isActive: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
  rotation?: number;
  rotationSpeed?: number;
  opacityNoise?: number; // Variación aleatoria de opacidad
  sizeNoise?: number;    // Variación aleatoria de tamaño
  beamLength?: number;   // Longitud del haz de luz (para Ruth)
  beamWidth?: number;    // Grosor del haz de luz
}

export default function CharacterGlow({ characterSlug, colorGlow, isActive }: CharacterGlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowPulseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    const GLOBAL_GLOW_INTENSITY = 0.65;
    const GLOBAL_GLOW_SPREAD = 0.25;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Character-specific particle configurations
    const getParticleConfig = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      switch (characterSlug) {
        case "el-juez": // Dark fire with sharp triangular particles
          return {
            count: 18,
            colors: ["#6B0000", "#8B0000", "#2F0000", "#1a1a1a"],
            glowIntensity: 0.5,
            pulseFrequency: 0.05,
            pulseAmplitude: 0.25,
            createParticle: (): Particle => {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * 80 + 120;
              return {
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                size: Math.random() * 2 + 0.6,
                speedX: Math.cos(angle) * (Math.random() * 0.5 + 0.15),
                speedY: Math.sin(angle) * (Math.random() * 0.5 + 0.15) - 0.3,
                opacity: Math.random() * 0.25 + 0.08,
                life: 0,
                maxLife: Math.random() * 70 + 35,
                color: ["#6B0000", "#8B0000", "#2F0000", "#1a1a1a"][Math.floor(Math.random() * 4)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.06,
                opacityNoise: Math.random() * 0.3 + 0.7, // 0.7-1.0 variación
                sizeNoise: Math.random() * 0.2 + 0.9,    // 0.9-1.1 variación
              };
            },
            drawParticle: (p: Particle) => {
              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate(p.rotation || 0);
              
              // Draw sharp triangle
              ctx.beginPath();
              const sizeVariation = p.size * (p.sizeNoise || 1);
              ctx.moveTo(0, -sizeVariation * 2);
              ctx.lineTo(sizeVariation * 1.5, sizeVariation);
              ctx.lineTo(-sizeVariation * 1.5, sizeVariation);
              ctx.closePath();
              
              const lifeFactor = 1 - p.life / p.maxLife;
              const opacityVariation = p.opacity * (p.opacityNoise || 1);
              const alpha = Math.floor(opacityVariation * lifeFactor * GLOBAL_GLOW_INTENSITY * 255).toString(16).padStart(2, '0');
              ctx.fillStyle = `${p.color}${alpha}`;
              ctx.fill();
              
              ctx.restore();
            },
          };

        case "la-doncella": // Soft pink glow
          return {
            count: 12,
            colors: ["#FFB6C1", "#FFC0CB", "#FFE4E1"],
            glowIntensity: 0.08,
            pulseFrequency: 0.018,
            pulseAmplitude: 0.12,
            createParticle: (): Particle => {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * 90 + 110;
              return {
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                size: Math.random() * 1.2 + 0.3,
                speedX: Math.cos(angle) * 0.12,
                speedY: Math.sin(angle) * 0.12,
                opacity: Math.random() * 0.18 + 0.05,
                life: 0,
                maxLife: Math.random() * 110 + 70,
                color: ["#FFB6C1", "#FFC0CB", "#FFE4E1"][Math.floor(Math.random() * 3)],
                opacityNoise: Math.random() * 0.3 + 0.7,
                sizeNoise: Math.random() * 0.2 + 0.9,
              };
            },
          };

        case "el-escudero": // Green sparkles
          return {
            count: 20,
            colors: ["#4CAF50", "#66BB6A", "#81C784"],
            glowIntensity: 0.14,
            pulseFrequency: 0.022,
            pulseAmplitude: 0.18,
            createParticle: (): Particle => {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * 85 + 115;
              return {
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                size: Math.random() * 1.5 + 0.5,
                speedX: Math.cos(angle) * (Math.random() * 0.35 + 0.12),
                speedY: Math.sin(angle) * (Math.random() * 0.35 + 0.12) - 0.2,
                opacity: Math.random() * 0.4 + 0.15,
                life: 0,
                maxLife: Math.random() * 90 + 55,
                color: ["#4CAF50", "#66BB6A", "#81C784"][Math.floor(Math.random() * 3)],
                opacityNoise: Math.random() * 0.3 + 0.7,
                sizeNoise: Math.random() * 0.2 + 0.9,
              };
            },
            drawParticle: (p: Particle) => {
              // Draw sparkle (4-pointed star)
              ctx.save();
              ctx.translate(p.x, p.y);
              
              const lifeFactor = 1 - p.life / p.maxLife;
              const opacityVariation = p.opacity * (p.opacityNoise || 1);
              const alpha = Math.floor(opacityVariation * lifeFactor * GLOBAL_GLOW_INTENSITY * 255).toString(16).padStart(2, '0');
              
              const sizeVariation = p.size * (p.sizeNoise || 1);
              ctx.beginPath();
              for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI) / 2;
                const x = Math.cos(angle) * sizeVariation * 2;
                const y = Math.sin(angle) * sizeVariation * 2;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              
              ctx.fillStyle = `${p.color}${alpha}`;
              ctx.fill();
              
              ctx.restore();
            },
          };

        case "el-perro": // Thin thread-like particles
          return {
            count: 12,
            colors: ["#8B4513", "#A0522D", "#654321"],
            glowIntensity: 0.09,
            pulseFrequency: 0.016,
            pulseAmplitude: 0.11,
            createParticle: (): Particle => {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * 75 + 100;
              return {
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                size: Math.random() * 0.5 + 0.2,
                speedX: Math.cos(angle) * 0.3,
                speedY: Math.sin(angle) * 0.3 - 0.15,
                opacity: Math.random() * 0.2 + 0.05,
                life: 0,
                maxLife: Math.random() * 80 + 45,
                color: ["#8B4513", "#A0522D", "#654321"][Math.floor(Math.random() * 3)],
                opacityNoise: Math.random() * 0.3 + 0.7,
                sizeNoise: Math.random() * 0.2 + 0.9,
              };
            },
            drawParticle: (p: Particle) => {
              // Draw thin line/thread
              const lifeFactor = 1 - p.life / p.maxLife;
              const opacityVariation = p.opacity * (p.opacityNoise || 1);
              const alpha = Math.floor(opacityVariation * lifeFactor * GLOBAL_GLOW_INTENSITY * 255).toString(16).padStart(2, '0');
              
              const sizeVariation = p.size * (p.sizeNoise || 1);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p.x + p.speedX * 5, p.y + p.speedY * 5);
              ctx.strokeStyle = `${p.color}${alpha}`;
              ctx.lineWidth = sizeVariation * 0.35;
              ctx.stroke();
            },
          };

        case "el-hechicero": // Pale yellow-blue mystical energy
          return {
            count: 22,
            colors: ["#E6D68A", "#B8D4E8", "#D4C89A", "#A8C8E0"],
            glowIntensity: 0.13,
            pulseFrequency: 0.02,
            pulseAmplitude: 0.15,
            createParticle: (): Particle => {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * 88 + 112;
              return {
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                size: Math.random() * 1.4 + 0.35,
                speedX: Math.sin(angle + Math.random()) * 0.3,
                speedY: Math.cos(angle + Math.random()) * 0.3,
                opacity: Math.random() * 0.3 + 0.1,
                life: 0,
                maxLife: Math.random() * 100 + 70,
                color: ["#E6D68A", "#B8D4E8", "#D4C89A", "#A8C8E0"][Math.floor(Math.random() * 4)],
                opacityNoise: Math.random() * 0.3 + 0.7,
                sizeNoise: Math.random() * 0.2 + 0.9,
              };
            },
          };

        case "el-viejo-manto-blanco": // Pale ghostly mist
          return {
            count: 14,
            colors: ["#D3D3D3", "#E8E8E8", "#C0C0C0", "#F5F5F5"],
            glowIntensity: 0.08,
            pulseFrequency: 0.012,
            pulseAmplitude: 0.1,
            createParticle: (): Particle => {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * 80 + 105;
              return {
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                size: Math.random() * 2 + 0.6,
                speedX: Math.cos(angle) * 0.2,
                speedY: Math.sin(angle) * 0.2 - 0.12,
                opacity: Math.random() * 0.12 + 0.03,
                life: 0,
                maxLife: Math.random() * 95 + 65,
                color: ["#D3D3D3", "#E8E8E8", "#C0C0C0", "#F5F5F5"][Math.floor(Math.random() * 4)],
                opacityNoise: Math.random() * 0.3 + 0.7,
                sizeNoise: Math.random() * 0.2 + 0.9,
              };
            },
          };

        case "ruth": // Iridescent arcane energy with light beams
          return {
            count: 85,
            colors: [
              "#D8BFD8", "#E6E6FA", "#FFE4F0", // Púrpuras y magentas pálidos
              "#E0F7FA", "#B0E0E6", "#E6E6FA", // Cianes y azules pálidos
              "#F0E6FF", "#F5E6FF", "#FAF0FF", // Lilas muy claros
              "#FFE4F1", "#F0D9FF", "#F5E6FF"  // Rosas y violetas pálidos
            ],
            glowIntensity: 0.15,
            pulseFrequency: 0.025,
            pulseAmplitude: 0.18,
            createParticle: (): Particle => {
              const angle = Math.random() * Math.PI * 2;
              const isBeam = Math.random() < 0.25; // 25% son haces de luz
              
              if (isBeam) {
                // Haz de luz radial - escalado para canvas grande
                const distance = Math.random() * 15 + 25; // Más cerca del centro
                return {
                  x: centerX + Math.cos(angle) * distance,
                  y: centerY + Math.sin(angle) * distance,
                  size: Math.random() * 2 + 1, // Ancho base
                  speedX: Math.cos(angle) * 1.2,
                  speedY: Math.sin(angle) * 1.2,
                  opacity: Math.random() * 0.12 + 0.04,
                  life: 0,
                  maxLife: Math.random() * 60 + 40,
                  color: [
                    "#D8BFD8", "#E6E6FA", "#fcc5de",
                    "#E0F7FA", "#97f3ff", "#c9b3eb",
                    "#c3ffe1", "#89ffe5", "#e0fffd"
                  ][Math.floor(Math.random() * 9)],
                  opacityNoise: Math.random() * 0.4 + 0.7,
                  sizeNoise: Math.random() * 0.3 + 0.85,
                  rotation: angle,
                  beamLength: Math.random() * 10 + 15, // Mucho más largo
                  beamWidth: Math.random() < 0.3 ? Math.random() * 1.5 + 0.8 : Math.random() * 6 + 2.5, // Más grueso
                };
              } else {
                // Partícula normal
                const distance = Math.random() * 92 + 118;
                return {
                  x: centerX + Math.cos(angle) * distance,
                  y: centerY + Math.sin(angle) * distance,
                  size: Math.random() * 0.8 + 0.2,
                  speedX: Math.cos(angle) * 0.35,
                  speedY: Math.sin(angle) * 0.35,
                  opacity: Math.random() * 0.08 + 0.02,
                  life: 0,
                  maxLife: Math.random() * 110 + 80,
                  color: [
                    "#D8BFD8", "#E6E6FA", "#FFE4F0",
                    "#E0F7FA", "#B0E0E6", "#E6E6FA",
                    "#F0E6FF", "#F5E6FF", "#FAF0FF",
                    "#FFE4F1", "#F0D9FF", "#F5E6FF"
                  ][Math.floor(Math.random() * 12)],
                  opacityNoise: Math.random() * 0.4 + 0.6,
                  sizeNoise: Math.random() * 0.3 + 0.85,
                };
              }
            },
            drawParticle: (p: Particle) => {
              const lifeFactor = 1 - p.life / p.maxLife;
              const opacityVariation = p.opacity * (p.opacityNoise || 1);
              const currentOpacity = opacityVariation * lifeFactor * GLOBAL_GLOW_INTENSITY;
              
              if (p.beamLength !== undefined && p.rotation !== undefined) {
                // Dibujar haz de luz como partícula estirada
                const width = (p.beamWidth || 1) * (p.sizeNoise || 1); // Usar beamWidth con variación
                const length = p.beamLength * lifeFactor * 40; // Mucho más largo
                
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                
                // Crear gradiente lineal para el haz con saturación
                const beamGradient = ctx.createLinearGradient(0, 0, length, 0);
                const maxOpacity = Math.floor(Math.min(255, currentOpacity * 255 * 1.872));
                beamGradient.addColorStop(0, `${p.color}${maxOpacity.toString(16).padStart(2, '0')}`);
                beamGradient.addColorStop(0.6, `${p.color}${Math.floor(maxOpacity * 0.7).toString(16).padStart(2, '0')}`);
                beamGradient.addColorStop(1, `${p.color}00`);
                
                ctx.fillStyle = beamGradient;
                
                // Dibujar rectángulo estirado
                ctx.fillRect(-width / 2, -width / 2, length, width);
                
                ctx.restore();
              } else {
                // Dibujar partícula circular normal con saturación
                const sizeVariation = p.size * (p.sizeNoise || 1);
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, sizeVariation, 0, Math.PI * 2);
                
                const particleGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sizeVariation * 2);
                particleGradient.addColorStop(0, `${p.color}${Math.floor(Math.min(255, currentOpacity * 255 * 1.872)).toString(16).padStart(2, '0')}`);
                particleGradient.addColorStop(1, `${p.color}00`);
                
                ctx.fillStyle = particleGradient;
                ctx.fill();
              }
            },
          };

        default: // Generic glow
          return {
            count: 10,
            colors: [colorGlow || "#ffffff"],
            glowIntensity: 0.11,
            pulseFrequency: 0.018,
            pulseAmplitude: 0.12,
            createParticle: (): Particle => {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * 80 + 110;
              return {
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                size: Math.random() * 1.2 + 0.3,
                speedX: Math.cos(angle) * 0.2,
                speedY: Math.sin(angle) * 0.2,
                opacity: Math.random() * 0.25 + 0.08,
                life: 0,
                maxLife: Math.random() * 75 + 55,
                color: colorGlow || "#ffffff",
                opacityNoise: Math.random() * 0.3 + 0.7,
                sizeNoise: Math.random() * 0.2 + 0.9,
              };
            },
          };
      }
    };

    const config = getParticleConfig();

    // Initialize particles
    for (let i = 0; i < config.count; i++) {
      particles.push(config.createParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(GLOBAL_GLOW_SPREAD, GLOBAL_GLOW_SPREAD);
      ctx.translate(-centerX, -centerY);

      // Update glow pulse
      glowPulseRef.current += config.pulseFrequency || 0.018;

      let pulseFactor: number;
      if (characterSlug === "el-juez") {
        const cycle = (glowPulseRef.current % (Math.PI * 2)) / (Math.PI * 2); // 0..1
        const beat1 = Math.exp(-Math.pow((cycle - 0.14) / 0.05, 2));
        const beat2 = 0.72 * Math.exp(-Math.pow((cycle - 0.25) / 0.04, 2));
        const heartbeat = Math.min(1, beat1 + beat2);
        pulseFactor = 0.38 + heartbeat * 0.62;
      } else {
        const pulseValue = Math.sin(glowPulseRef.current);
        pulseFactor = 0.5 + (pulseValue * 0.5);
      }

      // No background glow - solo partículas
      // El contorno del personaje se maneja con CSS drop-shadow en la imagen PNG

      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;
        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed;
        }

        // Reset particle when it dies or goes off screen
        if (p.life >= p.maxLife || p.y < -20 || p.x < -20 || p.x > canvas.width + 20 || p.y > canvas.height + 20) {
          particles[i] = config.createParticle();
          return;
        }

        // Draw particle
        if (config.drawParticle) {
          config.drawParticle(p);
        } else {
          // Default circular particle
          const lifeFactor = 1 - p.life / p.maxLife;
          const opacityVariation = p.opacity * (p.opacityNoise || 1);
          const currentOpacity = opacityVariation * lifeFactor * GLOBAL_GLOW_INTENSITY;
          const sizeVariation = p.size * (p.sizeNoise || 1);

          ctx.beginPath();
          ctx.arc(p.x, p.y, sizeVariation, 0, Math.PI * 2);
          
          const particleGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sizeVariation * 2);
          particleGradient.addColorStop(0, `${p.color}${Math.floor(currentOpacity * 255).toString(16).padStart(2, '0')}`);
          particleGradient.addColorStop(1, `${p.color}00`);
          
          ctx.fillStyle = particleGradient;
          ctx.fill();
        }
      });

      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    if (isActive) {
      animate();
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [characterSlug, colorGlow, isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none"
      style={{
        mixBlendMode: "screen",
        left: "50%",
        top: "50%",
        width: "170%",
        height: "170%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
