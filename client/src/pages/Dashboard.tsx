import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import { IoMdCamera } from "react-icons/io";
import { FiFileText, FiSettings } from "react-icons/fi";
import { RootState } from "../store/store";
import { updateUser } from "../store/slices/authSlice";
import { axiosInstance } from "../axios/axios";
import { handleAxiosError } from "../utils/handleAxiosError";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import ProfileSettings from "../components/ProfileSettings";
import Notes from "../components/Notes";

type TabType = "notes" | "settings";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<TabType>("notes");
  const [picLoading, setPicLoading] = useState(false);

  async function handleProfilePic(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0] || !user) return;
    const formData = new FormData();
    formData.append("profilePic", e.target.files[0]);

    try {
      setPicLoading(true);
      const { data } = await axiosInstance.post(
        `/users/${user._id}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      dispatch(
        updateUser({
          ...user,
          profilePic: data.profilePic,
          updatedAt: data.updatedAt,
        }),
      );
      toast.success("Profile picture updated successfully");
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setPicLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          {/* White Profile Card */}
          <section className="bg-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative size-24 shrink-0 group">
              <div className="size-full rounded-full overflow-hidden ring-2 ring-[#009577]/30 flex items-center justify-center bg-slate-100">
                {picLoading ? (
                  <Spinner />
                ) : user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.username}
                    className="size-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="size-full text-slate-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 size-7 rounded-full bg-[#009577] text-white p-1.5 cursor-pointer shadow hover:bg-[#007d63] transition">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleProfilePic}
                  accept="image/*"
                />
                <IoMdCamera className="size-full" />
              </label>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">
                  Hello, {user?.username}
                </h1>
                <span
                  className={`text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                    user?.role === "admin"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-[#009577]"
                  }`}
                >
                  {user?.role || "user"}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">{user?.email}</p>
              {user?.updatedAt && (
                <p className="text-xs text-slate-400 mt-1">
                  Last modified:{" "}
                  {new Date(user.updatedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </p>
              )}
            </div>
          </section>

          {/* Tabs Container */}
          <section className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold transition ${
                  activeTab === "notes"
                    ? "text-[#009577] border-b-2 border-[#009577] bg-emerald-50/40"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <FiFileText size={16} />
                My Notes
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold transition ${
                  activeTab === "settings"
                    ? "text-[#009577] border-b-2 border-[#009577] bg-emerald-50/40"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <FiSettings size={16} />
                Profile Settings
              </button>
            </div>

            <div className="p-6">
              {activeTab === "notes" ? <Notes /> : <ProfileSettings />}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
