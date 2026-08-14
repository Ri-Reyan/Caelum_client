import { useRouter } from "next/navigation";
import AxiosInstance from "@/utils/axiosInstance";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Call Backend Logout API
      await AxiosInstance.post("/auth/user/logout");

      // 3. Redirect to Login page & Refresh state
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 cursor-pointer"
    >
      <LogOut />
      Logout
    </button>
  );
}
