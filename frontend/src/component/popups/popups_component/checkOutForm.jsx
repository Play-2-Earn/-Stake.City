import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import ExpressCheckout from "./expressCheckout";
import useAlert from "../../../Hooks/useAlert";
import { useDispatch, useSelector } from "react-redux";
import { setWalletBalance } from "../../../Store/Slices/Wallet";

const API_BASE_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:5000"
  : process.env.Deployed_link;

const checkOutForm = ({ addCoin, totalPayable, localCurrency, STCLocalCurrencyRate, processFee, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const walletBalance = useSelector((state) => state.walletState.balance);
  const showAlert = useAlert();
  const dispatch = useDispatch();

  // Handler - Submit Stripe Form
  async function handleSubmit(e) {
    e.preventDefault();

    // Ceck if stripe is loaded
    if (!stripe || !elements) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    // Processing payment
    setLoading(true);

    // Create the PaymentIntent and obtain clientSecret
    fetchClientSecret();

    // Confirm the PaymentIntent using the details collected by the Payment Element
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: 'https://localhost:5173/explore'
      },
      redirect: 'if_required',
    });

    // Handle Payment Result
    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message);

      showAlert({ severity: "error", message: error.message });

    } else if (paymentIntent.status == 'succeeded') {
      const responseStatus = await updateWallet();

      if (responseStatus === 200) {
        // Update Wallet Balance
        dispatch(setWalletBalance(Number(walletBalance) + Number(addCoin)));

        // Show Alert Messafe
        showAlert({ severity: "success", message: `Successfully added ${addCoin} STC !` });
      }

      // Close Pop Up
      onClose();
    } else {
      showAlert({ severity: "error", message: "Unexpected State" });
    }

    // Done payment
    setLoading(false);
  }

  // API - Fetch Client Secret
  async function fetchClientSecret() {
    const API_BASE_URL = process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : process.env.Deployed_link;

    try {
      const response = await fetch(`${API_BASE_URL}/api/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPayable,
          currency: localCurrency.code,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('Error: ', response);
      } else {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch payment intent.');
    }
  }

  // API - Update Wallet Balance
  async function updateWallet() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/update_wallet`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          balance: addCoin,
        })
      })

      if (!response.ok) {
        throw new Error("Error updating wallet balance", response.status)
      }

      return response.status
    } catch (error) {
      console.error('Error Updating Wallet Balance', error.message);
    }
  }

  // Obtain Client Secret on Mount
  useEffect(() => {
    // Fetch Client Secret
    fetchClientSecret();
  }, [totalPayable, localCurrency])

  return (
    <>
      {(!stripe || !elements || !clientSecret) ?
        // Loading GIF
        <div className='flex justify-center bg-[#0D1B2A] bg-opacity-50 relative'>
          <img
            src="wallet-loading.gif"
            className='w-[10em] p-2 py-6'
          />
        </div>
        :
        // Payment Form
        <form
          onSubmit={handleSubmit}
          className="relative px-5 max-h-[27em] w-[33em] bg-[#0D1B2A] bg-opacity-100 overflow-auto py-4"
        >

          {clientSecret &&
            <>
              {/* Express Check Out */}
              <ExpressCheckout
                addCoin={addCoin}
                onClose={onClose}
                clientSecret={clientSecret}
              />

              {/* Card Check Out */}
              <PaymentElement />
            </>
          }

          {/* Error Message */}
          {errorMessage && <div>{errorMessage}</div>}

          {/* Payment Details */}
          <div className="mt-5 flex flex-col text-sm text-gray-400 px-2 font-mono">
            <span className="text-gray-300 text-lg">Payment Details</span>

            {/* Line */}
            <div className="flex-grow border-t border-gray-500 mt-1"></div>

            {/* Stake Coins Amount */}
            <div className="flex flex-row justify-between mt-1">
              <p>Stake Coin</p>
              <p>{addCoin} STC</p>
            </div>

            {/* Conversion Rate */}
            <div className="flex flex-row justify-between">
              <p>Conversion Rate</p>
              <p>1 STC ≈ {STCLocalCurrencyRate} {localCurrency.code.toUpperCase()}</p>
            </div>

            {/* Processing Fee */}
            <div className="flex flex-row justify-between">
              <p>Processing Fee ({processFee * 100}%)</p>
              <p>{(totalPayable - totalPayable / (1 + processFee)).toFixed(2)} {localCurrency.code.toUpperCase()}</p>
            </div>

            {/* Total */}
            <div className="flex flex-row justify-between">
              <p>Total Payable</p>
              <p>{totalPayable} {localCurrency.code.toUpperCase()}</p>
            </div>
          </div>

          {/* Line */}
          <div className="flex-grow border-t border-gray-500 mt-1"></div>

          {/* Card Check Out Button */}
          <button
            disabled={!stripe || loading}
            className="w-full p-2 mt-3 mb-1 rounded-md font-extrabold disabled:opacity-50 disabled:animate-pulse bg-emarald-1 hover:bg-blue-2 text-blue-1 hover:text-white-1"
          >
            {loading ? "Processing.." : `Pay ${localCurrency.symbol}${totalPayable}`}
          </button>

        </form>
      }
    </>
  )
}
export default checkOutForm