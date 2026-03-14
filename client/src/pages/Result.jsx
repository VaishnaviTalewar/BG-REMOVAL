import React from "react";
import { assets } from "./../assets/assets";

const Result = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 lg:px-32 py-16">

      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Background Removed
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Compare your original image with the AI processed result
        </p>
      </div>

      {/* Image Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Original */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 flex flex-col">
          
          <p className="text-sm font-semibold text-gray-600 mb-4">
            Original Image
          </p>

          <div className="rounded-xl overflow-hidden">
            <img
              src={assets.image_w_bg}
              alt="original"
              className="w-full object-cover hover:scale-105 transition duration-500"
            />
          </div>

        </div>

        {/* Removed BG */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 flex flex-col">

          <p className="text-sm font-semibold text-gray-600 mb-4">
            Background Removed
          </p>

          <div className="rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">

            <img
              src={assets.image_wo_bg}
              alt="removed background"
              className="w-full object-cover hover:scale-105 transition duration-500"
            />

          </div>

        </div>

      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-5 mt-14">

        {/* Try again */}
        <button className="px-8 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg hover:scale-105 hover:shadow-xl transition duration-300">
          🔄 Try another image
        </button>

        {/* Download */}
        <a
          href={assets.image_wo_bg}
          download
          className="px-8 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-white hover:shadow-md transition text-center"
        >
          ⬇ Download image
        </a>

      </div>

    </div>
  );
};

export default Result;