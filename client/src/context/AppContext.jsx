import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [credits, setCredits] = useState(0);
  const [image, setImage] = useState(false);
  const [resultImg, setResultImg] = useState(false);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const loadCreditsData = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(backendUrl + "/api/user/credits", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCredits(data.credits);
        console.log(data.credits);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeBg = async (image) => {
    try {
      if (!isSignedIn) {
        return openSignIn();
      }

      setImage(image);
      setResultImg(false);
      navigate("/result");

      const token = await getToken();
      const formData = new FormData();

      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/img/remove-bg",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data.success) {
        setResultImg(data.resultImg);
        data.creditBalance && setCredits(data.creditBalance);
      } else {
        toast.error(data.message);
        data.creditBalance && setCredits(data.creditBalance);

        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    credits,
    setCredits,
    backendUrl,
    loadCreditsData,
    image,
    setImage,
    removeBg,
    resultImg,
    setResultImg
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
