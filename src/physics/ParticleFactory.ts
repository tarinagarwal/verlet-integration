import { Particle, ParticleType, Vector2D } from '../types/physics';
import * as Vector from '../utils/vector';

export class ParticleFactory {
  private static idCounter = 0;

  static createParticle(
    position: Vector2D,
    type: ParticleType = 'normal',
    initialVelocity?: Vector2D
  ): Particle {
    const id = `particle_${this.idCounter++}`;
    const baseProps = this.getTypeProperties(type);
    
    const particle: Particle = {
      id,
      position: { ...position },
      previousPosition: initialVelocity 
        ? Vector.subtract(position, initialVelocity)
        : { ...position },
      acceleration: Vector.createVector(),
      velocity: initialVelocity || Vector.createVector(),
      trail: [],
      life: baseProps.maxLife,
      ...baseProps,
    };

    return particle;
  }

  static createRandomParticle(
    bounds: { width: number; height: number },
    type: ParticleType = 'normal'
  ): Particle {
    const position = Vector.createVector(
      Math.random() * bounds.width,
      Math.random() * bounds.height
    );
    
    const initialVelocity = Vector.createVector(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    );

    return this.createParticle(position, type, initialVelocity);
  }

  private static getTypeProperties(type: ParticleType) {
    switch (type) {
      case 'heavy':
        return {
          mass: 3,
          radius: 8,
          color: '#ff6b6b',
          type: 'heavy' as ParticleType,
          maxLife: -1, // Infinite life
        };
      case 'light':
        return {
          mass: 0.5,
          radius: 3,
          color: '#4ecdc4',
          type: 'light' as ParticleType,
          maxLife: 15, // 15 seconds
        };
      case 'charged':
        return {
          mass: 1.5,
          radius: 6,
          color: '#ffe66d',
          type: 'charged' as ParticleType,
          maxLife: -1,
        };
      default:
        return {
          mass: 1,
          radius: 5,
          color: '#a8e6cf',
          type: 'normal' as ParticleType,
          maxLife: -1,
        };
    }
  }

  static createExplosion(
    center: Vector2D,
    particleCount: number,
    type: ParticleType = 'light'
  ): Particle[] {
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 50 + Math.random() * 100;
      const velocity = Vector.createVector(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );
      
      const particle = this.createParticle(center, type, velocity);
      particles.push(particle);
    }
    
    return particles;
  }

  static createOrbitalSystem(
    center: Vector2D,
    particleCount: number,
    radius: number
  ): Particle[] {
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const position = Vector.createVector(
        center.x + Math.cos(angle) * radius,
        center.y + Math.sin(angle) * radius
      );
      
      // Calculate orbital velocity
      const orbitalSpeed = 50 + Math.random() * 30;
      const velocity = Vector.createVector(
        -Math.sin(angle) * orbitalSpeed,
        Math.cos(angle) * orbitalSpeed
      );
      
      const types: ParticleType[] = ['normal', 'heavy', 'light', 'charged'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const particle = this.createParticle(position, type, velocity);
      particles.push(particle);
    }
    
    return particles;
  }
}