import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
import { axiosInstance } from "../axios/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import Spinner from "../components/Spinner";

const Dashboard = () => {
  const user = useSelector(
    (state: RootState) => state.auth.user
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  async function handleLogOut() {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        "/auth/logout"
      );

      if (data.success) {
        dispatch(logout());
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        if (error.code === "ERR_NETWORK") {
          return toast.error("No internet connection");
        }
        console.log(error);
      }
    }
  }
  return (
    <div>
      <h1 className="text-white">Hello {user?.username}</h1>
      <button
        className="bg-red-400 text-white p-2 rounded-md border-none outline-none"
        onClick={handleLogOut}
      >
        {loading ? <Spinner color="#FF0000" /> : "Logout"}
      </button>
    </div>
  );
};

export default Dashboard;
