import React from "react";

const SignTransactionModal = ({ isOpen, onClose, onConfirm, isLoading, transactionDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" 
    style={{color: "black"}}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Sign Staking Transaction</h2>
        <p className="mb-4">
          You're about to sign a staking transaction with the following details:
        </p>
        <div className="mb-4">
          <p><strong>Stake Amount:</strong> {transactionDetails.stakeAmount} ETH</p>
          <p><strong>Gas Fee:</strong> {transactionDetails.gasFee} Gwei</p>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50' : 'hover:bg-blue-600'}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignTransactionModal;
