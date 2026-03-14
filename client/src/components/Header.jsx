import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="relative px-6 lg:px-32 py-20 overflow-hidden bg-gradient-to-br from-white via-purple-50 to-pink-50">

      {/* Gradient Blur Shapes */}
      <div className="absolute -top-40 -left-32 w-[350px] h-[350px] bg-purple-400 opacity-30 blur-[140px] rounded-full"></div>
      <div className="absolute -bottom-40 -right-32 w-[350px] h-[350px] bg-pink-400 opacity-30 blur-[140px] rounded-full"></div>

      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16 relative z-10">

        {/* LEFT SIDE */}
        <div className="max-w-xl text-center lg:text-left">

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">

            Remove Image  

            <span className="block bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              Backgrounds
            </span>

            Instantly with AI
          </h1>

          <p className="mt-6 text-gray-500 text-lg leading-relaxed">
            Upload your image and remove backgrounds automatically in seconds.
            Perfect for creators, designers, and online stores.
          </p>

          {/* Upload Button */}
          <div className="mt-10">

            <input type="file" id="upload1" hidden />

            <label
              htmlFor="upload1"
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full text-white font-semibold
              bg-gradient-to-r from-violet-600 to-fuchsia-500
              shadow-lg hover:shadow-2xl hover:scale-105
              transition duration-300 cursor-pointer"
            >
              <img className="w-5" src={assets.upload_btn_icon} alt="" />
              Upload your image
            </label>

          </div>

          {/* Stats */}
          <div className="flex justify-center lg:justify-start gap-10 mt-10 text-gray-600">

            <div>
              <p className="text-2xl font-bold text-gray-900">1M+</p>
              Images Processed
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">99%</p>
              Accuracy
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">2s</p>
              Processing Time
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="w-full max-w-lg">

          <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl p-6 hover:scale-105 transition duration-300">

            <img
              src={assets.header_img}
              alt="preview"
              className="w-full rounded-xl"
            />

          </div>

        </div>

      </div>
    </div>
  );
};

export default Header;