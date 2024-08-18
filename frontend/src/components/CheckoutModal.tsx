import React from "react";
import { IoIosClose } from "react-icons/io";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;
  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Confirm Checkout</h2>
            <button>
              <IoIosClose className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <p className="mb-4">
            Are you sure you want to proceed with the checkout?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              className="bg-red-600 text-white py-2 px-4 rounded-lg"
              onClick={() => {
                onClose();
                onConfirm();
              }}
            >
              Confirm
            </button>
            <button
              className="bg-gray-300 py-2 px-4 rounded-lg"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
