import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Input } from "./popups_component/input";
import { Label } from "./popups_component/label";
import Button from "./popups_component/button";
import { X, Wallet } from "lucide-react";
import { useDispatch } from 'react-redux';
import useAlert from '../../Hooks/useAlert';
import { setWalletAddress } from '../../Store/Slices/Wallet';

const API_BASE_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:5000"
  : process.env.Deployed_link;

const AddWalletPopUp = ({ isOpen, setOpenAddWallet, setOpenRedeemCoin }) => {
  const [walletAddrInput, setWalletAddrInput] = useState(null);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const showAlert = useAlert();
  const dispatch = useDispatch();

  // Handler - On Pop Up Close
  function onPopUpClose() {
    setConnectingWallet(false);
    setWalletAddrInput('');
    setOpenAddWallet(false);
  }

  // Handler - Connect Wallet
  async function handleConnect(e) {
    e.preventDefault();

    // Check if wallet address is valid
    if (!walletAddrInput) {
      // Set alert info on successful connection
      showAlert({ severity: "error", message: "Please Enter a Valid Wallet Address." });
      return;
    }

    // Set processing status
    setConnectingWallet(true);

    try {
      // Fetch API - Connect Wallet
      const response = await fetch(`${API_BASE_URL}/api/update_wallet`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify({
          wallet_addr: walletAddrInput,
        })
      })

      // Handle API response
      if (response.status === 200) {
        // Store Wallet Address
        dispatch(setWalletAddress(walletAddrInput));

        // Set alert info on successful connection
        showAlert({ severity: "success", message: "Wallet Conneted." });

        // Open Redeem Wallet Pop Up after Wallet is Connected
        setOpenRedeemCoin(true);
      } else if (response.status === 409) {
        showAlert({ severity: "error", message: "Wallet Address is Connected to Aother Account." });
      }
    } catch (error) {
      // Log error
      console.error("Error connecting wallet:", error);

      // Set alert info on fail connection
      showAlert({ severity: "error", message: "Error Connecting Wallet. Try Again." });

    } finally {
      onPopUpClose();
    }
  }

  // Alert Message - Connect Wallet before Redeem
  useEffect(() => {
    showAlert({ severity: "error", message: "Connect Wallet before Redeem." });
  }, [])


  return (
    <Dialog open={isOpen} onClose={onPopUpClose}>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-sm bg-blue-1 rounded-3xl shadow-[0_0_30px_rgba(0,255,255,0.3)] overflow-hidden relative border-2 border-[#33669C]"
          initial={{ scale: 0.8, y: 50, rotateX: 20 }}
          animate={{ scale: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, y: 50, rotateX: 20 }}
          transition={{ type: "spring", damping: 15, stiffness: 100 }}
        >
          <DialogPanel transition>
            {/* Header */}
            <DialogTitle
              className="bg-transparent text-white-1 p-3 px-5 relative"
            >
              <div className="flex justify-between items-center relative z-10">
                <h2
                  className="text-2xl font-extrabold tracking-wider">
                  Connect Wallet
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
            <form onSubmit={handleConnect}>
              {connectingWallet
                ? // GIF - Processing
                <div className='flex justify-center bg-blue-1 bg-opacity-50 relative'>
                  <img
                    src="wallet-loading.gif"
                    className='w-[10em] p-2 py-6'
                  />
                </div>
                : // Input Fields 
                <div
                  className="p-4 py-6 bg-blue-1 bg-opacity-85 relative flex flex-col items-center"
                >
                  {/* Input - Wallet Address */}
                  <div className="space-y-1 w-full">
                    <Label htmlFor="walletAddress" className="text-white-1 text-sm">
                      Wallet Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="walletAddress"
                        value={walletAddrInput}
                        onChange={(e) => setWalletAddrInput(e.target.value)}
                        placeholder="e.g. 0x1ABC7154748..."
                        className="pl-10 bg-gray-800 border-gray-700 text-white-1 placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 rounded-full"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white-1">
                        <Wallet size={22} />
                      </div>
                    </div>
                  </div>

                  {/* Btn - Connect Wallet */}
                  <Button
                    className="w-full bg-gradient-to-r from-slate-900 to-teal-400 hover:from-teal-400 hover:to-teal-400 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105 hover:rotate-1 hover:shadow-neon mt-5"
                  >
                    {connectingWallet ? "Processing..." : "Connect"}
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
      </motion.div >
    </Dialog >
  )
}

export default AddWalletPopUp