import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import toast from "react-hot-toast";
import { logout, updateUser } from "../store/slices/authSlice";
import { handleAxiosError } from "../utils/handleAxiosError";
import { AxiosError } from "axios";
import { axiosInstance } from "../axios/axios";

const ProfileSettings = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [username, setUsername] = useState(user?.username || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  async function handleUpdateProfile(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    if (!username || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const passwordChangeRequested =
      currentPassword !== "" ||
      newPassword !== "" ||
      confirmNewPassword !== "";

    if (
      passwordChangeRequested &&
      (!currentPassword || !newPassword || !confirmNewPassword)
    ) {
      toast.error(
        "Enter your current password and the new password twice to change it",
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setSavingProfile(true);
      const { data } = await axiosInstance.put(`/users/${user._id}`, {
        username,
        phone,
        ...(passwordChangeRequested ? { currentPassword, newPassword } : {}),
      });

      if (data.success) {
        dispatch(
          updateUser({
            ...user,
            username: data.user.username,
            phone: data.user.phone,
            updatedAt: data.user.updatedAt,
          }),
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        toast.success(data.message || "Profile updated");
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user) return;
    if (
      !window.confirm("Delete your account permanently? This cannot be undone.")
    ) {
      return;
    }

    try {
      setDeletingAccount(true);
      const { data } = await axiosInstance.delete(`/users/${user._id}`);
      if (data.success) {
        toast.success("Account deleted");
        dispatch(logout());
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setDeletingAccount(false);
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-slate-300 rounded-md h-11 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#009577]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            className="w-full border border-slate-300 rounded-md h-11 px-3 text-sm focus:outline-none pointer-events-none text-muted-500 bg-slate-100"
            readOnly
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Phone (10 digits)
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={10}
            className="w-full border border-slate-300 rounded-md h-11 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#009577]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Only required to change your password"
            className="w-full border border-slate-300 rounded-md h-11 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#009577]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full border border-slate-300 rounded-md h-11 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#009577]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full border border-slate-300 rounded-md h-11 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#009577]"
          />
        </div>
        <button
          type="submit"
          disabled={savingProfile}
          className="bg-[#009577] hover:bg-[#007d63] text-white h-11 rounded-md text-sm font-semibold transition disabled:opacity-50"
        >
          {savingProfile ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-red-600">Delete Account</p>
          <p className="text-xs text-slate-500">
            Permanently remove your account and data.
          </p>
        </div>
        <button
          onClick={handleDeleteAccount}
          disabled={deletingAccount}
          className="px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold transition disabled:opacity-50"
        >
          {deletingAccount ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
