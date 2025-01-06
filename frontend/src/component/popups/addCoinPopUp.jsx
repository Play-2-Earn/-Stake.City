import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Button from "./popups_component/button";
import CheckOutForm from './popups_component/checkOutForm';
import useAlert from '../../Hooks/useAlert';
import { useDispatch } from 'react-redux';

// Stripe Form Style
const appearance = {
  theme: 'night',
  labels: 'floating'
};

// Constants
const CURRENCY_KEY = import.meta.env.VITE_CURRENCY_API_KEY
const PROCESSING_FEE = 0.03; // 3%
const countryCurrencyMap = {
  "af": { code: "afn", symbol: "؋" }, // Afghanistan
  "al": { code: "lek", symbol: "L" }, // Albania
  "dz": { code: "dzd", symbol: "دج" }, // Algeria
  "ad": { code: "eur", symbol: "€" }, // Andorra
  "ao": { code: "aoa", symbol: "Kz" }, // Angola
  "ar": { code: "ars", symbol: "$" }, // Argentina
  "am": { code: "amd", symbol: "֏" }, // Armenia
  "au": { code: "aud", symbol: "$" }, // Australia
  "at": { code: "eur", symbol: "€" }, // Austria
  "az": { code: "azn", symbol: "₼" }, // Azerbaijan
  "bh": { code: "bhd", symbol: ".د.ب" }, // Bahrain
  "bd": { code: "bdt", symbol: "৳" }, // Bangladesh
  "bb": { code: "bbd", symbol: "$" }, // Barbados
  "by": { code: "byn", symbol: "Br" }, // Belarus
  "be": { code: "eur", symbol: "€" }, // Belgium
  "bz": { code: "bzd", symbol: "$" }, // Belize
  "bj": { code: "cfa", symbol: "XOF" }, // Benin
  "bt": { code: "btn", symbol: "Nu." }, // Bhutan
  "bo": { code: "bob", symbol: "Bs." }, // Bolivia
  "ba": { code: "bam", symbol: "KM" }, // Bosnia and Herzegovina
  "bw": { code: "bwp", symbol: "P" }, // Botswana
  "br": { code: "brl", symbol: "R$" }, // Brazil
  "bn": { code: "bnd", symbol: "$" }, // Brunei
  "bg": { code: "bgn", symbol: "лв" }, // Bulgaria
  "bf": { code: "cfa", symbol: "XOF" }, // Burkina Faso
  "bi": { code: "bif", symbol: "FBu" }, // Burundi
  "kh": { code: "khr", symbol: "៛" }, // Cambodia
  "cm": { code: "cfa", symbol: "XAF" }, // Cameroon
  "ca": { code: "cad", symbol: "$" }, // Canada
  "cv": { code: "cvd", symbol: "$" }, // Cape Verde
  "cf": { code: "cfa", symbol: "CFA" }, // Central African Republic
  "td": { code: "cfa", symbol: "CFA" }, // Chad
  "cl": { code: "clp", symbol: "$" }, // Chile
  "cn": { code: "cny", symbol: "¥" }, // China
  "co": { code: "cop", symbol: "$" }, // Colombia
  "km": { code: "kmf", symbol: "KMF" }, // Comoros
  "cg": { code: "cdf", symbol: "FCFA" }, // Congo (Congo-Brazzaville)
  "cd": { code: "cdf", symbol: "CFA" }, // Congo (Congo-Kinshasa)
  "cr": { code: "crc", symbol: "₡" }, // Costa Rica
  "ci": { code: "cfa", symbol: "CFA" }, // Côte d'Ivoire
  "hr": { code: "hrk", symbol: "kn" }, // Croatia
  "cu": { code: "cup", symbol: "$" }, // Cuba
  "cy": { code: "cyp", symbol: "€" }, // Cyprus
  "cz": { code: "czk", symbol: "Kč" }, // Czech Republic
  "dk": { code: "dkk", symbol: "kr" }, // Denmark
  "dj": { code: "djf", symbol: "Fdj" }, // Djibouti
  "dm": { code: "dmt", symbol: "$" }, // Dominica
  "do": { code: "dop", symbol: "$" }, // Dominican Republic
  "ec": { code: "usd", symbol: "$" }, // Ecuador
  "eg": { code: "egp", symbol: "£" }, // Egypt
  "sv": { code: "usd", symbol: "$" }, // El Salvador
  "gq": { code: "xaf", symbol: "XAF" }, // Equatorial Guinea
  "er": { code: "ern", symbol: "Nfk" }, // Eritrea
  "ee": { code: "eek", symbol: "kr" }, // Estonia
  "et": { code: "etb", symbol: "ታብ" }, // Ethiopia
  "fj": { code: "fjd", symbol: "FJ$" }, // Fiji
  "fi": { code: "eur", symbol: "€" }, // Finland
  "fr": { code: "eur", symbol: "€" }, // France
  "ga": { code: "cfa", symbol: "XAF" }, // Gabon
  "gm": { code: "gmd", symbol: "D" }, // Gambia
  "ge": { code: "gel", symbol: "₾" }, // Georgia
  "de": { code: "eur", symbol: "€" }, // Germany
  "gh": { code: "ghs", symbol: "₵" }, // Ghana
  "gr": { code: "eur", symbol: "€" }, // Greece
  "gd": { code: "gdp", symbol: "$" }, // Grenada
  "gt": { code: "gtq", symbol: "Q" }, // Guatemala
  "gn": { code: "gnf", symbol: "GNF" }, // Guinea
  "gw": { code: "cfa", symbol: "XOF" }, // Guinea-Bissau
  "gy": { code: "gyd", symbol: "$" }, // Guyana
  "ht": { code: "htg", symbol: "G" }, // Haiti
  "hn": { code: "hnd", symbol: "L" }, // Honduras
  "hk": { code: "hkd", symbol: "$" }, // Hong Kong
  "hu": { code: "huf", symbol: "Ft" }, // Hungary
  "is": { code: "isk", symbol: "kr" }, // Iceland
  "in": { code: "inr", symbol: "₹" }, // India
  "id": { code: "idr", symbol: "Rp" }, // Indonesia
  "ir": { code: "irr", symbol: "﷼" }, // Iran
  "iq": { code: "iqd", symbol: "ع.د" }, // Iraq
  "ie": { code: "eur", symbol: "€" }, // Ireland
  "il": { code: "ils", symbol: "₪" }, // Israel
  "it": { code: "eur", symbol: "€" }, // Italy
  "jm": { code: "jmd", symbol: "J$" }, // Jamaica
  "jp": { code: "jpy", symbol: "¥" }, // Japan
  "jo": { code: "jod", symbol: "د.ا" }, // Jordan
  "kz": { code: "kzt", symbol: "₸" }, // Kazakhstan
  "ke": { code: "kes", symbol: "KSh" }, // Kenya
  "ki": { code: "australian dollar", symbol: "$" }, // Kiribati
  "kr": { code: "krw", symbol: "₩" }, // South Korea
  "kw": { code: "kwd", symbol: "د.ك" }, // Kuwait
  "kg": { code: "kyrgyzstani som", symbol: "лв" }, // Kyrgyzstan
  "la": { code: "kip", symbol: "₭" }, // Laos
  "lv": { code: "eur", symbol: "€" }, // Latvia
  "lb": { code: "lbp", symbol: "ل.ل" }, // Lebanon
  "ls": { code: "lsl", symbol: "M" }, // Lesotho
  "lr": { code: "lrd", symbol: "$" }, // Liberia
  "ly": { code: "lyd", symbol: "ل.د" }, // Libya
  "li": { code: "chf", symbol: "₣" }, // Liechtenstein
  "lt": { code: "ltu", symbol: "₾" }, // Lithuania
  "lu": { code: "euro", symbol: "€" }, // Luxembourg
  "mk": { code: "denar", symbol: "ден" }, // North Macedonia
  "mg": { code: "mga", symbol: "MGA" }, // Madagascar
  "mw": { code: "mwk", symbol: "MK" }, // Malawi
  "my": { code: "myr", symbol: "RM" }, // Malaysia
  "mv": { code: "mvr", symbol: "Rf" }, // Maldives
  "ml": { code: "cfa", symbol: "CFA" }, // Mali
  "mt": { code: "mtl", symbol: "Lm" }, // Malta
  "mh": { code: "mhl", symbol: "USD" }, // Marshall Islands
  "mr": { code: "mrn", symbol: "UM" }, // Mauritania
  "mu": { code: "mru", symbol: "MUR" }, // Mauritius
  "mx": { code: "mxn", symbol: "$" }, // Mexico
  "fm": { code: "micronesian", symbol: "$" }, // Micronesia
  "md": { code: "mdl", symbol: "MDL" }, // Moldova
  "mc": { code: "mco", symbol: "€" }, // Monaco
  "mn": { code: "mng", symbol: "₮" }, // Mongolia
  "me": { code: "eur", symbol: "€" }, // Montenegro
  "ma": { code: "mad", symbol: "MAD" }, // Morocco
  "mz": { code: "mzn", symbol: "MT" }, // Mozambique
  "mm": { code: "mmk", symbol: "Ks" }, // Myanmar (Burma)
  "na": { code: "nad", symbol: "$" }, // Namibia
  "nr": { code: "aud", symbol: "$" }, // Nauru
  "nl": { code: "eur", symbol: "€" }, // Netherlands
  "nz": { code: "nzd", symbol: "$" }, // New Zealand
  "ni": { code: "nicaraguan córdoba", symbol: "C$" }, // Nicaragua
  "ne": { code: "xaf", symbol: "CFA" }, // Niger
  "ng": { code: "ngn", symbol: "₦" }, // Nigeria
  "no": { code: "nok", symbol: "kr" }, // Norway
  "np": { code: "npr", symbol: "NPR" }, // Nepal
  "om": { code: "omr", symbol: "ر.ع" }, // Oman
  "pk": { code: "pkr", symbol: "₨" }, // Pakistan
  "pa": { code: "panama", symbol: "$" }, // Panama
  "py": { code: "pyg", symbol: "₲" }, // Paraguay
  "pe": { code: "pen", symbol: "S/" }, // Peru
  "ph": { code: "php", symbol: "₱" }, // Philippines
  "pl": { code: "pln", symbol: "zł" }, // Poland
  "pt": { code: "eur", symbol: "€" }, // Portugal
  "qa": { code: "qar", symbol: "ر.ق" }, // Qatar
  "re": { code: "re", symbol: "EUR" }, // Réunion (French overseas territory)
  "ro": { code: "ron", symbol: "RON" }, // Romania
  "ru": { code: "rub", symbol: "₽" }, // Russia
  "rw": { code: "rwf", symbol: "FRW" }, // Rwanda
  "kn": { code: "kna", symbol: "$" }, // Saint Kitts and Nevis
  "lc": { code: "lca", symbol: "$" }, // Saint Lucia
  "vc": { code: "vct", symbol: "$" }, // Saint Vincent and the Grenadines
  "ws": { code: "wst", symbol: "T" }, // Samoa
  "sm": { code: "euro", symbol: "€" }, // San Marino
  "st": { code: "stp", symbol: "Db" }, // São Tomé and Príncipe
  "sa": { code: "sar", symbol: "ر.س" }, // Saudi Arabia
  "sn": { code: "xaf", symbol: "CFA" }, // Senegal
  "rs": { code: "rsd", symbol: "дин" }, // Serbia
  "sc": { code: "scr", symbol: "₨" }, // Seychelles
  "sl": { code: "sll", symbol: "Le" }, // Sierra Leone
  "sg": { code: "sgd", symbol: "$" }, // Singapore
  "sk": { code: "skk", symbol: "Sk" }, // Slovakia
  "si": { code: "sit", symbol: "SIT" }, // Slovenia
  "so": { code: "sos", symbol: "Sh" }, // Somalia
  "za": { code: "zar", symbol: "R" }, // South Africa
  "es": { code: "eur", symbol: "€" }, // Spain
  "lk": { code: "lkr", symbol: "Rs" }, // Sri Lanka
  "sd": { code: "sdg", symbol: "£" }, // Sudan
  "sr": { code: "srd", symbol: "$" }, // Suriname
  "se": { code: "sek", symbol: "kr" }, // Sweden
  "ch": { code: "chf", symbol: "₣" }, // Switzerland
  "sy": { code: "syp", symbol: "ل.س" }, // Syria
  "tj": { code: "tjs", symbol: "SM" }, // Tajikistan
  "th": { code: "thb", symbol: "฿" }, // Thailand
  "tg": { code: "togo", symbol: "XOF" }, // Togo
  "tk": { code: "tkg", symbol: "K" }, // Tokelau
  "to": { code: "top", symbol: "T$" }, // Tonga
  "tt": { code: "ttd", symbol: "$" }, // Trinidad and Tobago
  "TN": { code: "TND", symbol: "د.ت" }, // Tunisia
  "tr": { code: "try", symbol: "₺" }, // Turkey
  "tm": { code: "tmr", symbol: "TMT" }, // Turkmenistan
  "tc": { code: "tct", symbol: "TCT" }, // Turks and Caicos Islands
  "tv": { code: "aud", symbol: "$" }, // Tuvalu
  "ug": { code: "ugx", symbol: "USh" }, // Uganda
  "ua": { code: "uah", symbol: "₴" }, // Ukraine
  "ae": { code: "aed", symbol: "د.إ" }, // United Arab Emirates
  "gb": { code: "gbp", symbol: "£" }, // United Kingdom
  "us": { code: "usd", symbol: "$" }, // United States
  "uy": { code: "uyc", symbol: "$" }, // Uruguay
  "uz": { code: "uzs", symbol: "лв" }, // Uzbekistan
  "vu": { code: "vuv", symbol: "Vt" }, // Vanuatu
  "ve": { code: "vef", symbol: "Bs.F" }, // Venezuela
  "vn": { code: "vnd", symbol: "₫" }, // Vietnam
  "wf": { code: "wfp", symbol: "XOF" }, // Wallis and Futuna
  "ye": { code: "yen", symbol: "ر.ي" }, // Yemen
  "zm": { code: "zmw", symbol: "ZK" }, // Zambia
  "zw": { code: "zwd", symbol: "$" }  // Zimbabwe
};


const AddCoinPopUp = ({ isOpen, setOpen }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [addCoin, setAddCoin] = useState(null);
  const [totalPayable, setTotalPayable] = useState(null);
  const [addingCoin, setAddingCoin] = useState(false);
  const [STCLocalCurrencyRate, setSTCLocalCurrencyRate] = useState();
  const [openStripe, setOpenStripe] = useState(false);
  const [localCurrency, setLocalCurrency] = useState({ code: 'usd', symbol: '$' });
  const showAlert = useAlert();

  // Utils - Determine Currency based on Longitude Latitude
  async function determineCurrency(lat, lon) {
    // https://nominatim.org/release-docs/develop/api/Reverse/
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);

      const data = await response.json();
      const address = data.address;
      const countryCode = address.country_code;

      // Map currency
      if (response.ok) {
        return countryCurrencyMap[countryCode] || { code: "usd", symbol: "$" };
      }
    } catch (error) {
      console.error('Error retireving location:', error);
    }

    // Default return value if no match found or error occurs
    return { code: 'usd', symbol: '$' };
  };

  // Get User Location & Local Currency
  async function getLocationCurrency() {
    // No error checking required, default currency to USD if error
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const currency = await determineCurrency(latitude, longitude);

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

    // Validate input
    if (!addCoin) {
      showAlert({ severity: "error", message: "Please Enter a Valid Amount." });
      return;
    }

    try {
      // Constants
      const STC_USD_RATE = 1; // 1 USD = 1 STC
      const stcUsd = 1 / STC_USD_RATE; // STC/USD conversion rate
      const usdAmount = (addCoin * stcUsd).toFixed(2);

      // Currency conversion
      const currencyRate = localCurrency.code !== 'usd'
        ? await fetchExchangeRate() || 1
        : 1;

      // Calculate payable amount
      const convertedAmount = usdAmount * currencyRate;
      const payable = (convertedAmount * (1 + PROCESSING_FEE)).toFixed(2);

      // Update state
      setTotalPayable(payable);
      setSTCLocalCurrencyRate(stcUsd * currencyRate);
      setOpenStripe(true);
    } catch (error) {
      // Calculate payable
      const payable = (usdAmount * (1 + PROCESSING_FEE)).toFixed(2);

      // Set states
      setTotalPayable(payable);
      setLocalCurrency({ code: 'usd', symbol: '$' })
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
                    amount: Math.round(totalPayable * 100),
                    currency: localCurrency.code,
                    appearance,
                  }}
                >
                  <CheckOutForm
                    addCoin={addCoin}
                    totalPayable={totalPayable}
                    localCurrency={localCurrency}
                    STCLocalCurrencyRate={STCLocalCurrencyRate}
                    processFee={PROCESSING_FEE}
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
