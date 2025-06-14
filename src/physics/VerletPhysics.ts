import { Particle, Vector2D, PhysicsConfig, ForceField } from '../types/physics';
import * as Vector from '../utils/vector';

export class VerletPhysics {
  private particles: Particle[] = [];
  private forceFields: ForceField[] = [];
  private config: PhysicsConfig;
  private bounds: { width: number; height: number };

  constructor(config: PhysicsConfig, bounds: { width: number; height: number }) {
    this.config = config;
    this.bounds = bounds;
  }

  addParticle(particle: Particle): void {
    this.particles.push(particle);
  }

  removeParticle(id: string): void {
    this.particles = this.particles.filter(p => p.id !== id);
  }

  addForceField(field: ForceField): void {
    this.forceFields.push(field);
  }

  clearForceFields(): void {
    this.forceFields = [];
  }

  updateConfig(config: Partial<PhysicsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  update(deltaTime: number): void {
    const dt = Math.min(deltaTime, 16) / 1000; // Cap at 16ms for stability

    // Clear accelerations
    this.particles.forEach(particle => {
      particle.acceleration = Vector.createVector();
    });

    // Apply forces
    this.applyGlobalForces();
    this.applyForceFields();
    this.applyInterParticleForces();

    // Verlet integration
    this.particles.forEach(particle => {
      this.integrateParticle(particle, dt);
      this.updateParticleTrail(particle);
      this.handleBoundaryCollisions(particle);
      this.updateParticleLife(particle, dt);
    });

    // Remove dead particles
    this.particles = this.particles.filter(p => p.life > 0);
  }

  private integrateParticle(particle: Particle, dt: number): void {
    // Verlet integration: x(t+dt) = 2*x(t) - x(t-dt) + a(t)*dt²
    const newPosition = Vector.add(
      Vector.subtract(
        Vector.multiply(particle.position, 2),
        particle.previousPosition
      ),
      Vector.multiply(particle.acceleration, dt * dt)
    );

    // Update velocity for visualization (not used in integration)
    particle.velocity = Vector.divide(
      Vector.subtract(newPosition, particle.position),
      dt
    );

    // Apply damping
    if (this.config.damping > 0) {
      const dampingForce = Vector.multiply(particle.velocity, -this.config.damping);
      newPosition.x += dampingForce.x * dt * dt;
      newPosition.y += dampingForce.y * dt * dt;
    }

    particle.previousPosition = { ...particle.position };
    particle.position = newPosition;
  }

  private applyGlobalForces(): void {
    if (this.config.gravity === 0) return;

    this.particles.forEach(particle => {
      particle.acceleration.y += this.config.gravity * 100; // Scale for visibility
    });
  }

  private applyForceFields(): void {
    this.forceFields.forEach(field => {
      this.particles.forEach(particle => {
        const direction = Vector.subtract(field.position, particle.position);
        const distance = Vector.magnitude(direction);
        
        if (distance < field.radius && distance > 0) {
          const normalizedDirection = Vector.normalize(direction);
          let forceStrength = field.strength * (1 - distance / field.radius);
          
          if (field.type === 'repel') {
            forceStrength *= -1;
          } else if (field.type === 'orbital') {
            // Create orbital motion by adding perpendicular force
            const perpendicular = Vector.rotate(normalizedDirection, Math.PI / 2);
            const orbitalForce = Vector.multiply(perpendicular, forceStrength * 0.5);
            particle.acceleration = Vector.add(particle.acceleration, orbitalForce);
            forceStrength *= 0.3; // Reduce direct attraction for orbital effect
          }
          
          const force = Vector.multiply(normalizedDirection, forceStrength);
          particle.acceleration = Vector.add(particle.acceleration, force);
        }
      });
    });
  }

  private applyInterParticleForces(): void {
    if (this.config.interactionStrength === 0) return;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        
        const direction = Vector.subtract(p2.position, p1.position);
        const distance = Vector.magnitude(direction);
        
        if (distance > 0 && distance < 200) {
          const normalizedDirection = Vector.normalize(direction);
          const forceStrength = this.config.interactionStrength * 
            (p1.mass * p2.mass) / (distance * distance + 100); // Add small constant to prevent division by zero
          
          const force = Vector.multiply(normalizedDirection, forceStrength);
          
          // Apply equal and opposite forces
          p1.acceleration = Vector.add(p1.acceleration, force);
          p2.acceleration = Vector.subtract(p2.acceleration, force);
        }
      }
    }
  }

  private updateParticleTrail(particle: Particle): void {
    particle.trail.push({ ...particle.position });
    
    if (particle.trail.length > this.config.trailLength) {
      particle.trail.shift();
    }
  }

  private handleBoundaryCollisions(particle: Particle): void {
    const bounce = 0.8; // Coefficient of restitution
    
    if (particle.position.x < particle.radius) {
      particle.position.x = particle.radius;
      particle.previousPosition.x = particle.position.x + (particle.position.x - particle.previousPosition.x) * bounce;
    } else if (particle.position.x > this.bounds.width - particle.radius) {
      particle.position.x = this.bounds.width - particle.radius;
      particle.previousPosition.x = particle.position.x + (particle.position.x - particle.previousPosition.x) * bounce;
    }
    
    if (particle.position.y < particle.radius) {
      particle.position.y = particle.radius;
      particle.previousPosition.y = particle.position.y + (particle.position.y - particle.previousPosition.y) * bounce;
    } else if (particle.position.y > this.bounds.height - particle.radius) {
      particle.position.y = this.bounds.height - particle.radius;
      particle.previousPosition.y = particle.position.y + (particle.position.y - particle.previousPosition.y) * bounce;
    }
  }

  private updateParticleLife(particle: Particle, dt: number): void {
    if (particle.maxLife > 0) {
      particle.life -= dt;
    }
  }

  getParticles(): Particle[] {
    return this.particles;
  }

  getForceFields(): ForceField[] {
    return this.forceFields;
  }

  setBounds(bounds: { width: number; height: number }): void {
    this.bounds = bounds;
  }
}