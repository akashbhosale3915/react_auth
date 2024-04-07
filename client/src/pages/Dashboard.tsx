import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  logout,
  updateUser,
} from "../store/slices/authSlice";
import { axiosInstance } from "../axios/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ChangeEvent, useState } from "react";
import Spinner from "../components/Spinner";
import { FaUserCircle } from "react-icons/fa";
import { IoMdCamera } from "react-icons/io";

const Dashboard = () => {
  const user = useSelector(
    (state: RootState) => state.auth.user
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  async function handleProfilePic(
    e: ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      if (user) {
        setPicLoading(true);
        const { data } = await axiosInstance.post(
          `/users/${user._id}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        dispatch(
          updateUser({
            ...user,
            profilePic: data.profilePic,
          })
        );
        setPicLoading(false);
        toast.success(
          "Profile picture updated successfully"
        );
      }
    } catch (error) {
      setPicLoading(false);
      console.log(error);
    }
  }

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
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-white">
          Hello {user?.username}
        </h1>
        <div className="size-24 rounded-full border-2 border-slate-800 border-dotted relative">
          <div className="size-full rounded-full overflow-hidden flex justify-center items-center">
            {picLoading ? (
              <Spinner />
            ) : (
              <>
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="user"
                    className="size-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="h-full w-full" />
                )}
              </>
            )}
          </div>
          <label className="absolute bottom-0 right-0 size-6 border rounded-full bg-white p-1 cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleProfilePic}
              accept="image/*"
            />
            <IoMdCamera className="size-full" />
          </label>
        </div>
        <button
          className="bg-red-400 text-white p-2 flex justify-center items-center rounded-md border-none outline-none"
          onClick={handleLogOut}
        >
          {loading ? <Spinner color="#FF0000" /> : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
