import React from "react";
import { assets, plans } from "../assets/assets";

const BuyCredit = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-6 lg:px-32 py-16">

      {/* Header */}
      <div className="text-center mb-16">
        <button className="px-5 py-2 text-sm font-semibold text-purple-600 bg-purple-100 rounded-full mb-4">
          Our Plans
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Choose Your Credit Plan
        </h1>

        <p className="text-gray-500 mt-2">
          Buy credits to remove backgrounds from your images instantly
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {plans.map((item, index) => (

          <div
            key={index}
            className={`relative bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition duration-300 flex flex-col items-center text-center border ${
              index === 1 ? "border-purple-500 scale-105" : "border-gray-200"
            }`}
          >

            {/* Most Popular Badge */}
            {index === 1 && (
              <span className="absolute -top-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            <img src={assets.logo_icon} width={45} alt="logo" />

            <p className="mt-4 text-lg font-semibold text-gray-800">
              {item.id}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              {item.desc}
            </p>

            {/* Price */}
            <div className="mt-6">
              <span className="text-3xl font-bold text-purple-600">
                $ {item.price}
              </span>
              <p className="text-gray-500 text-sm mt-1">
                {item.credits} Credits
              </p>
            </div>

            {/* Button */}
            <button className="mt-8 px-7 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md hover:scale-105 hover:shadow-xl transition">
              Buy Now
            </button>

          </div>

        ))}

      </div>

    </div>
  );
};

export default BuyCredit;