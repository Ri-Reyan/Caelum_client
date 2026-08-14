"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowLeft,
  Loader2,
  MapPin,
  Hash,
  CreditCard,
} from "lucide-react";
import AxiosInstance from "@/utils/axiosInstance";
import Image from "next/image";

interface WatchItem {
  id: string;
  name: string;
  description: string;
  price: number;
  pictures: string[];
}

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const watchId = params.watchId as string;

  const [watch, setWatch] = useState<WatchItem | null>(null);
  const [loadingWatch, setLoadingWatch] = useState(true);

  // Form State
  const [quantity, setQuantity] = useState<number>(1);
  const [location, setLocation] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Helpers: normalize Google Drive preview links and extract first image URL
  const normalizeGoogleDriveImageUrl = (value: string) => {
    if (!value) return value;

    const trimmed = value.trim();

    const directMatch = trimmed.match(
      /drive\.google\.com\/uc\?export=view&id=([a-zA-Z0-9_-]+)/i,
    );

    const fileMatch = trimmed.match(
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i,
    );

    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);

    const fileId = directMatch?.[1] || fileMatch?.[1] || idMatch?.[1];

    const id = directMatch?.[1] || fileMatch?.[1] || idMatch?.[1];

    if (id) {
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }

    return trimmed
      .replace(/\\[+|\\]+$/g, "")
      .replace(/^['"]+|['"]+$/g, "")
      .trim();
  };

  const extractFirstImageUrl = (value: unknown): string | undefined => {
    if (!value) return undefined;

    // If it's an array, try each element
    if (Array.isArray(value)) {
      for (const item of value) {
        const s = String(item ?? "").trim();
        if (!s) continue;
        const maybe = normalizeGoogleDriveImageUrl(s);
        if (maybe && maybe.startsWith("http")) return maybe;
      }
      return undefined;
    }

    if (typeof value === "string") {
      const text = value.trim();
      if (!text) return undefined;

      // Remove surrounding brackets and outer quotes
      const normalizedText = text
        .replace(/\\[+|\\]+$/g, "")
        .replace(/\\"/g, '"')
        .trim();

      // Try comma split
      const parts = normalizedText
        .split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/)
        .map((p) => p.trim().replace(/^['"]+|['"]+$/g, ""))
        .filter(Boolean);

      if (parts.length === 0) {
        // Try whitespace split
        const ws = normalizedText
          .split(/\\s+/)
          .map((p) => p.trim().replace(/^['"]+|['"]+$/g, ""))
          .filter(Boolean);
        for (const p of ws) {
          const maybe = normalizeGoogleDriveImageUrl(p);
          if (maybe && maybe.startsWith("http")) return maybe;
        }
        return undefined;
      }

      for (const p of parts) {
        const maybe = normalizeGoogleDriveImageUrl(p);
        if (maybe && maybe.startsWith("http")) return maybe;
      }
    }

    return undefined;
  };

  useEffect(() => {
    if (!watchId) return;

    const fetchWatch = async () => {
      try {
        const response = await AxiosInstance.get(`/api/watch/${watchId}`);
        if (response.data?.success && response.data?.data) {
          setWatch(response.data.data);
        } else {
          setErrorMsg(response.data?.message || "Watch details not found");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setErrorMsg(
          err?.response?.data?.message || "Failed to fetch product details",
        );
      } finally {
        setLoadingWatch(false);
      }
    };

    fetchWatch();
  }, [watchId]);

  // Handle Place Order API call
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await AxiosInstance.post(
        `/api/customer/place-order/${watchId}`,
        {
          quantity: Number(quantity),
          location: location.trim(),
        },
      );

      if (response.data?.success) {
        const createdOrder = response.data.data;
        // Proceed to Checkout Page with created order ID
        router.push(`/customer/checkout/${createdOrder.id}`);
      } else {
        throw new Error(response.data?.message || "Failed to create order");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || err.message || "Something went wrong!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = watch ? watch.price * quantity : 0;

  const imageSrc =
    extractFirstImageUrl(watch?.pictures) ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

  if (loadingWatch) {
    return (
      <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center text-stone-400">
        <Loader2 className="animate-spin text-white" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f12] text-stone-100 py-12 px-4 sm:px-8 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-[#18181b] border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-6 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition"
          >
            <ArrowLeft size={16} /> Back to Store
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck size={14} /> Pre-Order
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* PRODUCT CARD */}
          <div className="bg-[#121214] border border-stone-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="relative w-full h-56 rounded-xl overflow-hidden bg-stone-900 mb-4 border border-stone-800">
                <Image
                  src={imageSrc}
                  alt={(watch?.name as string) ?? "Watch image"}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white">{watch?.name}</h3>
              <p className="text-stone-400 text-xs mt-2 leading-relaxed">
                {watch?.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-stone-500 font-semibold">
                  Unit Price
                </p>
                <p className="text-lg font-bold text-white">
                  ${watch?.price.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase text-stone-500 font-semibold">
                  Total Price
                </p>
                <p className="text-xl font-black text-emerald-400">
                  ${totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* SHIPPING & QUANTITY FORM */}
          <form
            onSubmit={handlePlaceOrder}
            className="space-y-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-white">
                Shipping Details
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Provide quantity and delivery information.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-2 items-center gap-1.5">
                  <Hash size={14} /> Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-full bg-[#121214] border border-stone-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-stone-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-stone-400 mb-2 items-center gap-1.5">
                  <MapPin size={14} /> Delivery Address
                </label>
                <textarea
                  rows={4}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter complete address (House, Road, City)"
                  className="w-full bg-[#121214] border border-stone-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-stone-500 transition resize-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-white text-stone-950 font-bold text-sm hover:bg-stone-200 transition shadow-lg flex justify-center items-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Proceed to Payment <CreditCard size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
