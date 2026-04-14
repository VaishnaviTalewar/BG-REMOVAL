import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext.js";

const AppContextProvider = (props) => {
  const [credits, setCredits] = useState(null);
  const [image, setImage] = useState(null);
  const [resultImg, setResultImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { getToken } = useAuth();
  const { isSignedIn, isLoaded, user } = useUser();
  const { openSignIn } = useClerk();

  const clerkId = user?.id ?? user?.userId ?? null;

  // LOAD CREDITS
  const loadCreditsData = useCallback(async () => {
    if (!clerkId) return;

    try {
      const token = await getToken();

      const { data } = await axios.get(
        backendUrl + "/api/user/credits",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Clerk-Id": clerkId,
          },
        }
      );

      if (data.success) {
        setCredits(data.credits ?? 5);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [getToken, backendUrl, clerkId]);

  // REMOVE BG FUNCTION 
  const removeBg = async (file) => {
    try {
      if (!isSignedIn) {
        return openSignIn();
      }

      setImage(file);
      setResultImg(null); 
      setLoading(true);

      navigate("/result");

      const token = await getToken();

      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(
        backendUrl + "/api/img/remove-bg",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Clerk-Id": clerkId,
          },
        }
      );

      if (data.success) {
        setResultImg(data.resultImage); 
        setCredits(data.credits);
      } else {
        toast.error(data.message);

        if (data.credits !== undefined) {
          setCredits(data.credits);
        }

        if (data.credits === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isUserReady = isLoaded && isSignedIn && Boolean(clerkId);

  useEffect(() => {
    if (!isUserReady) return;

    if (credits === null) {
      setCredits(5);
    }

    loadCreditsData();
  }, [isUserReady, loadCreditsData]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setCredits(0);
    }
  }, [isLoaded, isSignedIn]);

  const value = {
    credits,
    setCredits,
    backendUrl,
    loadCreditsData,

    image,
    setImage,

    resultImg,
    setResultImg,

    removeBg,
    loading,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
export { AppContext };