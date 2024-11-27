import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Popover from '@radix-ui/react-popover';
import { X } from "lucide-react";
import { LuWallet } from "react-icons/lu";
import { FaMoneyBills } from "react-icons/fa6";
import { RiHandCoinLine } from "react-icons/ri";
import { IoCopy } from "react-icons/io5";
import AddWalletNote from "../popups/addWalletNote";
import AddWalletPopUp from '../popups/addWalletPopUp';
import RedeemCoinPopUp from "../popups/redeemCoinPopUp";
import AddCoinPopUp from "../popups/addCoinPopUp";
import { formatFiat } from "../lib/utils.js";
import { useDispatch, useSelector } from "react-redux";

const WalletInfo = ({ userData }) => {
  // const [walletBalance, setwalletBalance] = useState(0);
  const dispatch = useDispatch();
  const walletBalance = useSelector((state) => state.walletState.balance)
  const walletAddr = useSelector((state) => state.walletState.wallet_addr)
  const [usdBalance, setUsdBalance] = useState(0)
  const [openWalletDetail, setOpenWalletDetail] = useState(false);
  const [openAddWallet, setOpenAddWallet] = useState(false);
  const [openRedeemCoin, setOpenRedeemCoin] = useState(false);
  const [openAddCoin, setOpenAddCoin] = useState(false);
  const [openNote, setOpenNote] = useState(false);
  const [tolltipText, setTooltipText] = useState('Copy to clipboard');

  // Handler - Copy to Clipboard
  function handleCopy() {
    navigator.clipboard.writeText(walletAddr);
    setTooltipText("Copied!"); // Temporarily change tooltip text

    // Reset tooltip text after a short delay
    setTimeout(() => setTooltipText("Copy to clipboard"), 2000);
  };

  // Handler - Open Redeem Coin Pop Up
  function handleOpenRedeemCoin() {
    if (walletAddr) {
      setOpenRedeemCoin(true) // Open Redeem Wallet Pop Up
    } else {
      setOpenNote(true); // Open note before Add Wallet Pop Up
    }
  }

  // Convert Wallet Balance STC to USD on Mount
  useEffect(() => {
    // Convert to USD Rate
    // 1 Stake Coin = 1 USD
    const rate = 1
    const convertedBalance = (walletBalance * rate)
    setUsdBalance(convertedBalance);
  }, [walletBalance])

  return (
    <>
      {/* Wallet */}
      <div className="fixed top-[20px] right-[20px] z-[1000] opacity-95">
        <Popover.Root open={openWalletDetail} onOpenChange={(open) => setOpenWalletDetail(open)}>
          {/* Btn - Wallet Icon */}
          <Popover.Trigger>
            <div
              onClick={() => setOpenWalletDetail(true)}
              className="bg-gradient-to-r from-[#0D1B2A] to-[#33669C] p-[10px] rounded-full text-[#20C997] border-[#20C997] border shadow-[0_0_10px_#20C997] hover:scale-[120%] transition-transform pointer-events-none cursor-none"
            >
              <LuWallet size={23} />
            </div>
          </Popover.Trigger>

          {/* Pop Up - Wallet Details */}
          <AnimatePresence>
            {openWalletDetail && (
              <motion.div
                initial={{ opacity: 0, x: 10, y: -15 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 10, y: -20 }}
                transition={{ duration: 0.1, ease: "easeIn" }}
              >
                <Popover.Content
                  className="absolute -top-2 right-[-1.5em] w-fit flex flex-col items-center gap-1 py-3 pb-5 px-4 rounded-lg bg-[#0D1B2A] bg-opacity-100 border-[#20C997] shadow-[0_0_10px_#20C997] overflow-hidden xs:bg-opacity-100"
                  key="wallet-detail"
                >
                  {/*  Btn - Close Wallet Details */}
                  <button
                    onClick={() => setOpenWalletDetail(false)}
                    className="absolute w-1 h-1 hover:text-[#20C997] top-[9px] right-[25px] z-10">
                    <X size={15} />
                  </button>

                  {/* Title - Wallet Balance */}
                  <span className="text-sm text-center text-[#F0F3F5] w-full pointer-events-none">
                    {userData.full_name}'s Balance
                  </span>

                  {/* Info - Wallet Address */}
                  {walletAddr ?
                    <div
                      onClick={handleCopy}
                      className="relative flex flex-row items-center gap-2 hover:bg-gray-700 px-2 rounded-xl group cursor-pointer"
                    >
                      <span className="text-xs font-thin text-gray-500 w-[5em] text-center overflow-hidden">
                        {`${walletAddr.slice(0, 4)}...${walletAddr.slice(-3)}`}
                      </span>
                      <IoCopy size={10} />

                      {/* Tooltip */}
                      <>
                        <div className="absolute px-2 py-1 top-[2.5em] -right-[1em] bg-gray-700 text-white text-xs rounded-md opacity-0 text-center text-nowrap group-hover:opacity-100 transition-opacity duration-200 z-10">
                          {tolltipText}
                        </div>
                        <div className="bg-gray-700 w-2 h-2 absolute top-[26px] right-[0.5em] opacity-0 group-hover:opacity-100 transition-opacity duration-200 rotate-45 z-0" />
                      </>
                    </div>
                    :
                    <span className="text-xs font-thin text-gray-500 w-full text-center text-nowrap pointer-events-none">
                      <em>connect wallet</em>
                    </span>
                  }

                  {/* Stake Coin Icon */}
                  <img
                    className="w-[5.6em] h-auto mt-6 rounded-full animate-pulseGlow"
                    src="/wallet-coin.png"
                  />

                  {/* Balance - Stake Coins */}
                  <div className="flex flex-col items-center mt-1">
                    <span className="text-lg">
                      {formatFiat(walletBalance, 4)} STC
                    </span>

                    <span className="text-xs text-gray-500 font-light">
                      ${formatFiat(usdBalance, 4)} USD
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-row gap-3 mt-6">
                    {/* Btn - Redeeem Coin */}
                    <WalletButton
                      title="Redeem"
                      icon={<RiHandCoinLine size={20} />}
                      onClickHandler={() => handleOpenRedeemCoin()}
                    />

                    {/* Btn - Add Coin */}
                    <WalletButton
                      title="Add"
                      icon={<FaMoneyBills size={20} />}
                      onClickHandler={() => setOpenAddCoin(true)}
                    />
                  </div>
                </Popover.Content>
              </motion.div>
            )}
          </AnimatePresence>
        </Popover.Root>
      </div>

      {/* Pop Up - Note before Connect Wallet */}
      {openNote &&
        <AddWalletNote
          isOpen={openNote}
          setOpenNote={setOpenNote}
          setOpenAddWallet={setOpenAddWallet}
        />
      }

      {/* Pop Up - Connect Wallet */}
      {openAddWallet &&
        <AddWalletPopUp
          isOpen={openAddWallet}
          setOpenAddWallet={setOpenAddWallet}
          setOpenRedeemCoin={setOpenRedeemCoin}
        />
      }

      {/* Pop Up - Redeem Stake Coin */}
      <RedeemCoinPopUp
        isOpen={openRedeemCoin}
        setOpen={setOpenRedeemCoin}
      />

      {/* Pop Up - Add Stake Coins */}
      <AddCoinPopUp
        isOpen={openAddCoin}
        setOpen={setOpenAddCoin}
      />
    </>
  )
}
export default WalletInfo

// Customized Button
const WalletButton = ({ title, icon, onClickHandler }) => {
  const [buttonText, setButtonText] = useState(title);
  return (
    <div>
      <button
        onClick={onClickHandler}
        onMouseEnter={() => setButtonText(icon)}
        onMouseLeave={() => setButtonText(title)}
        className="bg-gradient-to-r from-[#0D1B2A] to-[#33669C] hover:from-teal-400 hover:to-teal-400 text-[#F0F3F5] font-bold py-1 px-4 rounded-full transition-all duration-200 transform hover:scale-105 hover:rotate-1 hover:shadow-neon border border-[#33669C] text-sm w-[7em] h-[2.2em] flex justify-center items-center hover:text-[#0D1B2A]"
      >
        {buttonText}
      </button>
    </div>
  )
};

