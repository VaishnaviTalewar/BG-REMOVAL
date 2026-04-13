import { assets } from "./../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn, user } = useUser();
  const { credits } = useContext(AppContext);

  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-32 xl:px-44 py-3 sm:py-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            className="w-24 sm:w-32 md:w-36 hover:scale-105 transition duration-300"
            src={assets.logo}
            alt="logo"
          />
        </Link>

        {/* Right Side */}
        {isSignedIn ? (
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Credits Badge */}
            <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-100 to-blue-200 px-2 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
              <button onClick={() => navigate("/buy")} className="flex items-center gap-1 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                <img className="w-4 sm:w-5" src={assets.credit_icon} alt="credit" />
              </button>
              <p className="text-xs sm:text-sm font-semibold text-blue-800 hidden sm:block">
                Credits : {credits}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-blue-800 sm:hidden">
                {credits}
              </p>
            </div>
            <p className="text-xs sm:text-sm hidden md:block">Hi, {user?.fullName}</p>

            {/* User Profile */}
            <UserButton afterSignOutUrl="/" />
           

          </div>
        ) : (
          <button
            onClick={() => openSignIn({})}
            className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 
            text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold 
            shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Get Started
            <img className="w-3 sm:w-4" src={assets.arrow_icon} alt="arrow" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;