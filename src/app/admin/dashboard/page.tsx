"use client";

import AxiosInstance from "@/utils/axiosInstance";
import {
  BarChart3,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  ShoppingBag,
  Users,
  Watch as WatchIcon,
  X,
  Trash2,
  Plus,
} from "lucide-react";
import React, { useState, useEffect } from "react";

type DashboardPage = "overview" | "watches" | "customers" | "orders" | "admins";

interface WatchData {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  technicalData: string[];
  bracelet: string[];
  pictures: string[];
  categoriId: string;
  createdAt: string;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface OrderData {
  id: string;
  customerId: string;
  watchId: string;
  quantity: number;
  totalPrice: number;
  location: string;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELED";
  createdAt: string;
}

interface AdminData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const navigationItems = [
  { id: "overview" as DashboardPage, label: "Overview", icon: LayoutDashboard },
  { id: "watches" as DashboardPage, label: "Watches", icon: WatchIcon },
  { id: "customers" as DashboardPage, label: "Customers", icon: Users },
  { id: "orders" as DashboardPage, label: "Orders", icon: ShoppingBag },
  { id: "admins" as DashboardPage, label: "Admins", icon: ShieldCheck },
];

// MAIN DASHBOARD COMPONENT

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState<DashboardPage>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePageChange = (page: DashboardPage) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const activeItem = navigationItems.find((item) => item.id === activePage);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-stone-950 text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-stone-950">
              <WatchIcon size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Caelum</h1>
              <p className="text-xs text-stone-500">Admin Panel</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-stone-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            Management
          </p>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "bg-white text-stone-950 shadow-sm"
                      : "text-stone-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={19} strokeWidth={active ? 2.3 : 1.8} />
                  <span>{item.label}</span>
                  {active && <ChevronRight size={16} className="ml-auto" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-700 text-sm font-bold">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Administrator</p>
              <p className="truncate text-xs text-stone-500">
                admin@caelum.com
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-stone-500 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-stone-200 bg-stone-100/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-stone-200 bg-white p-2.5 text-stone-700 shadow-sm lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-400">
                Dashboard
              </p>
              <h2 className="mt-0.5 text-xl font-bold tracking-tight">
                {activeItem?.label}
              </h2>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-500 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              System operational
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {activePage === "overview" && <OverviewPage />}
          {activePage === "watches" && <WatchesPage />}
          {activePage === "customers" && <CustomersPage />}
          {activePage === "orders" && <OrdersPage />}
          {activePage === "admins" && <AdminsPage />}
        </main>
      </div>
    </div>
  );
}

// 1. OVERVIEW PAGE

const OverviewPage = () => {
  const [stats, setStats] = useState({ watches: 0, customers: 0, orders: 0 });

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const [wRes, cRes, oRes] = await Promise.allSettled([
          AxiosInstance.get("/api/admin/fetch-watch"),
          AxiosInstance.get("/api/admin/customer"),
          AxiosInstance.get("/api/admin/fetch-order"),
        ]);

        setStats({
          watches:
            wRes.status === "fulfilled"
              ? wRes.value.data?.data?.length || 0
              : 0,
          customers:
            cRes.status === "fulfilled"
              ? cRes.value.data?.data?.length || 0
              : 0,
          orders:
            oRes.status === "fulfilled"
              ? oRes.value.data?.data?.length || 0
              : 0,
        });
      } catch (err) {
        console.error("Overview Fetch Error:", err);
      }
    };
    fetchOverviewData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-stone-500">Welcome back</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-500">
          Monitor your watch store and manage your operations from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Watches"
          value={stats.watches.toString()}
          description="Live in Database"
          icon={WatchIcon}
        />
        <StatCard
          title="Customers"
          value={stats.customers.toString()}
          description="Registered Users"
          icon={Users}
        />
        <StatCard
          title="Orders"
          value={stats.orders.toString()}
          description="Total Processed"
          icon={ShoppingBag}
        />
        <StatCard
          title="Revenue"
          value="Live Sync"
          description="Calculated on Orders"
          icon={BarChart3}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Recent Activity</h3>
              <p className="mt-1 text-sm text-stone-500">
                Latest activity across your platform
              </p>
            </div>
            <Clock3 size={20} className="text-stone-400" />
          </div>
          <div className="mt-6 space-y-4">
            <Activity
              title="System Connected"
              description="Connected directly to Express & Prisma API."
              time="Just now"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-stone-950 p-6 text-white shadow-sm">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Store Status
              </p>
              <h3 className="mt-4 text-2xl font-bold leading-tight">
                Everything is running smoothly.
              </h3>
              <p className="mt-3 text-sm leading-6 text-stone-400">
                Your Express server API endpoints are connected.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. WATCHES PAGE

const WatchesPage = () => {
  const [watches, setWatches] = useState<WatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    features: "",
    technicalData: "",
    bracelet: "",
    pictures: "",
    tag: "",
  });

  const fetchWatches = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get("/api/admin/fetch-watch");
      setWatches(res.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWatches();
  }, []);

  const handleDeleteWatch = async (watchId: string) => {
    if (!confirm("Are you sure you want to delete this watch?")) return;
    try {
      await AxiosInstance.delete(`/api/admin/delete-watch/${watchId}`);
      setWatches((prev) => prev.filter((item) => item.id !== watchId));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(
        err.response?.data?.message || err.message || "Failed to delete watch",
      );
    }
  };

  const handleAddWatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        features: formData.features.split(",").map((s) => s.trim()),
        technicalData: formData.technicalData.split(",").map((s) => s.trim()),
        bracelet: formData.bracelet.split(",").map((s) => s.trim()),
        pictures: formData.pictures.split(",").map((s) => s.trim()),
      };

      await AxiosInstance.post("/api/admin/add", payload);

      setShowAddModal(false);
      fetchWatches();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Error adding watch");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-stone-400">
            <WatchIcon size={17} />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Management
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Watches</h1>
          <p className="mt-2 text-sm text-stone-500">
            Manage your watch inventory and product catalog.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          <Plus size={17} /> Add Watch
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add New Watch</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddWatchSubmit} className="space-y-4 text-sm">
              <input
                required
                placeholder="Name"
                className="w-full p-2 border rounded-lg"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <textarea
                required
                placeholder="Description"
                className="w-full p-2 border rounded-lg"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <input
                required
                type="number"
                placeholder="Price"
                className="w-full p-2 border rounded-lg"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
              />
              <input
                required
                placeholder="Category Tag (e.g. Luxury)"
                className="w-full p-2 border rounded-lg"
                value={formData.tag}
                onChange={(e) =>
                  setFormData({ ...formData, tag: e.target.value })
                }
              />
              <input
                required
                placeholder="Features (comma separated)"
                className="w-full p-2 border rounded-lg"
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
              />
              <input
                required
                placeholder="Technical Data (comma separated)"
                className="w-full p-2 border rounded-lg"
                value={formData.technicalData}
                onChange={(e) =>
                  setFormData({ ...formData, technicalData: e.target.value })
                }
              />
              <input
                required
                placeholder="Bracelet (comma separated)"
                className="w-full p-2 border rounded-lg"
                value={formData.bracelet}
                onChange={(e) =>
                  setFormData({ ...formData, bracelet: e.target.value })
                }
              />
              <input
                required
                placeholder="Picture Image URLs (comma separated)"
                className="w-full p-2 border rounded-lg"
                value={formData.pictures}
                onChange={(e) =>
                  setFormData({ ...formData, pictures: e.target.value })
                }
              />

              <button
                type="submit"
                className="w-full py-2 bg-stone-900 text-white rounded-xl font-semibold"
              >
                Save Watch
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm overflow-x-auto">
        {loading ? (
          <p className="text-center py-8 text-stone-500">Loading watches...</p>
        ) : watches.length === 0 ? (
          <EmptyState
            icon={WatchIcon}
            title="No Watches Found"
            description="Add your first watch to start populating inventory."
          />
        ) : (
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 text-stone-900 uppercase text-xs border-b">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category ID</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {watches.map((w) => (
                <tr key={w.id} className="border-b hover:bg-stone-50">
                  <td className="p-3 font-semibold text-stone-900">{w.name}</td>
                  <td className="p-3">${w.price}</td>
                  <td className="p-3">{w.categoriId}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteWatch(w.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// 3. CUSTOMERS PAGE

const CustomersPage = () => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await AxiosInstance.get("/api/admin/customer");
        setCustomers(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm("Delete this customer?")) return;
    try {
      await AxiosInstance.delete(`/api/admin/delete-customer/${customerId}`);
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="View and manage all registered customers."
        icon={Users}
      />
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm overflow-x-auto">
        {loading ? (
          <p className="text-center py-8 text-stone-500">
            Loading customers...
          </p>
        ) : customers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Customers Found"
            description="Registered customers will appear here."
          />
        ) : (
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 text-stone-900 uppercase text-xs border-b">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b hover:bg-stone-50">
                  <td className="p-3 font-semibold text-stone-900">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-stone-100 text-stone-700 rounded text-xs">
                      {c.role}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteCustomer(c.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// 4. ORDERS PAGE

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await AxiosInstance.get("/api/admin/fetch-order");
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const res = await AxiosInstance.put(
        `/api/admin/update-order/${orderId}`,
        {
          status,
        },
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: res.data?.data?.status ?? status }
            : o,
        ),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to update order status",
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Monitor orders and update their delivery status."
        icon={ShoppingBag}
      />
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm overflow-x-auto">
        {loading ? (
          <p className="text-center py-8 text-stone-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No Orders Found"
            description="Customer orders will show up here."
          />
        ) : (
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 text-stone-900 uppercase text-xs border-b">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Total Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b hover:bg-stone-50">
                  <td className="p-3 font-mono text-xs">{o.id}</td>
                  <td className="p-3">{o.quantity}</td>
                  <td className="p-3 font-semibold">${o.totalPrice}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        o.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800"
                          : o.status === "CANCELED"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                      className="text-xs p-1.5 border rounded-lg bg-stone-50"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELED">CANCELED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// 5. ADMINS PAGE

const AdminsPage = () => {
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await AxiosInstance.get("/api/admin/fetch-admin");
        setAdmins(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm("Delete this admin?")) return;
    try {
      await AxiosInstance.delete(`/api/admin/delete-admin/${adminId}`);
      setAdmins((prev) => prev.filter((a) => a.id !== adminId));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrators"
        description="Manage administrator accounts and access."
        icon={ShieldCheck}
      />
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm overflow-x-auto">
        {loading ? (
          <p className="text-center py-8 text-stone-500">
            Loading administrators...
          </p>
        ) : admins.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No Other Admins"
            description="You are currently the only registered admin."
          />
        ) : (
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 text-stone-900 uppercase text-xs border-b">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id} className="border-b hover:bg-stone-50">
                  <td className="p-3 font-semibold text-stone-900">{a.name}</td>
                  <td className="p-3">{a.email}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteAdmin(a.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// REUSABLE HELPER COMPONENTS

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
};
const StatCard = ({ title, value, description, icon: Icon }: StatCardProps) => (
  <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-stone-500">{title}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
        <Icon size={20} className="text-stone-600" />
      </div>
    </div>
    <p className="mt-4 text-xs font-medium text-emerald-600">{description}</p>
  </div>
);

type PageHeaderProps = {
  title: string;
  description: string;
  icon: React.ElementType;
};
const PageHeader = ({ title, description, icon: Icon }: PageHeaderProps) => (
  <div>
    <div className="flex items-center gap-2 text-stone-400">
      <Icon size={17} />
      <span className="text-xs font-semibold uppercase tracking-[0.18em]">
        Management
      </span>
    </div>
    <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
    <p className="mt-2 text-sm text-stone-500">{description}</p>
  </div>
);

type EmptyStateProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};
const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => (
  <div className="flex min-h-72 flex-col items-center justify-center text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100">
      <Icon size={28} className="text-stone-500" />
    </div>
    <h3 className="mt-5 text-lg font-semibold">{title}</h3>
    <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
      {description}
    </p>
  </div>
);

type ActivityProps = { title: string; description: string; time: string };
const Activity = ({ title, description, time }: ActivityProps) => (
  <div className="flex gap-4 rounded-xl border border-stone-100 p-4">
    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-stone-900" />
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-stone-500">{description}</p>
      <p className="mt-2 text-xs text-stone-400">{time}</p>
    </div>
  </div>
);
