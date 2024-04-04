import { useState } from 'react';
import { IoMdEyeOff, IoMdEye } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axios/axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { login as loginAction } from '../store/slices/authSlice';
import { handleAxiosError } from '../utils/handleAxiosError';
import { AxiosError } from 'axios';
import Spinner from './Spinner';
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;

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
      toast.error('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      const { data } = await axiosInstance.post('/auth/login', {
        username,
        password,
      });

      if (data.success) {
        toast.success(data.message);
        setLoading(false);
        dispatch(loginAction(data.user));
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
      className='bg-white flex flex-col px-8 py-10 rounded-md w-[94%] max-w-[400px]'
      onSubmit={handleLogin}>
      <h1 className='text-center text-5xl font-bold mb-8'>Login</h1>
      <input
        type='text'
        placeholder='Enter your username or email'
        className='border h-14 mb-5 rounded-md indent-4 md:text-lg'
        name='username'
      />
      <div className='relative'>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder='Enter your password'
          className='border h-14 rounded-md indent-4 md:text-lg w-full'
          name='password'
        />
        {!showPassword ? (
          <IoMdEye
            className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
            size={22}
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <IoMdEyeOff
            className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
            size={22}
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
      <Link to='/forgot-password'>
        <p className='text-[#009577] cursor-pointer font-medium text-sm my-3 hover:underline'>
          Forgot password?
        </p>
      </Link>
      <button className='bg-[#009577] mb-8 rounded-md h-14 text-white md:text-xl font-semibold'>
        {loading ? <Spinner /> : 'Login'}
      </button>
      <p className='text-center font-semibold'>
        Don't have an account?{' '}
        <button
          className='text-[#009577] cursor-pointer'
          onClick={() => navigate('/signup')}>
          Signup
        </button>
      </p>
    </form>
  );
};

export default Login;
