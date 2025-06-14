import React, { useRef, useEffect } from 'react';
import { Particle, ForceField } from '../types/physics';
import * as Vector from '../utils/vector';

interface ParticleRendererProps {
  particles: Particle[];
  forceFields: ForceField[];
  width: number;
  height: number;
  showTrails: boolean;
  showForceFields: boolean;
}

export const ParticleRenderer: React.FC<ParticleRendererProps> = ({
  particles,
  forceFields,
  width,
  height,
  showTrails,
  showForceFields,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with fade effect for trails
    ctx.fillStyle = 'rgba(26, 0, 51, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Render force fields
    if (showForceFields) {
      renderForceFields(ctx, forceFields);
    }

    // Render particle trails
    if (showTrails) {
      renderTrails(ctx, particles);
    }

    // Render particles
    renderParticles(ctx, particles);

  }, [particles, forceFields, width, height, showTrails, showForceFields]);

  const renderParticles = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    particles.forEach(particle => {
      const velocity = Vector.magnitude(particle.velocity);
      const alpha = particle.maxLife > 0 ? particle.life / particle.maxLife : 1;
      
      // Create glow effect
      const gradient = ctx.createRadialGradient(
        particle.position.x, particle.position.y, 0,
        particle.position.x, particle.position.y, particle.radius * 3
      );
      
      // Color based on velocity
      const hue = (velocity * 2) % 360;
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, ${alpha})`);
      gradient.addColorStop(0.5, `hsla(${hue}, 70%, 40%, ${alpha * 0.6})`);
      gradient.addColorStop(1, `hsla(${hue}, 70%, 20%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(
        particle.position.x,
        particle.position.y,
        particle.radius * 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Core particle
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(
        particle.position.x,
        particle.position.y,
        particle.radius,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  };

  const renderTrails = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    particles.forEach(particle => {
      if (particle.trail.length < 2) return;
      
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      
      ctx.beginPath();
      ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
      
      for (let i = 1; i < particle.trail.length; i++) {
        const alpha = i / particle.trail.length;
        ctx.globalAlpha = alpha * 0.5;
        ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
      }
      
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
  };

  const renderForceFields = (ctx: CanvasRenderingContext2D, fields: ForceField[]) => {
    fields.forEach(field => {
      // Field boundary
      ctx.strokeStyle = field.type === 'attract' ? '#4ade80' : 
                       field.type === 'repel' ? '#f87171' : '#fbbf24';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3;
      
      ctx.beginPath();
      ctx.arc(field.position.x, field.position.y, field.radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Field center
      ctx.fillStyle = ctx.strokeStyle;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(field.position.x, field.position.y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.globalAlpha = 1;
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #1a0033 0%, #000611 100%)',
      }}
    />
  );
};