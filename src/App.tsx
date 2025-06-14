import React, { useEffect, useRef, useState } from 'react';
import { ParticleRenderer } from './components/ParticleRenderer';
import { ControlPanel } from './components/ControlPanel';
import { usePhysicsSimulation } from './hooks/usePhysicsSimulation';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [showTrails, setShowTrails] = useState(true);
  const [showForceFields, setShowForceFields] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
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
  } = usePhysicsSimulation(dimensions.width, dimensions.height);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle mouse/touch movement
  useEffect(() => {
    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        let clientX, clientY;
        
        if ('touches' in event && event.touches.length > 0) {
          clientX = event.touches[0].clientX;
          clientY = event.touches[0].clientY;
        } else if ('clientX' in event) {
          clientX = event.clientX;
          clientY = event.clientY;
        } else {
          return;
        }
        
        updateMousePosition(
          clientX - rect.left,
          clientY - rect.top
        );
      }
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      
      if ('touches' in event) {
        // Touch events
        if (event.touches.length === 2) {
          // Two finger tap for orbital system
          addOrbitalSystem();
        } else if (event.touches.length === 1) {
          // Single tap for explosion
          addExplosion();
        }
      } else {
        // Mouse events
        if (event.shiftKey) {
          addExplosion();
        } else if (event.ctrlKey || event.metaKey) {
          addOrbitalSystem();
        }
      }
    };

    // Add both mouse and touch event listeners
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('click', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown, { passive: false });
    
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('click', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
    };
  }, [updateMousePosition, addExplosion, addOrbitalSystem]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-full h-screen cursor-crosshair touch-none"
        style={{ touchAction: 'none' }}
      >
        <ParticleRenderer
          particles={particles}
          forceFields={forceFields}
          width={dimensions.width}
          height={dimensions.height}
          showTrails={showTrails}
          showForceFields={showForceFields}
        />
        
        <ControlPanel
          config={config}
          onConfigChange={updateConfig}
          isRunning={isRunning}
          onToggleSimulation={toggleSimulation}
          onReset={reset}
          onAddExplosion={addExplosion}
          onAddOrbitalSystem={addOrbitalSystem}
          onLoadPreset={loadPreset}
          showTrails={showTrails}
          onToggleTrails={() => setShowTrails(!showTrails)}
          showForceFields={showForceFields}
          onToggleForceFields={() => setShowForceFields(!showForceFields)}
        />

        {/* Mobile Instructions */}
        {isMobile ? (
          <div className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-md rounded-lg p-4 text-white text-sm max-w-xs">
            <div className="space-y-2">
              <div className="font-semibold text-purple-300">Touch Controls</div>
              <div className="text-xs text-gray-300 space-y-1">
                <div>• Move finger to attract particles</div>
                <div>• Single tap for explosion</div>
                <div>• Two finger tap for orbital system</div>
                <div>• Use control panel to adjust physics</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-md rounded-lg p-4 text-white text-sm max-w-sm">
            <div className="space-y-2">
              <div className="font-semibold text-purple-300">Interactive Controls</div>
              <div className="text-xs text-gray-300 space-y-1">
                <div>• Move mouse to attract particles</div>
                <div>• <span className="font-mono bg-gray-800 px-1 rounded">Shift + Click</span> for explosion</div>
                <div>• <span className="font-mono bg-gray-800 px-1 rounded">Ctrl + Click</span> for orbital system</div>
                <div>• Use presets to explore different physics</div>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md rounded-lg p-3 text-white">
          <div className="text-sm font-medium text-purple-300">
            Particles: {particles.length}
          </div>
          <div className="text-xs text-gray-400">
            {isRunning ? 'Running' : 'Paused'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;