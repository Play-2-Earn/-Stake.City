import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { motion } from "framer-motion";
import { Input } from "./popups_component/input.jsx";
import { Label } from "./popups_component/label.jsx";
import Button from "./popups_component/button.jsx";
import { X, Wallet } from "lucide-react";
import { RiHandCoinLine } from "react-icons/ri";
import { formatFiat } from "../lib/utils.js";

const RedeemCoinPopUp = ({ isOpen, setOpen, walletBalance, updateWalletBalance, setAlertInfo }) => {
  const [redeemAmount, setRedeemAmount] = useState(null);
  const [precessingRedeem, setProcessingRedeem] = useState(false);

  // Handler - On Pop Up Close
  function onPopUpClose() {
    setOpen(false);
    setProcessingRedeem(false);
    setRedeemAmount(null);
  }

  // Handler - Redeem Coin to Wallet
  async function handleSubmit(e) {
    e.preventDefault();

    // Check if Redeem Amount is Valid
    if (!redeemAmount) {
      setAlertInfo((prevState) => ({
        ...prevState,
        open: true,
        severity: 'error',
        message: 'Please Enter a Valid Amount.',
      }));
      return;
    } else if (redeemAmount > walletBalance) {
      setAlertInfo((prevState) => ({
        ...prevState,
        open: true,
        severity: 'error',
        message: "You don't have that much STC !",
      }));
      return;
    }

    // Set processing status
    setProcessingRedeem(true);

    try {
      // Fetch API - Redeem Coin to Wallet
      const response = await redeemCoin();

      // Handle API response
      if (response === "200") {
        // Alert Success Message 
        setAlertInfo((prevState) => ({
          ...prevState,
          open: true,
          severity: 'success',
          message: `${redeemAmount} STC Redeemed Successfully !`,
        }))

        // Update Wallet Balance
        updateWalletBalance("DECREASE", redeemAmount);
      }
    } catch (error) {
      console.error("Error redeeming token:", error);
    } finally {
      // Close Pop up & Reset
      onPopUpClose();
    }
  }

  // Simulate API Call - Redeem Coin
  async function redeemCoin() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("200");
      }, 1500);
    });
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
          className="w-full max-w-sm bg-gray-900 rounded-3xl shadow-[0_0_30px_rgba(0,255,255,0.3)] overflow-hidden relative border-2 border-[#33669C]"

          initial={{ scale: 0.8, y: 50, rotateX: 20 }}
          animate={{ scale: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, y: 50, rotateX: 20 }}
          transition={{ type: "spring", damping: 15, stiffness: 100 }}
        >
          <DialogPanel transition>
            {/* Header */}
            <DialogTitle
              className="bg-transparent text-white p-3 px-5 relative">

              <div className="flex justify-between items-center relative z-10">
                <h2
                  className="text-2xl font-extrabold tracking-wider">
                  Redeem Coins
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPopUpClose}
                  className="text-white hover:text-yellow-300 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </DialogTitle>

            {/* Card Background Image */}
            <>
              <img
                src="/wallet-moon.png"
                className='absolute inset-0 -top-[6em] left-[7em] opacity-[40%]'
              />
              <div
                className="absolute top-0 left-0 w-full h-full opacity-[40%]"
                style={{
                  backgroundImage: `url("/wallet-bg.jpg")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </>

            {/* Content */}
            <form onSubmit={handleSubmit}>
              {precessingRedeem ? // GIF - Redeem Processing
                <div className='flex justify-center bg-[#0D1B2A] bg-opacity-50 relative'>
                  <img
                    src="wallet-loading.gif"
                    className='w-[10em] p-2 py-6'
                  />
                </div>
                : // Input Fields 
                <div
                  className="p-4 py-6 space-y-4 bg-[#0D1B2A] bg-opacity-85 relative"
                >
                  {/* Input - Redeem Amount */}
                  <div className="space-y-1">
                    <div className='flex justify-between items-end'>
                      {/* Label */}
                      <Label htmlFor="redeemAmount" className="text-slate-100 text-sm m;-2">
                        Coin
                      </Label>

                      {/* Available Coins to Redeem */}
                      <span className='text-xs text-[#A0AAB2]'>{formatFiat(walletBalance, 4)} available</span>
                    </div>
                    <div className="relative">
                      {/* Input Field */}
                      <Input
                        id="redeemAmount"
                        label="Amount"
                        type="number"
                        icon={<Wallet size={22} />}
                        value={redeemAmount}
                        onChange={(e) => setRedeemAmount(e.target.value)}
                        placeholder="e.g. 999"
                        className="px-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 rounded-full"
                      />

                      {/* Icon */}
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-100">
                        <RiHandCoinLine size={22} />
                      </div>

                      {/* Btn - Max Amount */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setRedeemAmount(Number(walletBalance))
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-[#A0AAB2] hover:text-[#F0F3F5]"
                      >
                        MAX
                      </button>
                    </div>
                  </div>

                  {/* Btn - Redeem Coin */}
                  <Button
                    className="w-full bg-gradient-to-r from-slate-900 to-teal-400 hover:from-teal-400 hover:to-teal-400 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105 hover:rotate-1 hover:shadow-neon"
                  >
                    {precessingRedeem ? "Processing..." : "Redeem"}
                  </Button>
                </div>
              }
            </form>

            {/* Footer */}
            <div className="p-3 bg-transparent text-white relative text-center"
            >
              <p className="text-sm flex items-center justify-center">
                <Button
                  variant="link"
                  className="text-blue-200 hover:text-blue-200"
                // onClick={NewToGame}
                >
                  T&C
                </Button>

                <Button
                  variant="link"
                  className="text-blue-200 hover:text-blue-200"
                // onClick={NewToGame}
                >
                  FAQ
                </Button>
              </p>
            </div>

          </DialogPanel>
        </motion.div>
      </motion.div>
    </Dialog >
  )
}

export default RedeemCoinPopUp