import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { axiosInstance } from '../axios/axios';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  async function handleLogOut() {
    try {
      const { data } = await axiosInstance.get('/auth/logout');

      if (data.success) {
        dispatch(logout());
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.code === 'ERR_NETWORK') {
          return toast.error('No internet connection');
        }
        console.log(error);
      }
    }
  }
  return (
    <div>
      <h1 className='capitalize'>Hello {user?.username}!</h1>
      <button
        className='bg-red-500 text-white p-2 rounded-md border-none outline-none'
        onClick={handleLogOut}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
