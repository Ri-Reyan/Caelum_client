"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import AxiosInstance from "@/utils/axiosInstance";

// Interface according to your Prisma Order & Watch model
interface Watch {
  id: string;
  name: string;
  title?: string;
  image: string;
  price: number;
}

interface OrderDetails {
  id: string;
  quantity: number;
  totalPrice: number;
  location: string;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELED";
  delivery?: string; // Estimated delivery date/info
  createdAt: string;
  watch: Watch;
}

export default function PreOrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await AxiosInstance.get(`/api/customer/order/${orderId}`);
        setOrder(res.data.data || res.data);
      } catch (error) {
        console.error("Failed to fetch pre-order details", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm font-medium text-gray-500">
          Loading pre-order details...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="text-sm font-medium text-gray-500">
          Pre-order record not found!
        </div>
        <Link
          href="/customer/dashboard"
          className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
      <div className="mx-auto max-w-4xl">
        {/* Navigation Back */}
        <Link
          href="/customer/dashboard"
          className="mb-6 inline-flex items-center text-xs font-semibold text-gray-500 transition-colors hover:text-gray-900"
        >
          ← Back to Pre-orders
        </Link>

        {/* Status Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Pre-Order #{order.id.slice(0, 8)}
              </h1>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                  order.status === "DELIVERED"
                    ? "bg-green-50 text-green-700"
                    : order.status === "CONFIRMED"
                      ? "bg-blue-50 text-blue-700"
                      : order.status === "CANCELED"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
              Total Pre-Order Price
            </span>
            <span className="text-2xl font-bold text-gray-900">
              ৳{order.totalPrice}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Watch & Order Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Product Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Reserved Timepiece
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shrink-0">
                  {order.watch?.image ? (
                    <Image
                      src={order.watch.image}
                      alt={order.watch.name || "Pre-order Watch"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">
                      ⌚
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900">
                    {order.watch?.name ||
                      order.watch?.title ||
                      "Exclusive Watch"}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Quantity Reserved: {order.quantity}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    Unit Price: ৳
                    {order.watch?.price || order.totalPrice / order.quantity}
                  </p>
                </div>
              </div>
            </div>

            {/* Estimated Delivery Status Box */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
              <div className="flex items-start gap-3">
                <span className="text-xl">🚚</span>
                <div>
                  <h3 className="text-sm font-bold text-blue-950">
                    Estimated Delivery Window
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-blue-800">
                    {order.delivery
                      ? order.delivery
                      : "Expected to ship within 7-14 business days after batch release."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Shipping Location */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-fit space-y-6">
            <div>
              <h2 className="mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Delivery Location
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                {order.location}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h2 className="mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Payment Information
              </h2>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Method:</span>
                <span className="font-semibold text-gray-900">
                  Pre-Order Advance / COD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
