import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/IntroAnimation.css";

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [fillCompleted, setFillCompleted] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Stage-managed timing
    // 1. Trigger the radial pulse ring when the stroke drawing finishes and fill begins
    const fillTimer = setTimeout(() => {
      setFillCompleted(true);
    }, 1500);

    // 2. Trigger the "airbnb" text stagger-in after the path is mostly drawn
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1200);

    // 3. Complete the intro and trigger exit transition
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3600);

    return () => {
      clearTimeout(fillTimer);
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Framer Motion variants for drawing path
  const pathVariants = {
    initial: {
      pathLength: 0,
      fill: "rgba(255, 255, 255, 0)",
      stroke: "rgba(255, 255, 255, 0.95)",
      strokeWidth: 1,
    },
    animate: {
      pathLength: 1,
      fill: "rgba(255, 255, 255, 1)",
      stroke: "rgba(255, 255, 255, 0)",
      strokeWidth: 0,
      transition: {
        pathLength: {
          duration: 1.6,
          ease: [0.6, 0.05, 0.15, 0.95],
        },
        fill: {
          duration: 0.6,
          delay: 1.3,
          ease: "easeInOut",
        },
        stroke: {
          duration: 0.3,
          delay: 1.7,
        },
        strokeWidth: {
          duration: 0.3,
          delay: 1.7,
        },
      },
    },
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const letterVariants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  // Airbnb logo letters
  const letters = ["a", "i", "r", "b", "n", "b"];

  return (
    <motion.div
      className="intro-overlay"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.08,
        filter: "blur(5px)",
        transition: { duration: 0.85, ease: [0.4, 0, 0.2, 1] },
      }}
    >
      {/* Skip Intro Button */}
      <motion.button
        className="absolute top-6 right-8 text-xs font-semibold uppercase tracking-wider text-white/70 bg-white/10 hover:bg-white/20 hover:text-white border border-white/15 hover:border-white/30 px-4 py-2 rounded-full cursor-pointer transition-all duration-200 z-[999999]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={onComplete}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Skip Intro
      </motion.button>

      <div className="intro-logo-container">
        {/* Pulsing glow ring triggered on fill completion */}
        <AnimatePresence>
          {fillCompleted && (
            <motion.div
              className="intro-pulse-ring"
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 2.3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* SVG Bêlo Logo */}
        <motion.svg
          className="intro-svg"
          viewBox="0 0 24 24"
          initial={{ scale: 0.9 }}
          animate={{
            scale: [0.9, 1.05, 1],
            filter: [
              "drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))",
              "drop-shadow(0 0 35px rgba(255, 255, 255, 0.6))",
              "drop-shadow(0 0 25px rgba(255, 255, 255, 0.45))",
            ],
          }}
          transition={{
            scale: { duration: 2.0, ease: "easeInOut" },
            filter: { duration: 2.0, ease: "easeInOut" },
          }}
        >
          <motion.path
            d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z"
            variants={pathVariants}
            initial="initial"
            animate="animate"
          />
        </motion.svg>

        {/* Wordmark: airbnb */}
        <AnimatePresence>
          {showText && (
            <motion.div
              className="intro-text"
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              {letters.map((letter, idx) => (
                <motion.span
                  key={idx}
                  className="intro-text-letter"
                  variants={letterVariants}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
