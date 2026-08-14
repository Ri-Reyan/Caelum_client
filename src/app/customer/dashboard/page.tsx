"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AxiosInstance from "@/utils/axiosInstance";
import icon from "@/app/icon.png";
import LogoutButton from "@/app/(publicGroup)/_actions/handleLogout";

// Interface
interface Order {
  id: string;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  createdAt: string;
}

export default function CustomerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const router = useRouter();

  // Fetch Orders
  const fetchOrders = async (statusFilter?: string) => {
    try {
      setLoading(true);
      const url =
        statusFilter && statusFilter !== "ALL"
          ? `/api/customer/all-orders?status=${statusFilter}`
          : "/api/customer/all-orders";

      const res = await AxiosInstance.get(url);
      setOrders(res.data.data || res.data); // Response Structure অনুযায়ী সেট করো
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders(activeTab);
  }, [activeTab]);

  // Logout Handler
  const handleLogout = async () => {
    try {
      await AxiosInstance.post("/auth/user/logout"); // তোমার লগআউট এন্ডপয়েন্ট
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar Component */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-gray-200 bg-white p-4">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3 px-2">
          <Image src={icon} alt="Logo" width={32} height={32} />
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Caelum
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-900"
          >
            📦 My Orders
          </Link>
          <LogoutButton />
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-100 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Customer Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Manage and track your recent orders
              </p>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="mb-6 flex gap-2 border-b border-gray-200 pb-3">
            {["ALL", "PENDING", "CONFIRMED", "DELIVERED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Orders Table Area */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-sm text-gray-500">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No orders found.
              </div>
            ) : (
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="border-b border-gray-100 bg-gray-50/50 text-xs uppercase text-gray-400">
                  <tr>
                    <th className="px-6 py-3.5 font-medium">Order ID</th>
                    <th className="px-6 py-3.5 font-medium">Date</th>
                    <th className="px-6 py-3.5 font-medium">Status</th>
                    <th className="px-6 py-3.5 font-medium text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-medium text-gray-900">
                        #{order.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            order.status === "DELIVERED"
                              ? "bg-green-50 text-green-700"
                              : order.status === "PENDING"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/customer/dashboard/order/${order.id}`}
                          className="text-xs font-semibold text-gray-900 hover:underline"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
