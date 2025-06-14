export interface Vector2D {
  x: number;
  y: number;
}

export interface Particle {
  id: string;
  position: Vector2D;
  previousPosition: Vector2D;
  acceleration: Vector2D;
  velocity: Vector2D;
  mass: number;
  radius: number;
  color: string;
  type: ParticleType;
  trail: Vector2D[];
  life: number;
  maxLife: number;
}

export interface ForceField {
  position: Vector2D;
  strength: number;
  radius: number;
  type: 'attract' | 'repel' | 'orbital';
}

export type ParticleType = 'normal' | 'heavy' | 'light' | 'charged';

export interface PhysicsConfig {
  gravity: number;
  damping: number;
  interactionStrength: number;
  trailLength: number;
  mouseAttraction: number;
  particleCount: number;
  particleType: ParticleType;
}

export interface SimulationPreset {
  name: string;
  config: PhysicsConfig;
  description: string;
}