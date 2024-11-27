import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAlertOpen } from "../../Store/Slices/Alert";

function AlertMessage() {
  const { alertMsg, alertSeverity } = useSelector((state) => state.alertState)
  const dispatch = useDispatch();

  // Handler - On Close
  function onClose() {
    dispatch(setAlertOpen(false))
  }

  // Automatically close the alert after 2 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer); // Clear timer if component unmounts early
  }, [onClose]);

  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 15, stiffness: 120 }}
      className="fixed top-0 mt-5 text-{#F0F3F5]} z-[100] w-full"
    >
      <div className={`flex items-center justify-between gap-2 text-sm w-fit ${alertSeverity == 'success' ? 'bg-[#4aa45d]' : "bg-[#ea4b4b]"} p-2 px-4 rounded-lg  mx-auto shadow-[0_0_15px_rgba(51,102,156,0.9)]`}>
        <span>{alertMsg}</span>
        <button
          type='button'
          onClick={onClose}
          className="hover:text-gray-300 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
export default AlertMessage