import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, XCircle, DollarSign, CheckCircle, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import SignTransactionModal from "../popups/transactionPopup";

const DropTaskPopup = ({ isOpen, onClose, onSuccess, lng, lat, verbalAddress }) => {
  const [step, setStep] = useState(0);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTransactionPopupOpen, setIsTransactionPopupOpen] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    stakeAmount: "0", 
    gasFee: "5",       
  });
  const handleYes = () => {
    setStep(1);
  };
  useEffect(() => {
    if (stakeAmount > 0) {
      setTransactionDetails(prevDetails => ({
        ...prevDetails,
        stakeAmount: stakeAmount
      }));
    }
  }, [stakeAmount]);
  const handleSubmit = async () => {
    try {
      const jwtToken = sessionStorage.getItem("jwtToken");
      console.log(jwtToken);
      const response = await fetch('http://localhost:5000/api/drop_task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          taskTitle,
          taskDescription,
          stakeAmount,
          lng,
          lat,
          verbalAddress,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Call onSuccess with the returned data if necessary
        onSuccess(data);
        // Optionally close the popup on success
        onClose();
      } else {
        // Handle errors
        console.error('Error creating task:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetAndClose = () => {
    if (isSuccess) onSuccess(true);
    setIsSuccess(false);
    setStep(0);
    setTaskDescription("");
    setStakeAmount("");
    onClose();
  };

  if (!isOpen) return null;

  // Renamed from handleSubmit to openStakingModal
  const openStakingModal = () => {
    setIsTransactionPopupOpen(true);
  };

  const confirmStakingTransaction = async () => {
    setIsLoading(true);
    try {
      // Simulate
      console.log("Staking transaction signed!");
      setIsTransactionPopupOpen(false);
      handleSubmit();
    } catch (error) {
      console.error("Error signing transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md bg-white rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.3)] overflow-hidden relative"
            style={{
              boxShadow: "0 10px 0 #2563EB, 0 20px 0 #1E40AF",
              border: "8px solid #3B82F6",
            }}
            initial={{ scale: 0.8, y: 50, rotateX: 20 }}
            animate={{ scale: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.8, y: 50, rotateX: 20 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 border-b-8 border-blue-700 relative">
              <div
                className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-20 z-0"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                }}
              ></div>
              <div className="flex justify-between items-center relative z-10">
                <h2
                  className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider filter drop-shadow-lg"
                  style={{ textShadow: "2px 2px 0 #2563EB" }}
                >
                  {step === 0
                    ? "New Task"
                    : step === 1
                    ? "Task Details"
                    : "Success!"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetAndClose}
                  className="text-white hover:text-yellow-300 transition-colors duration-200"
                >
                  <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                </Button>
              </div>
              <div className="flex items-center space-x-3 mt-2 relative z-10">
                <div className="flex items-center text-xs sm:text-sm text-white bg-blue-700 px-3 py-1 rounded-full shadow-inner">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>{verbalAddress}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 bg-gradient-to-b from-blue-100 to-white">
              {step === 0 && (
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-bold text-blue-800 mb-6">
                    Do you want to drop a task at this location?
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={handleYes}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full text-lg transform hover:scale-105 transition-all duration-200"
                      style={{ boxShadow: "0 4px 0 #059669" }}
                    >
                      Yes
                    </Button>
                    <Button
                      onClick={resetAndClose}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full text-lg transform hover:scale-105 transition-all duration-200"
                      style={{ boxShadow: "0 4px 0 #DC2626" }}
                    >
                      No
                    </Button>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                  <label
                      htmlFor="task-description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Task Title
                    </label>
                    <Input
                      style={{color: "black"}}
                      id="task-title"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="Enter task title"
                      className="w-full p-2 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <label
                      htmlFor="task-description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Task Description
                    </label>
                    <Textarea
                      style={{color: "black"}}
                      id="task-description"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Describe your task here..."
                      className="w-full p-2 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="stake-amount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Stake Amount (XLM)
                    </label>
                    <div className="relative">
                      <Input
                      style={{color: "black"}}
                        id="stake-amount"
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="Enter stake amount"
                        className="w-full pl-10 pr-4 py-2 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <img
                          src="/api/placeholder/24/24"
                          alt="Stellar logo"
                          className="w-5 h-5"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={openStakingModal}
                    disabled={!taskDescription || !stakeAmount || isLoading}
                    className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-lg transform hover:scale-105 transition-all duration-200 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{ boxShadow: "0 4px 0 #2563EB" }}
                  >
                    {isLoading ? (
                      <Loader className="animate-spin mr-2" />
                    ) : (
                      "Sign Transaction"
                    )}
                  </Button>

                  <SignTransactionModal
                    isOpen={isTransactionPopupOpen}
                    onClose={() => setIsTransactionPopupOpen(false)}
                    onConfirm={confirmStakingTransaction}
                    isLoading={isLoading}
                    transactionDetails={transactionDetails}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-xl font-bold text-blue-800 mb-6">
                    Task successfully dropped!
                  </p>
                  <Button
                    onClick={resetAndClose}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full text-lg transform hover:scale-105 transition-all duration-200"
                    style={{ boxShadow: "0 4px 0 #2563EB" }}
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DropTaskPopup;
