import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const roadmapData = [
  {
    phase: "Phase 1: Initial Development",
    time: "Q1 2024",
    items: [
      "Platform Architecture",
      "Token Launch",
      "IPFS Integration",
      "Task System Design",
    ],
  },
  {
    phase: "Phase 2: Alpha Release",
    time: "Q2 2024",
    items: [
      "Alpha Platform Launch",
      "Staking System",
      "Community Building",
      "Data Partnerships",
    ],
  },
  {
    phase: "Phase 3: Beta Release",
    time: "Q3 2024",
    items: [
      "Public Beta Launch",
      "Mobile Application",
      "DEX Listing",
      "Task Expansion",
    ],
  },
  {
    phase: "Phase 4: Full Launch",
    time: "Q4 2024",
    items: [
      "Global Platform Launch",
      "Staking Incentives",
      "Global Marketing",
      "Partnership Expansion",
    ],
  },
];

const Roadmap = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <motion.h1
        className="text-6xl font-bold mb-12 text-center glitch"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Stake.City Roadmap
      </motion.h1>
      <div className="space-y-16">
        {roadmapData.map((phase, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-white transition-all duration-300 transform hover:scale-105">
              <div className="mb-4">
                <h2 className="text-3xl text-green-400 flex items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mr-2"
                  >
                    <ChevronRight size={24} />
                  </motion.div>
                  {phase.phase}
                </h2>
                <div className="text-xl text-gray-400">{phase.time}</div>
              </div>
              <ul className="space-y-4">
                {phase.items.map((item, itemIndex) => (
                  <motion.li
                    key={itemIndex}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.2 + itemIndex * 0.1,
                    }}
                  >
                    <motion.div
                      className="w-3 h-3 bg-green-400 mr-3"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
      <style jsx>{`
        .glitch {
          text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
            -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
            0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          animation: glitch 500ms infinite;
        }
        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
              -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          14% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
              -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          15% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
              0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          49% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
              0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          50% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          99% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          100% {
            text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75),
              -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
        }
      `}</style>
    </div>
  );
};

export default Roadmap;
