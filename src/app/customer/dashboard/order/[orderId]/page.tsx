"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import AxiosInstance from "@/utils/axiosInstance";

// Types
interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    title: string;
    image: string;
  };
}

interface OrderDetails {
  id: string;
  status: "PENDING" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  createdAt: string;
  address?: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
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
        console.error("Failed to fetch order details", error);
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
          Loading order details...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="text-sm font-medium text-gray-500">
          Order not found!
        </div>
        <Link
          href="/dashboard"
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
          href="/dashboard"
          className="mb-6 inline-flex items-center text-xs font-semibold text-gray-500 transition-colors hover:text-gray-900"
        >
          ← Back to My Orders
        </Link>

        {/* Top Header Card */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Order #{order.id.slice(0, 8)}
              </h1>
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
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
              {new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">
              Total Amount
            </span>
            <span className="text-2xl font-bold text-gray-900">
              ৳{order.totalAmount}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Order Items Table */}
          <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-gray-900 uppercase tracking-wider">
              Order Items
            </h2>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                      {item.product?.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-300">
                          📦
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {item.product?.title || "Product"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × ৳{item.price}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ৳{item.quantity * item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="mt-6 border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span>
                <span>৳{order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Delivery Fee</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-50">
                <span>Total</span>
                <span>৳{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Delivery Details Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
            <h2 className="mb-4 text-sm font-bold text-gray-900 uppercase tracking-wider">
              Delivery Details
            </h2>
            <div className="space-y-4 text-xs text-gray-600">
              <div>
                <span className="font-semibold text-gray-900 block mb-1">
                  Shipping Address
                </span>
                <p className="leading-relaxed text-gray-500">
                  {order.address || "Standard Home Delivery Address"}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-900 block mb-1">
                  Payment Status
                </span>
                <span className="inline-flex rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                  Paid
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
