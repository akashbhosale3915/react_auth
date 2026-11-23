import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { handleAxiosError } from "../utils/handleAxiosError";
import { AxiosError } from "axios";
import { axiosInstance } from "../axios/axios";

function Header() {
  const dispatch = useDispatch();
  const [logoutLoading, setLogoutLoading] = useState(false);

  async function handleLogOut() {
    try {
      setLogoutLoading(true);
      const { data } = await axiosInstance.get("/auth/logout");
      if (data.success) {
        dispatch(logout());
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setLogoutLoading(false);
    }
  }

  return (
    <header className="bg-white shadow-sm px-4 md:px-8 h-16 flex items-center justify-between">
      <span className="text-xl font-bold text-[#009577]">DroidTech</span>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogOut}
          disabled={logoutLoading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition disabled:opacity-50"
        >
          <FiLogOut size={16} />
          {logoutLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </header>
  );
}

export default Header;
