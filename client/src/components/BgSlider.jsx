import React, { useState } from "react";
import { assets } from "../assets/assets";

const BgSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  return (
    <div className="relative py-24 px-6 bg-gradient-to-b from-white via-purple-50 to-pink-50 overflow-hidden">

      {/* Glow Background */}
      <div className="absolute -top-40 left-20 w-[320px] h-[320px] bg-purple-300 opacity-30 blur-[140px] rounded-full"></div>
      <div className="absolute -bottom-40 right-20 w-[320px] h-[320px] bg-pink-300 opacity-30 blur-[140px] rounded-full"></div>

      {/* Title */}
      <h1 className="mb-16 text-center text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
        Remove Background With{" "}
        <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
          High Quality
        </span>{" "}
        <br />
        and Accuracy
      </h1>

      {/* Image Slider */}
      <div className="relative w-full max-w-4xl m-auto overflow-hidden rounded-2xl shadow-2xl border border-gray-200">

        {/* Before Label */}
        <span className="absolute top-4 left-4 z-20 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
          Before
        </span>

        {/* After Label */}
        <span className="absolute top-4 right-4 z-20 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white text-xs px-3 py-1 rounded-full">
          After
        </span>

        {/* Original Image */}
        <img
          src={assets.image_w_bg}
          className="w-full"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          alt=""
        />

        {/* Removed BG Image */}
        <img
          className="absolute top-0 left-0 w-full h-full"
          src={assets.image_wo_bg}
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          alt=""
        />

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 w-[3px] bg-white shadow-xl z-10"
          style={{ left: `${sliderPosition}%` }}
        ></div>

        {/* Slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 z-20 appearance-none bg-transparent cursor-pointer slider"
        />
      </div>
    </div>
  );
};

export default BgSlider;