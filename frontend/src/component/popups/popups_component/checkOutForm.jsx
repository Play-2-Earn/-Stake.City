import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import ExpressCheckout from "./expressCheckout";

const checkOutForm = ({ addCoin, paymentAmount, localCurrency, STCLocalCurrencyRate, setAlertInfo, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

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

      setAlertInfo((prevState) => ({
        ...prevState,
        open: true,
        severity: 'error',
        message: error.message,
      }));
    } else if (paymentIntent.status == 'succeeded') {
      setAlertInfo((prevState) => ({
        ...prevState,
        open: true,
        severity: 'success',
        message: `Successfully added ${addCoin} STC !`,
      }));

      // Close Pop Up
      onClose();
    } else {
      setAlertInfo((prevState) => ({
        ...prevState,
        open: true,
        severity: 'error',
        message: `Unexpected State`,
      }));
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
          amount: paymentAmount,
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

  // Obtain Client Secret on Mount
  useEffect(() => {
    // Fetch Client Secret
    fetchClientSecret();
  }, [paymentAmount, localCurrency])

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
                setAlertInfo={setAlertInfo}
                onClose={onClose}
                clientSecret={clientSecret}
              />

              {/* Card Check Out */}
              <PaymentElement />
            </>
          }

          {/* Error Message */}
          {errorMessage && <div>{errorMessage}</div>}

          {/* Card Check Out Button */}
          <button
            disabled={!stripe || loading}
            className="w-full p-2 mt-4 mb-3 rounded-md font-extrabold disabled:opacity-50 disabled:animate-pulse bg-emarald-1 hover:bg-blue-2 text-blue-1 hover:text-white-1"
          >
            {loading ? "Processing.." : `Pay ${localCurrency.symbol}${paymentAmount}`}
          </button>

          {/* Conversion Rate 1STC = ? Local Currency */}
          <p className="text-xs text-gray-400 text-center w-full mt-0">
            1 STC ≈ {STCLocalCurrencyRate} {localCurrency.code.toUpperCase()}
          </p>

        </form>
      }
    </>
  )
}
export default checkOutForm