import { useElements, useStripe } from "@stripe/react-stripe-js";
import { ExpressCheckoutElement } from '@stripe/react-stripe-js';

const expressCheckout = ({ addCoin, setAlertInfo, onClose, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();

  // Payment Button Styling
  const expressCheckoutOptions = {
    buttonType: {
      applePay: 'plain',
      googlePay: 'plain',
      paypal: 'paypal',
    },
    buttonTheme: {
      applePay: 'white-outline',
      googlePay: 'white',
      paypal: 'gold',
    },
    buttonHeight: 40,
    paymentMethodOrder: ['applePay', 'googlePay', 'paypaal'],
  }

  // On each payment method click
  const onClick = ({ resolve }) => {
    const options = {
      emailRequired: true
    };
    resolve(options);
  };

  // On confirm payment
  const onConfirm = async () => {
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

    // Confirm the PaymentIntent using the details collected by the Payment Element
    const { error, paymentIntent } = await stripe.confirmPayment({
      // `Elements` instance that's used to create the Express Checkout Element.
      elements,
      // `clientSecret` from the created PaymentIntent
      clientSecret,
      confirmParams: {
        return_url: 'https://localhost:5173/explore',
      },
      redirect: 'if_required',
    });

    // Handler Payment Result
    if (error) {
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
  };

  return (
    <div className="pb-5">
      <ExpressCheckoutElement
        options={expressCheckoutOptions}
        onClick={onClick}
        onConfirm={onConfirm}
      />

      <div className="flex items-center justify-center w-full mt-4">
        <div className="flex-grow border-t border-gray-500 mr-3"></div>
        <span className="text-gray-1">or</span>
        <div className="flex-grow border-t border-gray-500 ml-3"></div>
      </div>
    </div>
  )
}
export default expressCheckout;