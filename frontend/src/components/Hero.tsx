import React from "react";
import illustration from "/illustration.png";
import { FlipWords } from "./ui/flip-words";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
  const words = ["Delight", "Pleasure", "Satisfaction", "Excitement"];
  const navigate = useNavigate();

  return (
    <div className="bg-white overflow-hidden">
      <div className="w-full flex flex-col items-center py-4 px-4 sm:px-6 md:px-8">
        <div className="text-center text-lg sm:text-xl md:text-2xl">
          <div className="flex flex-col items-center sm:flex-row sm:items-center">
            <div className="mb-2 sm:mb-0 sm:mr-2">
              🎉 Celebrating Our Anniversary! Enjoy 20% Off Your Order with
              Code:
            </div>
            <div className="flex flex-col items-center relative">
              <span className="font-bold text-red-500 text-lg sm:text-xl">
                EATMOREANIVERSARY
              </span>
              <img
                src="/double-underline.png"
                alt="underline"
                className="absolute top-6 sm:top-8"
                style={{ height: "1.5rem" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-center">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32 text-center xl:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Delivering <FlipWords words={words} />{" "}
            <br className="hidden lg:block" /> to Your Doorstep
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-8 text-gray-600">
            Discover culinary delights with Eat More. From quick snacks to
            gourmet meals, order your favorites and enjoy fast, reliable
            delivery. Your next delicious meal is just a few clicks away!
          </p>
          <div className="mt-8 flex justify-center xl:justify-start">
            <button
              onClick={() => {
                navigate("/order");
              }}
              className="group flex justify-center items-center border-2 border-red-600 text-red-500 px-4 py-2 sm:px-6 sm:py-3 text-lg font-semibold shadow-sm hover:bg-red-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all duration-300"
            >
              <span>Start Ordering Now</span>
              <FaArrowRight className="ml-3 transform transition-transform duration-300 group-hover:translate-x-2" />
            </button>
          </div>
        </div>
        <div className="hidden lg:block w-full lg:w-1/2 flex justify-center lg:justify-end mt-10 lg:mt-0">
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
