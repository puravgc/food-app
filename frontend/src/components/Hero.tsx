import React from "react";
import illustration from "/illustration.png";
import { FlipWords } from "./ui/flip-words";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function Example() {
  const words = ["Delight", "Pleasure", "Satisfaction", "Excitement"];
  const navigate = useNavigate();

  return (
    <div className="bg-white overflow-hidden">
      <div className="px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-center">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center xl:text-left">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Delivering <FlipWords words={words} /> <br /> to Your Doorstep
            </h1>
            <p className="mt-6 text-lg sm:text-lg leading-8 text-gray-600">
              Discover culinary delights with Eat More. From quick snacks to
              gourmet meals, order your favorites and enjoy fast, reliable
              delivery. Your next delicious meal is just a few clicks away!
            </p>
            <div className="mt-10 flex justify-center xl:justify-start">
              <button
                onClick={() => {
                  navigate("/order");
                }}
                className="group flex justify-center items-center border-2 border-red-600 text-red-500 px-2 py-2 sm:px-5 sm:py-4 text-lg font-semibold shadow-sm hover:bg-red-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all duration-300"
              >
                <span>Start Ordering Now</span>
                <FaArrowRight className="ml-3 transform transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>
          </div>
        </div>
        <div className="hidden xl:block w-full lg:w-1/2 flex justify-center lg:justify-end mt-10 lg:mt-0 ">
          <img
            className="object-contain w-full h-[30rem] rounded-2xl"
            src={illustration}
            alt="Illustration"
          />
        </div>
      </div>
    </div>
  );
}
