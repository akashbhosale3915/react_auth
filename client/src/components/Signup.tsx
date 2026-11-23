import { useState } from "react";
import toast from "react-hot-toast";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { handleAxiosError } from "../utils/handleAxiosError";
import { AxiosError } from "axios";
import { axiosInstance } from "../axios/axios";
import Spinner from "./Spinner";

type ShowPasswordType = {
  password: boolean;
  cPassword: boolean;
};

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<ShowPasswordType>({
    password: false,
    cPassword: false,
  });
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = (field: keyof ShowPasswordType) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const username = (
      form.elements.namedItem("username") as HTMLInputElement
    ).value.trim();
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const phone = (
      form.elements.namedItem("phone") as HTMLInputElement
    ).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    await signup({ username, password, confirmPassword, email, phone });
  }

  async function signup({
    username,
    password,
    confirmPassword,
    email,
    phone,
  }: {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone: string;
  }) {
    if (!username || !password || !confirmPassword || !email || !phone) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone must contain 10 digits");
      return;
    }

    try {
      setLoading(true);
      const userData = { username, password, email, phone };
      const { data } = await axiosInstance.post("/users/new", userData);

      if (data.success) {
        toast.success(data.message);
        navigate("/otp", { state: { ...userData } });
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form-container" onSubmit={handleSignup}>
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#009577]">
          DroidTech
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Create an account
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          We&apos;ll send a 6-digit code to verify your email
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              autoComplete="username"
              placeholder="e.g. akash_01"
              className="w-full border border-slate-300 h-11 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#009577]"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Phone (10 digits)
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              maxLength={10}
              autoComplete="tel"
              placeholder="9876543210"
              className="w-full border border-slate-300 h-11 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#009577]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-slate-600 mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full border border-slate-300 h-11 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#009577]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-slate-600 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword.password ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              placeholder="Create your password"
              className="w-full border border-slate-300 h-11 rounded-md pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#009577]"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("password")}
              aria-label={
                showPassword.password ? "Hide password" : "Show password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              {showPassword.password ? (
                <IoMdEyeOff size={20} />
              ) : (
                <IoMdEye size={20} />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold text-slate-600 mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPassword.cPassword ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm your password"
              className="w-full border border-slate-300 h-11 rounded-md pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#009577]"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("cPassword")}
              aria-label={
                showPassword.cPassword ? "Hide password" : "Show password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              {showPassword.cPassword ? (
                <IoMdEyeOff size={20} />
              ) : (
                <IoMdEye size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#009577] hover:bg-[#007d63] mt-6 mb-5 rounded-md h-11 text-white text-sm font-semibold flex items-center justify-center transition disabled:opacity-50"
      >
        {loading ? <Spinner /> : "Signup"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[#009577] font-semibold hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default Signup;
