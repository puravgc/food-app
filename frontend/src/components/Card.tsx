import React, { useState, useEffect } from "react";
import Cartmodal from "./Cartmodal";

interface CardProps {
  name: string;
  image: string;
  price: number;
  id: string;
}

const Card: React.FC<CardProps> = ({ name, image, price, id }) => {
  const [cartModal, setcartModal] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    setRating(Math.floor(Math.random() * 3) + 3);
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          aria-hidden="true"
          className={`h-5 w-5 ${
            i <= rating ? "text-yellow-300" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="flex justify-center items-center">
      <div className="group relative m-2 w-80 max-w-xs flex-col overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image */}
        <div className="relative mx-3 mt-4 h-56 overflow-hidden rounded-xl flex justify-center">
          <img
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            src={image}
            alt={name}
          />

          {/* Discount badge */}
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md shadow">
            -${8}
          </span>
        </div>

        {/* Body */}
        <div className="mt-4 px-5 pb-5">
          <h5 className="text-lg font-semibold text-slate-900 truncate">
            {name}
          </h5>

          {/* Price & Rating */}
          <div className="mt-3 mb-5 flex items-center justify-between">
            <p>
              <span className="text-2xl font-bold text-red-600">${price}</span>
              <span className="text-sm text-gray-500 line-through ml-1">
                ${price + 8}
              </span>
            </p>

            <div className="flex items-center">
              {renderStars(rating)}
              <span className="ml-2 rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-700">
                {rating}.0
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={() => setcartModal(true)}
            className="w-full flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white transition-colors duration-300 hover:bg-red-500 active:bg-red-700"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <Cartmodal
        cartModal={cartModal}
        setcartModal={setcartModal}
        name={name}
        image={image}
        price={price}
        id={id}
      />
    </div>
  );
};

export default Card;
