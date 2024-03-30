import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../axios/axios";
import { handleAxiosError } from "../utils/handleAxiosError";
import { AxiosError } from "axios";
import Spinner from "./Spinner";

const Otp = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] =
    useState(false);
  const tryAfter = 60000;
  const [remainingTime, setRemainingTime] = useState(
    tryAfter / 1000
  );

  useEffect(() => {
    if (resendDisabled) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendDisabled]);

  const navigate = useNavigate();

  async function handleOtp(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    form.otp.value = form.otp.value.replace(/\D/g, "");
    await verifyOtp({ otp: form.otp.value });
  }

  async function verifyOtp({ otp }: { otp: string }) {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    if (otp.length !== 6) {
      toast.error("OTP must contain 6 digits");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        "/users/verify-otp",
        {
          otp,
          user: location.state,
        }
      );

      if (data.success) {
        toast.success(data.message);
        return navigate("/login");
      }

      console.log(data, "data");

      setLoading(false);
    } catch (error) {
      handleAxiosError(error as AxiosError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    try {
      setRemainingTime(tryAfter / 1000);
      setResendDisabled(true);
      const { data } = await axiosInstance.post(
        "/users/resend-otp",
        {
          email: location.state.email,
        }
      );
      if (data.success) {
        toast.success(data.message);
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
      console.log(error);
    } finally {
      setTimeout(() => {
        setResendDisabled(false);
      }, tryAfter);
    }
  }
  return (
    <form
      className="flex flex-col justify-center bg-white px-8 py-10 rounded-md w-[400px]"
      onSubmit={handleOtp}
    >
      <h1 className="text-center text-5xl font-bold mb-8">
        OTP
      </h1>
      <input
        type="text"
        placeholder="Enter OTP"
        className="border h-14 rounded-md indent-4 text-lg w-full"
        name="otp"
        maxLength={6}
      />
      <button
        className={`text-[#009577] my-3 cursor-pointer w-max ${
          resendDisabled &&
          "cursor-not-allowed text-[#cccccc]"
        }`}
        onClick={resendOtp}
        disabled={resendDisabled}
      >
        {resendDisabled
          ? `OTP sent try again in ${remainingTime}s`
          : "Resend OTP"}
      </button>
      <button className="w-full bg-[#009577] rounded-md h-14 text-white text-xl font-semibold">
        {loading ? <Spinner /> : "Verify"}
      </button>
    </form>
  );
};

export default Otp;
