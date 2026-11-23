import { useState } from "react";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { Link } from "react-router-dom";
import { axiosInstance } from "../axios/axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store/slices/authSlice";
import { handleAxiosError } from "../utils/handleAxiosError";
import { AxiosError } from "axios";
import Spinner from "./Spinner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const username = (
      form.elements.namedItem("username") as HTMLInputElement
    ).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    await login({ username, password });
  }

  async function login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/auth/login", {
        username,
        password,
      });

      if (data.success) {
        toast.success(data.message);
        dispatch(loginAction(data.user));
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form-container" method="post" onSubmit={handleLogin}>
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#009577]">
          DroidTech
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">Welcome back</h1>
        <p className="text-sm text-slate-500 mt-1">
          Sign in to your account to continue
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="username"
            className="block text-xs font-semibold text-slate-600 mb-1.5"
          >
            Username or Email
          </label>
          <input
            id="username"
            type="text"
            name="username"
            autoComplete="username"
            placeholder="Enter your username or email"
            className="w-full border border-slate-300 h-11 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#009577]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-slate-600"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-[#009577] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full border border-slate-300 h-11 rounded-md pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#009577]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              {showPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#009577] hover:bg-[#007d63] mt-6 mb-5 rounded-md h-11 text-white text-sm font-semibold flex items-center justify-center transition disabled:opacity-50"
      >
        {loading ? <Spinner /> : "Login"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="text-[#009577] font-semibold hover:underline"
        >
          Signup
        </Link>
      </p>
    </form>
  );
};

export default Login;
