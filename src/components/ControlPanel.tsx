import React, { useState } from 'react';
import { PhysicsConfig, ParticleType, SimulationPreset } from '../types/physics';
import { Play, Pause, RotateCcw, Settings, Zap, Target, Orbit, X, Menu } from 'lucide-react';

interface ControlPanelProps {
  config: PhysicsConfig;
  onConfigChange: (config: Partial<PhysicsConfig>) => void;
  isRunning: boolean;
  onToggleSimulation: () => void;
  onReset: () => void;
  onAddExplosion: () => void;
  onAddOrbitalSystem: () => void;
  onLoadPreset: (preset: SimulationPreset) => void;
  showTrails: boolean;
  onToggleTrails: () => void;
  showForceFields: boolean;
  onToggleForceFields: () => void;
}

const presets: SimulationPreset[] = [
  {
    name: 'Gravitational Dance',
    description: 'Particles attracted to touch with orbital motion',
    config: {
      gravity: 0.1,
      damping: 0.02,
      interactionStrength: 0.5,
      trailLength: 30,
      mouseAttraction: 50,
      particleCount: 40,
      particleType: 'normal',
    },
  },
  {
    name: 'Cosmic Storm',
    description: 'High-energy particles with strong interactions',
    config: {
      gravity: 0,
      damping: 0.001,
      interactionStrength: 2,
      trailLength: 50,
      mouseAttraction: 100,
      particleCount: 60,
      particleType: 'charged',
    },
  },
  {
    name: 'Gentle Flow',
    description: 'Smooth, flowing particle motion',
    config: {
      gravity: 0.05,
      damping: 0.05,
      interactionStrength: 0.2,
      trailLength: 60,
      mouseAttraction: 30,
      particleCount: 80,
      particleType: 'light',
    },
  },
  {
    name: 'Heavy Matter',
    description: 'Dense particles with strong gravitational effects',
    config: {
      gravity: 0.2,
      damping: 0.01,
      interactionStrength: 1.5,
      trailLength: 20,
      mouseAttraction: 80,
      particleCount: 25,
      particleType: 'heavy',
    },
  },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onConfigChange,
  isRunning,
  onToggleSimulation,
  onReset,
  onAddExplosion,
  onAddOrbitalSystem,
  onLoadPreset,
  showTrails,
  onToggleTrails,
  showForceFields,
  onToggleForceFields,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 z-50 p-3 rounded-lg bg-black/30 backdrop-blur-md hover:bg-black/50 active:bg-black/70 transition-colors text-white touch-manipulation"
        aria-label="Toggle control panel"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Control Panel */}
      <div className={`absolute top-4 left-4 bg-black/20 backdrop-blur-md rounded-lg text-white max-w-xs w-full max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col sm:max-w-sm transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 pb-2 flex-shrink-0 pt-16">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Physics Control
          </h2>
          <div className="flex gap-2">
            <button
              onClick={onToggleSimulation}
              className="p-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 active:bg-purple-600/70 transition-colors touch-manipulation"
              aria-label={isRunning ? 'Pause simulation' : 'Start simulation'}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={onReset}
              className="p-2 rounded-lg bg-red-600/30 hover:bg-red-600/50 active:bg-red-600/70 transition-colors touch-manipulation"
              aria-label="Reset simulation"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {/* Physics Controls */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Gravity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={config.gravity}
                onChange={(e) => onConfigChange({ gravity: parseFloat(e.target.value) })}
                className="w-full accent-purple-500 h-2 touch-manipulation"
                aria-label="Gravity strength"
              />
              <span className="text-xs text-gray-400">{config.gravity.toFixed(2)}</span>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Touch Attraction</label>
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={config.mouseAttraction}
                onChange={(e) => onConfigChange({ mouseAttraction: parseFloat(e.target.value) })}
                className="w-full accent-blue-500 h-2 touch-manipulation"
                aria-label="Touch attraction strength"
              />
              <span className="text-xs text-gray-400">{config.mouseAttraction}</span>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Particle Interaction</label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={config.interactionStrength}
                onChange={(e) => onConfigChange({ interactionStrength: parseFloat(e.target.value) })}
                className="w-full accent-green-500 h-2 touch-manipulation"
                aria-label="Particle interaction strength"
              />
              <span className="text-xs text-gray-400">{config.interactionStrength.toFixed(1)}</span>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Damping</label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.001"
                value={config.damping}
                onChange={(e) => onConfigChange({ damping: parseFloat(e.target.value) })}
                className="w-full accent-yellow-500 h-2 touch-manipulation"
                aria-label="Damping factor"
              />
              <span className="text-xs text-gray-400">{config.damping.toFixed(3)}</span>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Trail Length</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={config.trailLength}
                onChange={(e) => onConfigChange({ trailLength: parseInt(e.target.value) })}
                className="w-full accent-pink-500 h-2 touch-manipulation"
                aria-label="Particle trail length"
              />
              <span className="text-xs text-gray-400">{config.trailLength}</span>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Particle Type</label>
              <select
                value={config.particleType}
                onChange={(e) => onConfigChange({ particleType: e.target.value as ParticleType })}
                className="w-full bg-black/30 rounded px-3 py-2 text-sm border border-gray-600 touch-manipulation"
                aria-label="Particle type selection"
              >
                <option value="normal">Normal</option>
                <option value="heavy">Heavy</option>
                <option value="light">Light</option>
                <option value="charged">Charged</option>
              </select>
            </div>
          </div>

          {/* Visual Controls */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={onToggleTrails}
              className={`px-3 py-2 rounded text-xs transition-colors touch-manipulation ${
                showTrails ? 'bg-blue-600/50' : 'bg-gray-600/30 hover:bg-gray-600/50 active:bg-gray-600/70'
              }`}
              aria-label={`${showTrails ? 'Hide' : 'Show'} particle trails`}
            >
              Trails
            </button>
            <button
              onClick={onToggleForceFields}
              className={`px-3 py-2 rounded text-xs transition-colors touch-manipulation ${
                showForceFields ? 'bg-green-600/50' : 'bg-gray-600/30 hover:bg-gray-600/50 active:bg-gray-600/70'
              }`}
              aria-label={`${showForceFields ? 'Hide' : 'Show'} force fields`}
            >
              Fields
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onAddExplosion}
              className="px-3 py-3 rounded-lg bg-orange-600/30 hover:bg-orange-600/50 active:bg-orange-600/70 transition-colors flex items-center justify-center gap-2 text-sm touch-manipulation"
              aria-label="Add explosion effect"
            >
              <Zap size={16} />
              Explode
            </button>
            <button
              onClick={onAddOrbitalSystem}
              className="px-3 py-3 rounded-lg bg-teal-600/30 hover:bg-teal-600/50 active:bg-teal-600/70 transition-colors flex items-center justify-center gap-2 text-sm touch-manipulation"
              aria-label="Add orbital system"
            >
              <Orbit size={16} />
              Orbital
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-300">Presets</h3>
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => onLoadPreset(preset)}
                className="w-full text-left p-3 rounded bg-black/20 hover:bg-black/40 active:bg-black/60 transition-colors touch-manipulation"
                aria-label={`Load ${preset.name} preset`}
              >
                <div className="text-sm font-medium text-purple-300">{preset.name}</div>
                <div className="text-xs text-gray-400 leading-tight mt-1">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close control panel"
        />
      )}
    </>
  );
};