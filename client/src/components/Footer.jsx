import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="mt-24 border-t border-purple-100 bg-gradient-to-r from-white via-purple-50 to-pink-50">

      <div className="px-6 sm:px-10 lg:px-32 xl:px-44 py-12">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <img
            src={assets.logo}
            alt="logo"
            className="w-32 cursor-pointer hover:scale-105 transition"
          />

          {/* Copyright */}
          <p className="text-sm text-gray-600 text-center">
            © 2025 bg-removal. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-5">

            <img
              src={assets.facebook_icon}
              alt="facebook"
              className="w-10 cursor-pointer hover:scale-110 hover:opacity-80 transition"
            />

            <img
              src={assets.twitter_icon}
              alt="twitter"
              className="w-10 cursor-pointer hover:scale-110 hover:opacity-80 transition"
            />

            <img
              src={assets.google_plus_icon}
              alt="google"
              className="w-10 cursor-pointer hover:scale-110 hover:opacity-80 transition"
            />

          </div>

        </div>

      </div>
    </div>
  );
};

export default Footer;