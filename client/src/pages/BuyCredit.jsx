import React, { useContext, useState } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const BuyCredit = () => {
  const navigate = useNavigate();
  const { loadCreditsData } = useContext(AppContext);

  const { getToken } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();

  const clerkId = user?.id ?? user?.userId ?? null;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(false);

  //  Initialize Razorpay
  const initPay = async (order) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credits Payment",
      description: "Buy Credits",
      order_id: order.id,
      receipt: order.receipt,
      method: {
        card: true,
        netbanking: true,
        upi: true,
        wallet: true,
        emi: false,
        paylater: false,
      },

      handler: async (response) => {
        console.log("Razorpay payment response:", response);
        try {
          const token = await getToken();

          const { data } = await axios.post(
            backendUrl + "/api/user/verify-razorpay",
            response,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "x-clerk-id": clerkId,
              },
            }
          );

          console.log("Verify Razorpay response:", data);

          if (data.success) {
            toast.success("Payment successful 🎉");
            loadCreditsData();
            navigate("/");
          } else {
            toast.error(data.message || "Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Verification error");
        }
      },

      theme: {
        color: "#7c3aed",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  //Handle Buy Credits
  const buyCredits = async (planId) => {
    if (!isLoaded || !isSignedIn || !user) {
      toast.error("Please wait or sign in to purchase credits");
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/user/pay-razorpay",
        { planId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-clerk-id": clerkId,
          },
        }
      );
      console.log("Order creation response:", data);

      if (data.success) {
        initPay(data.order);
      } else {
        toast.error("Failed to create order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 px-4 sm:px-6 lg:px-10 py-16">
      <div className="max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <button className="px-5 py-2 text-sm font-semibold text-purple-600 bg-purple-100 rounded-full mb-4">
          Our Plans
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Choose Your Credit Plan
        </h1>

        <p className="text-gray-500 mt-2">
          Buy credits to remove backgrounds from your images instantly
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {plans.map((item, index) => (
          <div
            key={index}
            className={`relative bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition duration-300 flex flex-col items-center text-center border ${
              index === 1
                ? "border-purple-500 scale-105"
                : "border-gray-200"
            }`}
          >
            {/* Badge */}
            {index === 1 && (
              <span className="absolute -top-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            <img src={assets.logo_icon} width={45} alt="logo" />

            <p className="mt-4 text-lg font-semibold text-gray-800">
              {item.id}
            </p>

            <p className="text-gray-500 text-sm mt-2">{item.desc}</p>

            {/* Price */}
            <div className="mt-6">
              <span className="text-3xl font-bold text-purple-600">
                ₹ {item.price}
              </span>
              <p className="text-gray-500 text-sm mt-1">
                {item.credits} Credits
              </p>
            </div>

            {/* Button */}
            <button
              onClick={() => buyCredits(item.id)}
              disabled={loading}
              className="mt-8 px-7 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md hover:scale-105 hover:shadow-xl transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default BuyCredit;