import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import starAppsLogo from '@assets/START_APPS_LOGO-removebg-preview.png';

const InteractiveLogo = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; cx: number; cy: number }[]>([]);
  const isMountedRef = useRef(true);

  // Framer Motion controls for coordination
  const starControls = useAnimation();
  const handControls = useAnimation();

  // Mouse position values for the 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Map mouse positions to rotate angles for the 3D effect
  const rotateX = useTransform(mouseY, [-150, 150], [12, -12]);
  const rotateY = useTransform(mouseX, [-150, 150], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Trigger ripple effect
  const addRipple = (cx: number, cy: number) => {
    const id = Date.now();
    setRipples((prev) => [...prev, { id, cx, cy }]);
    setTimeout(() => {
      if (isMountedRef.current) {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }
    }, 1200);
  };

  // Perform the click sequence
  const triggerClick = async () => {
    if (isAnimating || !isMountedRef.current) return;
    setIsAnimating(true);

    try {
      // 1. Hand Pointer pushes down (click) & Star squeeze
      if (!isMountedRef.current) return;
      await Promise.all([
        handControls.start({
          scale: 0.82,
          x: -4,
          y: 4,
          transition: { duration: 0.08, ease: 'easeIn' }
        }),
        starControls.start({
          scale: 0.94,
          transition: { duration: 0.08 }
        })
      ]);

      // Fire ripple circles originating from the hand click coordinates (170, 125)
      if (!isMountedRef.current) return;
      addRipple(170, 125);

      // 2. Bounce back & Pulse star with neon flare
      if (!isMountedRef.current) return;
      await Promise.all([
        handControls.start({
          scale: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.15, ease: 'easeOut' }
        }),
        starControls.start({
          scale: [0.94, 1.15, 1],
          filter: [
            'drop-shadow(0 0 10px rgba(0, 255, 200, 0.3))',
            'drop-shadow(0 0 35px rgba(0, 255, 200, 0.85))',
            'drop-shadow(0 0 12px rgba(0, 255, 200, 0.3))'
          ],
          transition: { duration: 0.4, times: [0, 0.3, 1], ease: 'easeOut' }
        })
      ]);

      if (!isMountedRef.current) return;
      setIsAnimating(false);

      // Resume the gentle floating idle state for the hand
      if (!isMountedRef.current) return;
      handControls.start({
        y: [0, -4, 0],
        x: [0, 2, 0],
        transition: {
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut'
        }
      });
    } catch (e) {
      console.warn("Animation interrupted:", e);
    }
  };

  const handleManualClick = () => {
    triggerClick();
  };

  // Play intro sequence on mount
  useEffect(() => {
    isMountedRef.current = true;

    const runIntro = async () => {
      // Setup star container initial state
      if (!isMountedRef.current) return;
      starControls.set({ scale: 0.8, opacity: 0 });
      
      // Position hand off-screen initially
      if (!isMountedRef.current) return;
      handControls.set({
        x: 90,
        y: 110,
        scale: 1.3,
        opacity: 0
      });

      // 1. Star fades and scales in
      if (!isMountedRef.current) return;
      await starControls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 1.0, ease: 'easeOut' }
      });

      // 2. Hand Pointer slides in smoothly
      if (!isMountedRef.current) return;
      await handControls.start({
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
      });

      // Wait a fraction of a second before clicking
      if (!isMountedRef.current) return;
      await new Promise((r) => setTimeout(r, 250));

      // 3. Trigger Click
      if (!isMountedRef.current) return;
      await triggerClick();
    };

    runIntro();

    return () => {
      isMountedRef.current = false;
      starControls.stop();
      handControls.stop();
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-72 h-72 md:w-96 md:h-96 select-none">
      {/* Background Soft Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-[#00FFC8]/10 via-[#6B38FB]/5 to-[#FF2D55]/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 3D Tilting Core Group */}
      <motion.div
        className="relative z-10 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center cursor-pointer"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleManualClick}
      >
        {/* Outer Orbit Ring */}
        <motion.div
          className="absolute inset-0 border-2 border-dashed border-[#00FFC8]/15 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          style={{ transform: 'translateZ(-40px)' }}
        />

        {/* Middle Tech Ring */}
        <motion.div
          className="absolute inset-4 border-2 border-double border-t-[#6B38FB]/30 border-b-[#FF2D55]/30 border-l-transparent border-r-transparent rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ transform: 'translateZ(-20px)' }}
        />

        {/* Telemetry data labels */}
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none font-['Orbitron'] text-[8px] md:text-[9px] text-gray-500/80 px-2" style={{ transform: 'translateZ(-10px)' }}>
          <motion.span 
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SYS: CORE_OK
          </motion.span>
          <motion.span 
            animate={{ opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[#00FFC8]/60 font-bold"
          >
            CLICK_TO_TEST
          </motion.span>
        </div>

        {/* Scope Lines */}
        <div className="absolute inset-8 border border-gray-800/20 rounded-full pointer-events-none" style={{ transform: 'translateZ(-15px)' }}>
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-[#00FFC8]/10 via-transparent to-[#00FFC8]/10" />
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-[#00FFC8]/10 via-transparent to-[#00FFC8]/10" />
        </div>

        {/* Main Logo Container */}
        <motion.div
          className="relative w-44 h-44 md:w-56 md:h-56 flex items-center justify-center bg-[#141414]/80 backdrop-blur-md border border-gray-850 rounded-full p-5 shadow-2xl"
          animate={starControls}
          style={{
            transform: 'translateZ(30px)',
            boxShadow: '0 0 30px rgba(0, 255, 200, 0.1), inset 0 0 15px rgba(0, 255, 200, 0.03)',
            filter: 'drop-shadow(0 0 10px rgba(0, 255, 200, 0.4))'
          }}
          whileHover={{
            borderColor: 'rgba(0, 255, 200, 0.25)',
          }}
        >
          {/* SVG Canvas */}
          <svg
            viewBox="0 0 260 260"
            className="w-full h-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ripple circles rendering inside SVG space */}
            {ripples.map((rip) => (
              <g key={rip.id}>
                {/* Primary green ripple */}
                <motion.circle
                  cx={rip.cx}
                  cy={rip.cy}
                  initial={{ r: 4, opacity: 0.9, strokeWidth: 3 }}
                  animate={{ r: 100, opacity: 0, strokeWidth: 0.5 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  stroke="#00FFC8"
                  fill="none"
                />
                {/* Secondary purple ripple */}
                <motion.circle
                  cx={rip.cx}
                  cy={rip.cy}
                  initial={{ r: 4, opacity: 0.7, strokeWidth: 2 }}
                  animate={{ r: 135, opacity: 0, strokeWidth: 0.5 }}
                  transition={{ duration: 1.1, delay: 0.12, ease: 'easeOut' }}
                  stroke="#6B38FB"
                  fill="none"
                />
              </g>
            ))}

            {/* Official corporate image rendered centered in SVG space */}
            <image 
              href={starAppsLogo} 
              x="30" 
              y="30" 
              width="200" 
              height="200"
              className="filter drop-shadow-[0_0_8px_rgba(0,255,200,0.3)]"
            />

            {/* Cybernetic Pointer Hand Cursor (Black contrast circle and green hand path) */}
            <motion.g
              animate={handControls}
              style={{ transformOrigin: '170px 125px' }}
            >
              {/* Backing circle */}
              <circle cx="170" cy="125" r="20" fill="#000000" />
              {/* Pointer path */}
              <path
                d="M166 115C170 116 173 119 174 123L178 115C180 115 183 116 184 120C178 124 173 129 175 134C169 133 168 125 168 123L166 115Z"
                fill="#00FFC8"
              />
            </motion.g>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InteractiveLogo;
