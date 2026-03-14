import React from "react";
import { testimonialsData } from "../assets/assets";

const Testimonials = () => {
  return (
    <div className="relative px-6 lg:px-32 py-24 bg-gradient-to-b from-white via-purple-50 to-pink-50 overflow-hidden">

      {/* Glow Background */}
      <div className="absolute -top-32 left-20 w-[300px] h-[300px] bg-purple-300 opacity-30 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-32 right-20 w-[300px] h-[300px] bg-pink-300 opacity-30 blur-[120px] rounded-full"></div>

      {/* Title */}
      <h1 className="mb-16 text-center text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent relative z-10">
        Customer Testimonials
      </h1>

      {/* Testimonials */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-10">

        {testimonialsData.map((items, index) => (
          <div
            key={index}
            className="group relative bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-md border border-purple-100 hover:border-purple-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >

            {/* Quote */}
            <span className="text-6xl text-violet-400 absolute -top-6 left-6 opacity-20">
              ❝
            </span>

            {/* Text */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6 relative z-10">
              {items.text}
            </p>

            {/* Author */}
            <div className="flex items-center gap-4 mt-6">

              <img
                src={items.image}
                alt={items.author}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
              />

              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {items.author}
                </p>
                <p className="text-gray-500 text-xs">
                  {items.jobTitle}
                </p>
              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Testimonials;