import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const WhitePaper = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      title: "Introduction",
      content: `Stake.City is a revolutionary decentralized play-to-earn (P2E) platform built on the Stellar blockchain with IPFS integration. Players are rewarded with Stellar-native tokens (SCT) for completing hyper-local tasks that contribute to building digital twins for real-world companies.`,
    },
    {
      title: "Vision",
      content: `Stake.City aims to become the leader in Web3 gaming by decentralizing local interactions and providing valuable data for digital twin companies. We're creating a future where gaming meets real-world impact.`,
    },
    {
      title: "Core Components",
      content: [
        "Stellar Blockchain Integration: Lightning-fast, low-cost transactions",
        "IPFS Decentralized Storage: Transparent, immutable data storage",
        "SCT Tokenomics: Stellar-native tokens for rewards and governance",
        "Dynamic Staking System: Amplify your earnings through strategic staking",
      ],
    },
  ];

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <motion.h1
        className="text-6xl font-bold mb-12 text-center cyber-glitch"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Stake.City White Paper
      </motion.h1>
      <div className="space-y-8">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="bg-gray-900 border border-gray-700 rounded-lg hover:border-white transition-all duration-300">
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleSection(index)}
              >
                <h2 className="text-2xl text-green-400 flex items-center justify-between">
                  <span>{section.title}</span>
                  {expandedSection === index ? <ChevronUp /> : <ChevronDown />}
                </h2>
              </div>
              <AnimatePresence>
                {expandedSection === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4">
                      {Array.isArray(section.content) ? (
                        <ul className="list-disc pl-5 space-y-2">
                          {section.content.map((item, itemIndex) => (
                            <motion.li
                              key={itemIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: itemIndex * 0.1,
                              }}
                              className="text-green-200"
                            >
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-green-200">{section.content}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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

export default WhitePaper;
