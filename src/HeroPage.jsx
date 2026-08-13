import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

// Animated headline — splits "90s सफर" into letters and animates each
const AnimatedTitle = () => {
  const title = '90s सफर';
  const letters = Array.from(title);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18, delayChildren: 0.4 }
    }
  };

  const child = {
    hidden: { opacity: 0, y: 60, rotateX: -90, filter: 'blur(12px)' },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      className="devanagari text-7xl md:text-9xl font-black tracking-tight text-amber-50 drop-shadow-[0_8px_30px_rgba(0,0,0,.7)] flex justify-center flex-wrap"
      style={{ perspective: '1000px' }}
    >
      {letters.map((char, i) => (
        <motion.span
          key={i}
          variants={child}
          className="inline-block"
          style={{
            background: 'linear-gradient(180deg, #fef3c7 0%, #fcd34d 45%, #d97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(245, 158, 11, 0.3)'
          }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

// Typewriter subtitle
const TypewriterSubtitle = ({ text, delay = 1.4 }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, 60);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <div className="flex items-center justify-center gap-2 min-h-[2rem]">
      <span className="font-serif italic text-lg md:text-2xl text-amber-100/90 tracking-widest uppercase">
        {displayed}
      </span>
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-0.5 h-6 md:h-8 bg-amber-300"
        />
      )}
    </div>
  );
};

// Animated vintage divider with rotating star
const VintageDivider = () => (
  <motion.div
    initial={{ opacity: 0, scaleX: 0 }}
    animate={{ opacity: 1, scaleX: 1 }}
    transition={{ delay: 2.6, duration: 1.2 }}
    className="flex items-center justify-center gap-4 my-6"
  >
    <div className="h-px w-24 md:w-40 bg-gradient-to-r from-transparent via-amber-300 to-amber-300" />
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      className="text-amber-300 text-2xl"
    >
      ✦
    </motion.div>
    <div className="h-px w-24 md:w-40 bg-gradient-to-l from-transparent via-amber-300 to-amber-300" />
  </motion.div>
);

// Floating particles background
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 30 }).map((_, i) => {
      const size = 2 + (i % 4) * 0.8;
      const startX = (i * 37) % 100;
      const duration = 10 + (i % 5) * 2;
      const delay = (i * 0.4) % duration;
      return (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-200"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${startX}%`,
            bottom: '-20px',
            boxShadow: '0 0 8px rgba(254, 240, 138, 0.7)',
            opacity: 0.6
          }}
          animate={{
            y: [0, -900],
            x: [0, (i % 2 === 0 ? 40 : -40), 0],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      );
    })}
  </div>
);

// Glowing sun behind the title
const GlowingSun = () => (
  <motion.div
    className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
    style={{
      top: '15%',
      width: '60vw',
      height: '60vw',
      maxWidth: '500px',
      maxHeight: '500px',
      background:
        'radial-gradient(circle, rgba(253,224,71,0.55) 0%, rgba(251,191,36,0.25) 35%, transparent 70%)',
      filter: 'blur(30px)'
    }}
    animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// Animated live ticker (year/decade)
const DecadeTicker = () => {
  const [year, setYear] = useState(1990);

  useEffect(() => {
    const interval = setInterval(() => {
      setYear(prev => (prev >= 1999 ? 1990 : prev + 1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
      className="flex items-center justify-center gap-2 text-amber-200/70 text-xs md:text-sm tracking-[0.4em] font-mono"
    >
      <span>◉ TUNING INTO</span>
      <span className="text-amber-100 font-bold">
        {year}
      </span>
      <span>FM 90.0</span>
    </motion.div>
  );
};

// The main hero page
const HeroPage = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #1a0f1f 0%, #3d1a2e 22%, #7c2d3a 45%, #c2410c 65%, #d97706 80%, #f59e0b 95%, #fbbf24 100%)'
      }}
    >
      {/* Animated sun behind title */}
      <GlowingSun />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(28,10,8,0.6) 100%)'
        }}
      />

      {/* Distant mountain silhouettes */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full pointer-events-none"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        style={{ height: '22%', opacity: 0.6 }}
      >
        <path
          d="M0,200 L0,140 L100,110 L220,135 L340,100 L460,130 L580,95 L700,125 L820,90 L940,120 L1060,100 L1200,130 L1200,200 Z"
          fill="#1c0a08"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Top eyebrow */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: '1em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="text-amber-200/80 text-xs md:text-sm uppercase font-bold mb-4 md:mb-6"
        >
          ✦ 90s की यादें ✦
        </motion.div>

        {/* Main animated title */}
        <AnimatedTitle />

        {/* Decorative divider */}
        <VintageDivider />

        {/* Typewriter subtitle */}
        <TypewriterSubtitle text="The Soundtrack of a Generation" delay={2.4} />

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 3.2, duration: 1 }}
          className="flex items-center justify-center gap-3 mt-2"
        >
          <div className="h-px w-12 bg-amber-300/60" />
          <span className="text-amber-200">◇</span>
          <div className="h-px w-12 bg-amber-300/60" />
        </motion.div>

        {/* Animated live ticker */}
        <div className="mt-6">
          <DecadeTicker />
        </div>

        {/* Tagline / Quote */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.4, duration: 1 }}
          className="devanagari text-xl md:text-2xl text-amber-50/90 mt-8 max-w-2xl leading-relaxed"
        >
          “जहाँ हर गाना एक कहानी है, और हर सफर एक याद।”
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.8, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="group relative mt-10 px-10 py-4 border-2 border-amber-200/60 text-amber-50 overflow-hidden transition-colors rounded-sm shadow-[0_0_30px_rgba(245,158,11,0.2)]"
        >
          {/* Button hover background */}
          <div className="absolute inset-0 bg-amber-200 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
          <span className="relative z-10 flex items-center gap-3 text-xs md:text-sm tracking-[0.4em] uppercase font-bold group-hover:text-stone-900 transition-colors">
            <Play size={16} fill="currentColor" />
            Press Play to Remember
          </span>
        </motion.button>

        {/* Bottom credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.2, duration: 1 }}
          className="absolute bottom-8 left-0 right-0 text-center text-amber-200/40 text-[10px] md:text-xs tracking-[0.4em] uppercase"
        >
          ◷ Since 1990 • Relive the Magic
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroPage;
