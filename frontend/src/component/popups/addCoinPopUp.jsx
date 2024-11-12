import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { motion } from "framer-motion";
import Button from "./popups_component/button";
import { X } from "lucide-react";

const AddCoinPopUp = ({ isOpen, setOpen, updateWalletBalance, setAlertInfo }) => {
  const [addAmount, setAddAmount] = useState(null);
  const [addingCoin, setAddingCoin] = useState(false);

  // Handler - On Pop Up Close
  function onPopUpClose() {
    setOpen(false);
    setAddAmount(null);
    setAddingCoin(false);
  }

  // Handler - Continue to Stripe Payment after Submit
  async function handleSubmit(e) {
    e.preventDefault();

    // Check form valid
    if (!addAmount) {
      setAlertInfo((prevState) => ({
        ...prevState,
        open: true,
        severity: 'error',
        message: 'Please Enter a Valid Amount.',
      }))
      return;
    }

    // Set processing status
    setAddingCoin(true);

    try {
      const response = await stripePayment();

      // Handle API response
      if (response === "200") {
        // Alert Success Message 
        setAlertInfo((prevState) => ({
          ...prevState,
          open: true,
          severity: 'success',
          message: `${addAmount} STC Added to your Wallet !`,
        }))
      }

      // Update Wallet Balance
      updateWalletBalance("INCREASE", addAmount);
    } catch (error) {
      console.error("Error redeeming token:", error);
    } finally {
      // Close Pop up & Reset
      onPopUpClose();
    }

  }

  // Handler - Simulate Stripe Payment Gateway
  async function stripePayment() {
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
            <DialogTitle className="bg-transparent text-white p-3 px-5 relative">

              <div className="flex justify-between items-center relative z-10">
                <h2
                  className="text-2xl font-extrabold tracking-wider">
                  Add Coins
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
              {addingCoin ? // GIF - Redeem Processing
                <div className='flex justify-center bg-[#0D1B2A] bg-opacity-50 relative'>
                  <img
                    src="wallet-loading.gif"
                    className='w-[10em] p-2 py-6'
                  />
                </div>
                : // Input Fields 
                <div
                  className="p-4 py-6 bg-[#0D1B2A] bg-opacity-85 relative flex flex-col items-center"
                >
                  {/* Input - Add Coin Amount */}
                  <input
                    id="addAmount"
                    type="number"
                    placeholder='Enter Coin'
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="bg-transparent focus:outline-none border-b border-b-[#20C997] text-center w-[80%] placeholder:text-sm text-md text-[#F0F3F5] focus:border-b-cyan-300"
                  />

                  {/* Buttons - Predefined Amounts */}
                  <div className='flex flex-row gap-2 mt-2'>
                    <AmountButton
                      amount={100}
                      onClick={(e) => { e.preventDefault(); setAddAmount(100) }}
                    />
                    <AmountButton
                      amount={300}
                      onClick={(e) => { e.preventDefault(); setAddAmount(300) }}
                    />
                    <AmountButton
                      amount={900}
                      onClick={(e) => { e.preventDefault(); setAddAmount(900) }}
                    />
                  </div>

                  {/* Btn - Add Coin */}
                  <Button
                    className="w-full bg-gradient-to-r from-slate-900 to-teal-400 hover:from-teal-400 hover:to-teal-400 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105 hover:rotate-1 hover:shadow-neon mt-5"
                  >
                    {addingCoin ? "Processing..." : "Add"}
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
    </Dialog>
  )
}

// Predefined Amount Button
const AmountButton = ({ amount, ...props }) => (
  <button
    className='bg-gradient-to-r from-[#33669C] to-[#20C997] p-1 rounded-2xl text-[#0D1B2A] font-semibold w-[6em] hover:scale-110 transition-transform hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] text-[13px]'
    {...props}
  >
    {amount} STC
  </button>
)

export default AddCoinPopUp