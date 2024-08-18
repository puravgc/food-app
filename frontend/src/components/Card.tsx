import React, { useState, useEffect } from "react";
import Cartmodal from "./Cartmodal";

interface CardProps {
  name: string;
  image: string;
  price: number;
}

const Card: React.FC<CardProps> = ({ name, image, price }) => {
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
      <div className="relative m-2 flex w-80 h-96 max-w-xs flex-col overflow-hidden rounded-xl bg-white shadow-md shadow-black border border-gray-300">
        <div className="relative mx-3 mt-3 h-60 overflow-hidden rounded-xl flex justify-center">
          <img
            className="object-cover rounded-full"
            src={image}
            alt="product image"
          />
        </div>
        <div className="mt-4 px-5 pb-5">
          <a href="#">
            <h5 className="text-xl tracking-tight text-slate-900 truncate">
              {name}
            </h5>
          </a>
          <div className="mt-2 mb-5 flex items-center justify-between">
            <p>
              <span className="text-3xl font-bold text-slate-900">
                ${price}
              </span>
              <span className="text-sm text-slate-900 line-through">
                ${price + 8}
              </span>
            </p>
            <div className="flex items-center">
              {renderStars(rating)}
              <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
                {rating}.0
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setcartModal(true);
            }}
            className="flex items-center justify-center rounded-md bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Add to cart
          </button>
        </div>
      </div>
      <Cartmodal
        cartModal={cartModal}
        setcartModal={setcartModal}
        name={name}
        image={image}
        price={price}
      />
    </div>
  );
};

export default Card;
