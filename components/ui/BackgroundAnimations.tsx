"use client";

import { motion } from "framer-motion";

export function BackgroundAnimations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Top Left Blob */}
      <motion.div
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-radium-purple/20 rounded-full blur-[100px]"
        animate={{
          x: [-100, 100, -100],
          y: [-100, 50, -100],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bottom Right Blob */}
      <motion.div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-radium-blue/20 rounded-full blur-[120px]"
        animate={{
          x: [100, -100, 100],
          y: [100, -50, 100],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Center Floating Blob */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-radium-green/10 rounded-full blur-[80px]"
        animate={{
          x: ["-50%", "-40%", "-60%", "-50%"],
          y: ["-50%", "-60%", "-40%", "-50%"],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
