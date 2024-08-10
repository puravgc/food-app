import React from "react";

const PaymentOptions = ({ paymentOption, setpaymentOption }) => {
  return (
    <div className="bg-gray-100 rounded-lg pb-3 flex flex-col justify-center items-center">
      <h3 className="mb-5 text-lg font-medium text-gray-500">
        Choose Payment Method:
      </h3>
      <ul className="flex gap-2">
        <li>
          <input
            type="radio"
            id="cod-option"
            name="payment"
            value="Cash on Delivery"
            className="hidden peer"
            checked={paymentOption === "Cash on Delivery"}
            onChange={(e) => setpaymentOption(e.target.value)}
          />
          <label
            htmlFor="cod-option"
            className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 hover:text-gray-600 hover:bg-gray-200"
          >
            <div className="block">
              <div className="w-full flex justify-center items-center">
                <img src="/cod.png" alt="Cash on Delivery" className="h-10" />
              </div>
              <div className="w-full text-lg font-semibold text-center">
                Cash on Delivery
              </div>
            </div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="esewa-option"
            name="payment"
            value="eSewa Payment"
            className="hidden peer"
            checked={paymentOption === "eSewa Payment"}
            onChange={(e) => setpaymentOption(e.target.value)}
          />
          <label
            htmlFor="esewa-option"
            className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 hover:text-gray-600 hover:bg-gray-200"
          >
            <div className="block">
              <div className="w-full flex justify-center items-center">
                <img src="/esewa.png" alt="eSewa Payment" className="h-10" />
              </div>
              <div className="w-full text-lg font-semibold text-center">
                eSewa Payment
              </div>
            </div>
          </label>
        </li>
      </ul>
    </div>
  );
};

export default PaymentOptions;
