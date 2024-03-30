import { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../axios/axios";
import { handleAxiosError } from "../utils/handleAxiosError";
import { AxiosError } from "axios";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

type showPasswordType = {
  password: boolean;
  cPassword: boolean;
};

const ForgotPassword = () => {
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] =
    useState<showPasswordType>({
      password: false,
      cPassword: false,
    });

  const toggleShowPassword = (
    field: keyof showPasswordType
  ) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  async function handleEmailSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    await getOtp({ email });
  }

  async function getOtp({ email }: { email: string }) {
    if (!email) {
      return toast.error("Please enter your email");
    }
    setEmail(email);
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        "/users/forgot-password",
        { email }
      );

      if (data.success) {
        setShowOTPInput(true);
        toast.success(data.message);
        setLoading(false);
        return;
      }
    } catch (error) {
      setShowOTPInput(false);
      handleAxiosError(error as AxiosError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleOTPSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    form.otp.value = form.otp.value.replace(/\D/g, "");

    if (
      !form.otp.value ||
      !form.password.value ||
      !form.confirmPassword.value
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.otp.value.length !== 6) {
      toast.error("OTP must contain 6 digits");
      return;
    }
    if (
      form.password.value !== form.confirmPassword.value
    ) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setVerifying(true);
      const { data } = await axiosInstance.post(
        "/users/verify-reset-password",
        {
          email,
          otp: form.otp.value,
          newPassword: form.password.value,
        }
      );

      if (data.success) {
        toast.success(data.message);
        setVerifying(false);
        return navigate("/login");
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
      console.log(error);
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="bg-white flex flex-col px-8 py-10 rounded-md w-[400px] ">
      <form
        className="flex flex-col"
        onSubmit={handleEmailSubmit}
      >
        <h1 className="text-center text-2xl font-bold mb-8">
          Reset Password
        </h1>
        <input
          type="text"
          placeholder="Enter your email"
          className={`border h-14 mb-5 rounded-md indent-4 text-lg ${
            showOTPInput && "bg-[#cccccc] outline-none"
          }`}
          name="email"
          readOnly={showOTPInput}
        />
        <button
          className={`bg-[#009577] mb-8 rounded-md h-14 text-white text-xl font-semibold ${
            showOTPInput &&
            "cursor-not-allowed bg-[#cccccc]"
          }`}
          disabled={showOTPInput || loading}
        >
          {loading ? <Spinner /> : "Get OTP"}
        </button>
      </form>
      <form onSubmit={handleOTPSubmit}>
        {showOTPInput && (
          <>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              className="border h-14 mb-5 rounded-md indent-4 text-lg w-full"
              maxLength={6}
            />
            <div className="relative mb-5">
              <input
                type={
                  showPassword.password
                    ? "text"
                    : "password"
                }
                placeholder="Create your password"
                className="border h-14 rounded-md indent-4 text-lg w-full"
                name="password"
              />
              {!showPassword.password ? (
                <IoMdEye
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  size={22}
                  onClick={() =>
                    toggleShowPassword("password")
                  }
                />
              ) : (
                <IoMdEyeOff
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  size={22}
                  onClick={() =>
                    toggleShowPassword("password")
                  }
                />
              )}
            </div>
            <div className="relative mb-5">
              <input
                type={
                  showPassword.cPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                className="border h-14 rounded-md indent-4 text-lg w-full"
                name="confirmPassword"
              />

              {!showPassword.cPassword ? (
                <IoMdEye
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  size={22}
                  onClick={() =>
                    toggleShowPassword("cPassword")
                  }
                />
              ) : (
                <IoMdEyeOff
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  size={22}
                  onClick={() =>
                    toggleShowPassword("cPassword")
                  }
                />
              )}
            </div>
            <button
              disabled={verifying}
              className={`w-full bg-[#009577] rounded-md h-14 text-white text-xl font-semibold'
        }`}
            >
              {verifying ? <Spinner /> : "Change Password"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
