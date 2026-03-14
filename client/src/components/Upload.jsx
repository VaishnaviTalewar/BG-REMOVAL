import React from "react";
import { assets } from "../assets/assets";

const Upload = () => {
  return (
    <div className="relative py-28 px-6 lg:px-32 bg-gradient-to-b from-white via-violet-50 to-pink-50 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -top-40 left-10 w-[320px] h-[320px] bg-violet-300 opacity-30 blur-[140px] rounded-full"></div>
      <div className="absolute -bottom-40 right-10 w-[320px] h-[320px] bg-fuchsia-300 opacity-30 blur-[140px] rounded-full"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
          See the Magic ✨
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mt-4 text-sm sm:text-base">
          Upload your image and instantly remove the background using our powerful AI technology.
        </p>

        {/* Upload Button */}
        <div className="mt-10">

          <input type="file" id="upload2" hidden />

          <label
            htmlFor="upload2"
            className="inline-flex items-center gap-3 px-10 py-4 text-white font-semibold rounded-full cursor-pointer
            bg-gradient-to-r from-violet-600 to-fuchsia-500
            shadow-lg hover:shadow-2xl hover:scale-105
            active:scale-95 transition-all duration-300 ring-4 ring-violet-100"
          >
            <img className="w-5" src={assets.upload_btn_icon} alt="upload" />
            Upload Your Image
          </label>

        </div>

      </div>
    </div>
  );
};

export default Upload;