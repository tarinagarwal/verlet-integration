import { useRef, useEffect, useState } from 'react';
import { VerletPhysics } from '../physics/VerletPhysics';
import { ParticleFactory } from '../physics/ParticleFactory';
import { PhysicsConfig, Particle, ForceField, SimulationPreset } from '../types/physics';
import * as Vector from '../utils/vector';

const defaultConfig: PhysicsConfig = {
  gravity: 0.1,
  damping: 0.02,
  interactionStrength: 0.5,
  trailLength: 30,
  mouseAttraction: 50,
  particleCount: 40,
  particleType: 'normal',
};

export const usePhysicsSimulation = (width: number, height: number) => {
  const physicsRef = useRef<VerletPhysics | null>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: width / 2, y: height / 2 });

  const [particles, setParticles] = useState<Particle[]>([]);
  const [forceFields, setForceFields] = useState<ForceField[]>([]);
  const [config, setConfig] = useState<PhysicsConfig>(defaultConfig);
  const [isRunning, setIsRunning] = useState(true);

  // Initialize physics engine
  useEffect(() => {
    physicsRef.current = new VerletPhysics(config, { width, height });
    
    // Create initial particles
    for (let i = 0; i < config.particleCount; i++) {
      const particle = ParticleFactory.createRandomParticle({ width, height }, config.particleType);
      physicsRef.current.addParticle(particle);
    }
  }, []);

  // Update bounds when canvas size changes
  useEffect(() => {
    if (physicsRef.current) {
      physicsRef.current.setBounds({ width, height });
    }
  }, [width, height]);

  // Animation loop
  useEffect(() => {
    const animate = (currentTime: number) => {
      if (!physicsRef.current || !isRunning) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Update mouse force field
      physicsRef.current.clearForceFields();
      if (config.mouseAttraction > 0) {
        physicsRef.current.addForceField({
          position: mousePositionRef.current,
          strength: config.mouseAttraction,
          radius: 200,
          type: 'attract',
        });
      }

      // Update physics
      physicsRef.current.update(deltaTime);

      // Update state for rendering
      setParticles([...physicsRef.current.getParticles()]);
      setForceFields([...physicsRef.current.getForceFields()]);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, config.mouseAttraction]);

  const updateConfig = (newConfig: Partial<PhysicsConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    
    if (physicsRef.current) {
      physicsRef.current.updateConfig(updatedConfig);
    }
  };

  const updateMousePosition = (x: number, y: number) => {
    mousePositionRef.current = { x, y };
  };

  const addExplosion = () => {
    if (!physicsRef.current) return;
    
    const center = mousePositionRef.current;
    const explosionParticles = ParticleFactory.createExplosion(center, 20, 'light');
    
    explosionParticles.forEach(particle => {
      physicsRef.current!.addParticle(particle);
    });
  };

  const addOrbitalSystem = () => {
    if (!physicsRef.current) return;
    
    const center = mousePositionRef.current;
    const orbitalParticles = ParticleFactory.createOrbitalSystem(center, 12, 80);
    
    orbitalParticles.forEach(particle => {
      physicsRef.current!.addParticle(particle);
    });
  };

  const reset = () => {
    if (!physicsRef.current) return;
    
    // Clear existing particles
    physicsRef.current = new VerletPhysics(config, { width, height });
    
    // Create new particles
    for (let i = 0; i < config.particleCount; i++) {
      const particle = ParticleFactory.createRandomParticle({ width, height }, config.particleType);
      physicsRef.current.addParticle(particle);
    }
  };

  const loadPreset = (preset: SimulationPreset) => {
    updateConfig(preset.config);
    reset();
  };

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  return {
    particles,
    forceFields,
    config,
    isRunning,
    updateConfig,
    updateMousePosition,
    addExplosion,
    addOrbitalSystem,
    reset,
    loadPreset,
    toggleSimulation,
  };
};