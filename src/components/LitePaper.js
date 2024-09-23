import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Target, Lock, Cpu } from "lucide-react";

const LitePaper = () => {
  const [hoveredSection, setHoveredSection] = useState(null);

  const sections = [
    {
      title: "Overview",
      content: `Stake.City: The next-gen Web3 game empowering users to earn SCT tokens through real-world tasks, contributing to the digital twin revolution.`,
      icon: Zap,
    },
    {
      title: "Mission",
      content: `Decentralize gaming by merging real-world tasks with the digital realm. Build the future, collect data, earn rewards.`,
      icon: Target,
    },
    {
      title: "Key Features",
      content: [
        "Play-to-Earn: Complete real-world tasks, earn SCT tokens",
        "Dynamic Staking: Amplify rewards through strategic token staking",
        "IPFS Storage: Transparent, secure, decentralized data",
        "Stellar-Powered: Fast, affordable blockchain transactions",
      ],
      icon: Lock,
    },
    {
      title: "Vision",
      content: `Create a world where gaming and reality converge, empowering users to shape the digital landscape while earning rewards. Stake.City: Where your actions build the future.`,
      icon: Cpu,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <motion.h1
        className="text-6xl font-bold mb-12 text-center cyber-glitch"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Stake.City Lite Paper
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-green-400 transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredSection(index)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="flex items-center mb-4">
              <section.icon className="text-green-400 mr-2" size={24} />
              <h2 className="text-2xl font-bold text-green-400">
                {section.title}
              </h2>
            </div>
            {Array.isArray(section.content) ? (
              <ul className="list-disc pl-5 space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-green-200">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-200">{section.content}</p>
            )}
            {hoveredSection === index && (
              <motion.div
                className="mt-4 h-1 bg-green-400"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.div>
        ))}
      </div>
      <style jsx>{`
        .cyber-glitch {
          text-shadow: 0.05em 0 0 rgba(0, 255, 0, 0.75),
            -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
            0.025em 0.05em 0 rgba(0, 255, 0, 0.75);
          animation: cyber-glitch 1s infinite;
        }
        @keyframes cyber-glitch {
          0% {
            text-shadow: 0.05em 0 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em 0.05em 0 rgba(0, 255, 0, 0.75);
          }
          14% {
            text-shadow: 0.05em 0 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em 0.05em 0 rgba(0, 255, 0, 0.75);
          }
          15% {
            text-shadow: -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.05em 0 rgba(0, 255, 0, 0.75);
          }
          49% {
            text-shadow: -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.05em 0 rgba(0, 255, 0, 0.75);
          }
          50% {
            text-shadow: 0.025em 0.05em 0 rgba(0, 255, 0, 0.75),
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              0 -0.05em 0 rgba(0, 255, 0, 0.75);
          }
          99% {
            text-shadow: 0.025em 0.05em 0 rgba(0, 255, 0, 0.75),
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              0 -0.05em 0 rgba(0, 255, 0, 0.75);
          }
          100% {
            text-shadow: -0.025em 0 0 rgba(0, 255, 0, 0.75),
              -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em -0.05em 0 rgba(0, 255, 0, 0.75);
          }
        }
      `}</style>
    </div>
  );
};

export default LitePaper;
