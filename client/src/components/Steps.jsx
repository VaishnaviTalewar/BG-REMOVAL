import React from "react";
import { assets } from "../assets/assets";

const Steps = () => {
  return (
    <div className="relative px-6 lg:px-32 py-24 bg-gradient-to-b from-white via-purple-50 to-pink-50 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -top-40 left-10 w-[300px] h-[300px] bg-purple-300 blur-[140px] opacity-30 rounded-full"></div>
      <div className="absolute -bottom-40 right-10 w-[300px] h-[300px] bg-pink-300 blur-[140px] opacity-30 rounded-full"></div>

      {/* Heading */}
      <div className="text-center relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Remove Background in{" "}
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
            3 Easy Steps
          </span>
        </h1>

        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          Our AI makes background removal extremely simple. Just upload your
          image and download the result instantly.
        </p>
      </div>

      {/* Steps */}
      <div className="mt-16 grid md:grid-cols-3 gap-10 relative z-10">

        {/* Step 1 */}
        <div className="group relative bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-md border border-purple-100 hover:border-purple-300 hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 text-center overflow-hidden">

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-purple-100 via-transparent to-pink-100"></div>

          <div className="relative z-10">

            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-xl font-bold shadow-lg ring-4 ring-white">
              1
            </div>

            <img
              className="w-12 mx-auto mt-5 transition group-hover:scale-110 group-hover:rotate-3"
              src={assets.upload_icon}
              alt=""
            />

            <h3 className="text-lg font-semibold text-gray-800 mt-5">
              Upload Image
            </h3>

            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Choose an image from your device and upload it to start the
              background removal process.
            </p>

          </div>
        </div>

        {/* Step 2 */}
        <div className="group relative bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-md border border-purple-100 hover:border-purple-300 hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 text-center overflow-hidden">

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-purple-100 via-transparent to-pink-100"></div>

          <div className="relative z-10">

            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-xl font-bold shadow-lg ring-4 ring-white">
              2
            </div>

            <img
              className="w-12 mx-auto mt-5 transition group-hover:scale-110 group-hover:rotate-3"
              src={assets.remove_bg_icon}
              alt=""
            />

            <h3 className="text-lg font-semibold text-gray-800 mt-5">
              AI Processing
            </h3>

            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Our advanced AI automatically detects the subject and removes the
              background within seconds.
            </p>

          </div>
        </div>

        {/* Step 3 */}
        <div className="group relative bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-md border border-purple-100 hover:border-purple-300 hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 text-center overflow-hidden">

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-purple-100 via-transparent to-pink-100"></div>

          <div className="relative z-10">

            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-xl font-bold shadow-lg ring-4 ring-white">
              3
            </div>

            <img
              className="w-12 mx-auto mt-5 transition group-hover:scale-110 group-hover:rotate-3"
              src={assets.download_icon}
              alt=""
            />

            <h3 className="text-lg font-semibold text-gray-800 mt-5">
              Download Image
            </h3>

            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Download your image with a transparent background instantly and
              use it anywhere.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Steps;