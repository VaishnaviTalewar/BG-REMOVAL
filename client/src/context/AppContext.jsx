import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext.js";

const AppContextProvider = (props) => {

  const [credits, setCredits] = useState(0);
  const [image, setImage] = useState(false);
  const [resultImg, setResultImg] = useState(false);

  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { getToken } = useAuth();
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();


  // LOAD USER CREDITS
  const loadCreditsData = useCallback(async () => {

    try {

      const token = await getToken();

      const { data } = await axios.get(
        backendUrl + "/api/user/credits",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data.success) {
        setCredits(data.credits);
      }

    } catch (error) {

      console.log(error);
      toast.error(error.message);

    }

  }, [getToken, backendUrl]);

  useEffect(() => {
    if (isSignedIn && user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadCreditsData();
    }
  }, [isSignedIn, user, loadCreditsData]);


  // REMOVE BACKGROUND FUNCTION
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

      formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/img/remove-bg",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data.success) {

        // FIXED PART
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
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );

};

export default AppContextProvider;
export { AppContext };