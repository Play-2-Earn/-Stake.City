import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import Button from "./popups_component/button";
import { X } from "lucide-react";
import { LuAlertTriangle } from "react-icons/lu";

const AddWalletNote = ({ isOpen, setOpenNote, setOpenAddWallet }) => {

  // Handler - On Pop Up Close
  function onPopUpClose() {
    setOpenNote(false);
  }

  // Handler - Accept Note T&C
  function handleAccept() {
    onPopUpClose();
    setOpenAddWallet(true);
  }

  return (
    <Dialog open={isOpen} onClose={onPopUpClose}>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-[30em] bg-blue-1 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.3)] overflow-hidden relative border-2 border-[#33669C]"
          initial={{ scale: 0.8, y: 50, rotateX: 20 }}
          animate={{ scale: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, y: 50, rotateX: 20 }}
          transition={{ type: "spring", damping: 15, stiffness: 100 }}
        >
          <DialogPanel transition>
            {/* Header */}
            <DialogTitle
              className="bg-transparent text-white-1 p-3 pl-5 px-3 relative"
            >
              <div className="flex justify-between items-center relative z-10">
                <h2
                  className="text-2xl font-extrabold tracking-wider flex items-center gap-2">
                  <LuAlertTriangle /> Important
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPopUpClose}
                  className="text-white-1 hover:text-cyan-300 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </DialogTitle>

            {/* Content */}
            <div className='px-5 pr-7 text-sm text-justify text-gray-1 gap-2 flex flex-col'>
              <p>
                Your staked coins will be sent via Stellar Lumens (XLM). Please ensure you have a valid Stellar wallet or create one if you don’t already have one. Recommended options include xBull, Freighter, or Albedo.
              </p>
              <p>
                It is crucial to double-check and input the correct wallet address, as Stake.City cannot be held responsible for any loss of coins due to an incorrect address, and lost coins cannot be recovered or redeemed through us.
              </p>
            </div>

            {/* Buttonss */}
            <div className='flex flex-row gap-2 w-full justify-end p-4 px-5 mt-5'>
              {/* Btn - Accept */}
              <button
                type="button"
                onClick={handleAccept}
                className="bg-gradient-to-r from-teal-400 to-teal-400 hover:from-[#0D1B2A] hover:to-[#33669C] text-[#0D1B2A] font-bold py-1 px-4 rounded-full transition-all duration-200 transform hover:scale-105 hover:rotate-1 hover:shadow-neon border border-[#33669C] text-sm w-[7em] h-[2.2em] flex justify-center items-center hover:text-[#F0F3F5]"
              >
                Accept
              </button>

              {/* Btn - Cancel */}
              <button
                type="button"
                onClick={onPopUpClose}
                className="bg-gradient-to-r from-red-400 to-red-400 hover:from-[#0D1B2A] hover:to-[#33669C] text-[#0D1B2A] font-bold py-1 px-4 rounded-full transition-all duration-200 transform hover:scale-105 hover:rotate-1 hover:shadow-neon border border-[#33669C] text-sm w-[7em] h-[2.2em] flex justify-center items-center hover:text-[#F0F3F5]"
              >
                Cancel
              </button>
            </div>

          </DialogPanel>
        </motion.div>
      </motion.div >
    </Dialog >
  )
}

export default AddWalletNote