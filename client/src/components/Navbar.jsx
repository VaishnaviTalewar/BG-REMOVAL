import { assets } from "./../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const { credits, loadCreditsData } = useContext(AppContext);

  useEffect(() => {
    if (isSignedIn) {
      loadCreditsData();
    }
  }, [isSignedIn]);

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">
      <div className="flex items-center justify-between px-6 sm:px-10 lg:px-32 xl:px-44 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            className="w-32 sm:w-36 hover:scale-105 transition duration-300"
            src={assets.logo}
            alt="logo"
          />
        </Link>

        {/* Right Side */}
        {isSignedIn ? (
          <div className="flex items-center gap-4">

            {/* Credits Badge */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
              <img
                className="w-5"
                src={assets.credit_icon}
                alt="credit"
              />
              <p className="text-sm font-semibold text-blue-800">
                {credits} Credits
              </p>
            </div>

            {/* User Profile */}
            <UserButton afterSignOutUrl="/" />

          </div>
        ) : (
          <button
            onClick={() => openSignIn({})}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 
            text-white px-6 py-2.5 rounded-full text-sm font-semibold 
            shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Get Started
            <img
              className="w-4"
              src={assets.arrow_icon}
              alt="arrow"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;