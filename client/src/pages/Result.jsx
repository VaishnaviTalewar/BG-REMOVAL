import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Result = () => {
  const { resultImg, image, setImage } = useContext(AppContext);
  const navigate = useNavigate();

  const tryAnother = () => {
    setImage(false);
    navigate("/");
  };

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

        {/* Original Image */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 flex flex-col">
          
          <p className="text-sm font-semibold text-gray-600 mb-4">
            Original Image
          </p>

          <div className="rounded-xl overflow-hidden">
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="original"
                className="w-full object-cover hover:scale-105 transition duration-500"
              />
            )}
          </div>

        </div>

        {/* Result Image */}
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 flex flex-col">

          <p className="text-sm font-semibold text-gray-600 mb-4">
            Background Removed
          </p>

          <div
            className="rounded-xl overflow-hidden flex items-center justify-center min-h-[300px]"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0), linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px"
            }}
          >

            {/* Loading */}
            {!resultImg && image && (
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm">Processing image...</p>
              </div>
            )}

            {/* Result Image */}
            {resultImg && (
              <img
                src={resultImg}
                alt="removed background"
                className="w-full object-contain hover:scale-105 transition duration-500"
              />
            )}

          </div>

        </div>

      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-5 mt-14">

        {/* Try again */}
        {resultImg && (
          <button
            onClick={tryAnother}
            className="px-8 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
          >
            🔄 Try another image
          </button>
        )}

        {/* Download */}
        {resultImg && (
          <a
            href={resultImg}
            download="no-background.png"
            className="px-8 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-white hover:shadow-md transition text-center"
          >
            ⬇ Download image
          </a>
        )}

      </div>

    </div>
  );
};

export default Result;