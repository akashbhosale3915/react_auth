import { useState } from "react";
import toast from "react-hot-toast";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { handleAxiosError } from "../utils/handleAxiosError";
import { AxiosError } from "axios";
import { axiosInstance } from "../axios/axios";
import Spinner from "./Spinner";

type showPasswordType = {
  password: boolean;
  cPassword: boolean;
};

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] =
    useState<showPasswordType>({
      password: false,
      cPassword: false,
    });

  const [loading, setLoading] = useState(false);

  const toggleShowPassword = (
    field: keyof showPasswordType
  ) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  async function handleSignup(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const confirmPassword = form.confirmPassword.value;

    await signup({
      username,
      password,
      confirmPassword,
      email,
      phone,
    });

    // form.reset();
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
    if (
      !username ||
      !password ||
      !confirmPassword ||
      !email ||
      !phone
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (phone.length !== 10) {
      toast.error("Phone must contain 10 digits");
      return;
    }

    try {
      setLoading(true);
      const userData = {
        username,
        password,
        email,
        phone,
      };
      const { data } = await axiosInstance.post(
        "/users/new",
        userData
      );

      if (data.success) {
        toast.success(data.message);
        setLoading(false);
        navigate("/otp", { state: { ...userData } });
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form
      className="bg-white flex flex-col px-8 py-10 rounded-md w-[400px]"
      onSubmit={handleSignup}
    >
      <h1 className="text-center text-5xl font-bold mb-8">
        Signup
      </h1>
      <input
        type="text"
        placeholder="Enter your username"
        className="border h-14 mb-5 rounded-md indent-4 text-lg"
        name="username"
      />
      <div className="relative mb-5">
        <input
          type={showPassword.password ? "text" : "password"}
          placeholder="Create your password"
          className="border h-14 rounded-md indent-4 text-lg w-full"
          name="password"
        />
        {!showPassword.password ? (
          <IoMdEye
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            size={22}
            onClick={() => toggleShowPassword("password")}
          />
        ) : (
          <IoMdEyeOff
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            size={22}
            onClick={() => toggleShowPassword("password")}
          />
        )}
      </div>

      <div className="relative mb-5">
        <input
          type={
            showPassword.cPassword ? "text" : "password"
          }
          placeholder="Confirm your password"
          className="border h-14 rounded-md indent-4 text-lg w-full"
          name="confirmPassword"
        />

        {!showPassword.cPassword ? (
          <IoMdEye
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            size={22}
            onClick={() => toggleShowPassword("cPassword")}
          />
        ) : (
          <IoMdEyeOff
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            size={22}
            onClick={() => toggleShowPassword("cPassword")}
          />
        )}
      </div>
      <input
        type="text"
        placeholder="Enter your email"
        className="border h-14 mb-5 rounded-md indent-4 text-lg"
        name="email"
      />
      <input
        type="text"
        placeholder="Enter your phone number"
        className="border h-14 rounded-md indent-4 text-lg"
        name="phone"
      />
      <button
        className="bg-[#009577] my-8 rounded-md h-14 text-white text-xl font-semibold"
        disabled={loading}
      >
        {loading ? <Spinner /> : "Signup"}
      </button>
      <p className="text-center font-semibold">
        Already have an account?{" "}
        <span
          className="text-[#009577] cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </form>
  );
};

export default Signup;
