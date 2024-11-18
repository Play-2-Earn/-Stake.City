import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Button from "./popups_component/button";
import CheckOutForm from './popups_component/checkOutForm';

// Stripe Form Style
const appearance = {
  theme: 'night',
  labels: 'floating'

};
const CURRENCY_KEY = import.meta.env.VITE_CURRENCY_API_KEY

const AddCoinPopUp = ({ isOpen, setOpen, updateWalletBalance, setAlertInfo }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [addCoin, setAddCoin] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(null);
  const [addingCoin, setAddingCoin] = useState(false);
  const [STCLocalCurrencyRate, setSTCLocalCurrencyRate] = useState();
  const [openStripe, setOpenStripe] = useState(false);
  const [localCurrency, setLocalCurrency] = useState({ code: 'usd', symbol: '$' });

  // Utils - Determine Currency based on Longitude Latitude
  function determineCurrency(lat, lon) {
    // USD - United States (include Alaska & Hawaii)
    if (lat >= 18 && lat <= 72 && lon >= -178 && lon <= -67) {
      return { code: 'usd', symbol: '$' };
    }

    // GBP - United Kingdom
    if (lat >= 49 && lat <= 61 && lon >= -8 && lon <= 2) {
      return { code: 'gbp', symbol: '£' };
    }

    // AED - United Arab Emirates
    if (lat >= 22 && lat <= 26 && lon >= 51 && lon <= 57) {
      return { code: 'aed', symbol: 'د.إ' };
    }

    // EUR - Europe Continent
    if (
      (lat >= 35 && lat <= 72 && lon >= -9 && lon <= 68)
    ) {
      return { code: 'eur', symbol: '€' };
    }

    // If no match found
    return { code: 'usd', symbol: '$' };
  };

  // Get User Location & Local Currency
  function getLocationCurrency() {
    // No error checking required, default currency to USD if error
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const currency = determineCurrency(latitude, longitude);

          setLocalCurrency(currency);
        },
      );
    }
  }

  // Handler - On Pop Up Close
  function onPopUpClose() {
    setOpen(false);
    setAddCoin(null);
    setAddingCoin(false);
    setOpenStripe(false);
  }

  // Handler - Continue to Stripe Payment after Submit
  async function handleSubmit(e) {
    e.preventDefault();

    // Check form is valid
    if (!addCoin) {
      setAlertInfo((prevState) => ({
        ...prevState,
        open: true,
        severity: 'error',
        message: 'Please Enter a Valid Amount.',
      }))
      return;
    }

    // Calc 1 STC in USD (e.g. 1USD = 1STC)
    const stcUsdRate = 1;
    const stcUsd = 1 / stcUsdRate;
    const usdAmount = (addCoin * stcUsd).toFixed(2);

    // Convert paymentAmount to local currency (skip if USD)
    if (localCurrency.code != 'usd') {
      // Get latest exchange rate (1 USD = ?GBP)
      const currencyRate = await fetchExchangeRate();

      // Convert and set paymentAmount
      if (currencyRate) {
        const convertedAmount = usdAmount * currencyRate;
        const roundedAmount = convertedAmount.toFixed(2);
        setPaymentAmount(roundedAmount);
        setSTCLocalCurrencyRate(stcUsd * currencyRate);
      } else {
        // Set to USD if ever fail to convert
        setPaymentAmount(usdAmount);
        setLocalCurrency({ code: 'usd', symbol: '$' })
      }
    } else {
      setPaymentAmount(usdAmount);
    }

    // Show Stripe Payment Gateway
    setOpenStripe(true);
  }

  // API - Fetch Stripe Public Key
  async function fetchStripePublickKey() {
    const API_BASE_URL = process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : process.env.Deployed_link;

    try {
      const response = await fetch(`${API_BASE_URL}/api/get-stripe-public`);
      const data = await response.json();

      if (response.ok) {
        const stripePromise = loadStripe(data.stripe_publicKey);
        setStripePromise(stripePromise);
      }
    } catch (error) {
      console.error('Error configuring stripe:', error);
    }
  }

  // API - Fetch Latest Exchange Rates
  async function fetchExchangeRate() {
    const currencyCode = localCurrency.code.toUpperCase();
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${CURRENCY_KEY}/pair/USD/${currencyCode}`, {
        method: 'GET',
        headers: {
          "Content-Type": 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        return data.conversion_rate;
      }

    } catch (error) {
      console.error("Error retireving exchange rate:", error);
      return null;
    }
  }

  useEffect(() => {
    // Set Up Stripe Promise
    fetchStripePublickKey();

    // Get User Location & Currency
    getLocationCurrency();
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
          className="w-fit min-w-[25em] max-w-[39em] bg-gray-900 rounded-3xl shadow-[0_0_30px_rgba(0,255,255,0.3)] overflow-hidden relative border-2 border-[#33669C]"
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

            {/* Dialog Content */}
            {/* Stripe Check Out Form */}
            {openStripe && stripePromise &&
              <>
                <Elements
                  stripe={stripePromise}
                  options={{
                    mode: 'payment',
                    amount: Math.round(paymentAmount * 100),
                    currency: localCurrency.code,
                    appearance,
                  }}
                >
                  <CheckOutForm
                    addCoin={addCoin}
                    paymentAmount={paymentAmount}
                    localCurrency={localCurrency}
                    STCLocalCurrencyRate={STCLocalCurrencyRate}
                    setAlertInfo={setAlertInfo}
                    onClose={onPopUpClose}
                  />
                </Elements>
              </>
            }

            {/* Add Coin Form */}
            {!openStripe &&
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
                      id="addCoin"
                      type="number"
                      placeholder='Enter Coin'
                      value={addCoin ? addCoin : ''}
                      onChange={(e) => setAddCoin(e.target.value)}
                      className="bg-transparent focus:outline-none border-b border-b-[#20C997] text-center w-[80%] placeholder:text-sm text-md text-[#F0F3F5] focus:border-b-cyan-300"
                    />

                    {/* Buttons - Predefined Amounts */}
                    <div className='flex flex-row gap-2 mt-2'>
                      <AmountButton
                        amount={100}
                        onClick={(e) => { e.preventDefault(); setAddCoin(100) }}
                      />
                      <AmountButton
                        amount={300}
                        onClick={(e) => { e.preventDefault(); setAddCoin(300) }}
                      />
                      <AmountButton
                        amount={900}
                        onClick={(e) => { e.preventDefault(); setAddCoin(900) }}
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
            }

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