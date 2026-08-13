"use client";

import { Search, Watch, X, Sparkles } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AxiosInstance from "@/utils/axiosInstance";

// ========================================================================
// TYPES (Matching Express Backend / Prisma Models)
// ========================================================================

interface WatchItem {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  technicalData: string[];
  bracelet: string[];
  pictures: string[];
  categoriId?: string;
  createdAt?: string;
}

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

  const id = directMatch?.[1] || fileMatch?.[1] || idMatch?.[1];

  if (id) {
    return `https://drive.google.com/uc?export=view&id=${id}`;
  }

  return trimmed
    .replace(/^\[+|\]+$/g, "")
    .replace(/^['"]+|['"]+$/g, "")
    .trim();
};

const normalizeStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => normalizeStringArray(item))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  const text = value.trim();
  if (!text) return [];

  const normalizedText = text
    .replace(/^\[+|\]+$/g, "")
    .replace(/\\"/g, '"')
    .trim();

  if (!normalizedText) return [];

  const parts = normalizedText
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
    .map((part) => part.trim().replace(/^['"]+|['"]+$/g, ""))
    .filter(Boolean);

  if (parts.length > 0) {
    return parts;
  }

  return [normalizedText.replace(/^['"]+|['"]+$/g, "")];
};

const normalizeWatchData = (
  watch: Partial<WatchItem> & Record<string, unknown>,
): WatchItem => {
  const pictures = normalizeStringArray(watch?.pictures)
    .map(normalizeGoogleDriveImageUrl)
    .filter((url) => typeof url === "string" && url.startsWith("http"));
  const features = normalizeStringArray(watch?.features);
  const technicalData = normalizeStringArray(watch?.technicalData);
  const bracelet = normalizeStringArray(watch?.bracelet);

  return {
    id: String(watch?.id ?? ""),
    name: String(watch?.name ?? ""),
    description: String(watch?.description ?? ""),
    price: Number(watch?.price ?? 0),
    features,
    technicalData,
    bracelet,
    pictures,
    categoriId: watch?.categoriId ? String(watch.categoriId) : undefined,
    createdAt: watch?.createdAt ? String(watch.createdAt) : undefined,
  };
};

const unwrapWatchList = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if ("data" in record) {
      return unwrapWatchList(record.data);
    }

    const looksLikeWatchObject =
      typeof record.id === "string" ||
      typeof record.name === "string" ||
      typeof record.pictures !== "undefined";

    if (looksLikeWatchObject) {
      return [record];
    }
  }

  return [];
};

export default function PublicWatchesPage() {
  const [watches, setWatches] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Watch ID for Single Product API Fetch
  const [selectedWatchId, setSelectedWatchId] = useState<string | null>(null);
  const [selectedWatch, setSelectedWatch] = useState<WatchItem | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // 1. FETCH ALL WATCHES (/api/watch)
  useEffect(() => {
    const fetchAllWatches = async () => {
      try {
        const res = await AxiosInstance.get("/api/watch");
        const result = res.data;

        const list = unwrapWatchList(result?.data ?? result);
        setWatches(
          list.map((item) =>
            normalizeWatchData(
              item as Partial<WatchItem> & Record<string, unknown>,
            ),
          ),
        );
      } catch (err) {
        console.error("Error fetching watches:", err);
        setWatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllWatches();
  }, []);

  // 2. FETCH SINGLE WATCH BY ID (/api/watch/:id)
  useEffect(() => {
    if (!selectedWatchId) return;

    const fetchWatchDetails = async () => {
      setModalLoading(true);
      try {
        const res = await AxiosInstance.get(`/api/watch/${selectedWatchId}`);
        const result = res.data;

        const watchData = unwrapWatchList(result?.data ?? result)[0];

        if (watchData) {
          setSelectedWatch(
            normalizeWatchData(
              watchData as Partial<WatchItem> & Record<string, unknown>,
            ),
          );
        }
      } catch (err) {
        console.error("Error fetching single watch details:", err);
      } finally {
        setModalLoading(false);
      }
    };

    fetchWatchDetails();
  }, [selectedWatchId]);

  const handleCloseModal = () => {
    setSelectedWatchId(null);
    setSelectedWatch(null);
  };

  const filteredWatches = watches.filter((w) => {
    const name = (w.name ?? "").toLowerCase();
    const description = (w.description ?? "").toLowerCase();
    const term = searchTerm.toLowerCase();

    return name.includes(term) || description.includes(term);
  });

  return (
    <div className="min-h-screen bg-[#0f0f12] text-stone-100 px-4 py-12 sm:px-8 lg:px-16 selection:bg-white selection:text-stone-900">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
              <Watch size={14} className="text-white" /> Executive Collection
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Caelum Catalog
            </h1>
            <p className="mt-2 text-stone-400 max-w-xl text-sm sm:text-base leading-relaxed">
              Explore our hand-crafted luxury watch catalog. Precision
              engineering meets unmatched elegance.
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search timepieces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#18181b] border border-stone-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-stone-500 transition shadow-inner"
            />
          </div>
        </div>

        {/* WATCH GRID SECTION */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-107.5 rounded-[2rem] bg-[#18181b]/50 border border-stone-800 animate-pulse p-4 flex flex-col justify-between"
              >
                <div className="w-full h-60 bg-stone-800/40 rounded-[1.5rem]" />
                <div className="space-y-3 px-2">
                  <div className="w-3/4 h-6 bg-stone-800/50 rounded-md" />
                  <div className="w-full h-4 bg-stone-800/30 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredWatches.length === 0 ? (
          <div className="text-center py-24 bg-[#161619] rounded-3xl border border-stone-800 my-8">
            <Watch size={48} className="mx-auto text-stone-600 mb-4" />
            <h3 className="text-xl font-bold text-white">
              No timepieces found
            </h3>
            <p className="text-stone-400 text-sm mt-1">
              Make sure your Express server is running or add products from
              admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
            {filteredWatches.map((watch) => (
              <WatchCard
                key={watch.id}
                watch={watch}
                onOpenDetails={() => setSelectedWatchId(watch.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL (Triggered by /api/watch/:id) */}
      {(selectedWatchId || selectedWatch) && (
        <WatchDetailModal
          loading={modalLoading}
          watch={selectedWatch}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

// ========================================================================
// WATCH CARD COMPONENT (Matching Screenshot Curvatures & Aesthetics)
// ========================================================================

interface WatchCardProps {
  watch: WatchItem;
  onOpenDetails: () => void;
}

const WatchCard = ({ watch, onOpenDetails }: WatchCardProps) => {
  const imageUrl = normalizeGoogleDriveImageUrl(
    watch.pictures && watch.pictures.length > 0 ? watch.pictures[0] : "",
  );
  {
    console.log(watch);
  }
  const isGoogleDriveImage = imageUrl.includes("drive.google.com");

  return (
    <div className="group relative bg-[#18181b] border border-stone-800/90 rounded-[2rem] p-4 flex flex-col justify-between shadow-2xl transition duration-300 hover:border-stone-700 hover:-translate-y-1">
      {/* IMAGE CONTAINER WITH CURVED BADGES */}
      <div className="relative w-full h-60 rounded-[1.5rem] overflow-hidden bg-stone-900">
        <Image
          src={imageUrl}
          alt={watch.name}
          width={1200}
          height={900}
          unoptimized={isGoogleDriveImage}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 ease-out"
        />

        {/* Curved Top-Right Badge */}
        <div className="absolute top-0 right-0 bg-white text-stone-950 font-bold text-[11px] px-4 py-1.5 rounded-bl-2xl shadow-md tracking-wider">
          New
        </div>

        {/* Curved Bottom-Left Badge */}
        <div className="absolute bottom-0 left-0 bg-[#18181b] text-stone-300 text-[10px] font-semibold tracking-widest uppercase px-4 py-2 rounded-tr-2xl border-t border-r border-stone-800">
          FEATURED
        </div>
      </div>

      {/* CARD CONTENT */}
      <div className="mt-5 px-2 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
            {watch.name}
          </h3>
          <p className="mt-2 text-stone-400 text-xs line-clamp-2 leading-relaxed">
            {watch.description}
          </p>
        </div>

        {/* CARD FOOTER */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-stone-700 to-stone-500 flex items-center justify-center text-xs font-bold text-white">
              C
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">
                Price
              </p>
              <p className="text-sm font-bold text-white">
                ${watch.price.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenDetails}
            className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-950 hover:bg-white px-5 py-2.5 rounded-full font-bold text-xs transition duration-200 shadow-md active:scale-95"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

// ========================================================================
// WATCH DETAIL MODAL COMPONENT
// ========================================================================

interface WatchDetailModalProps {
  loading: boolean;
  watch: WatchItem | null;
  onClose: () => void;
}

const WatchDetailModal = ({
  loading,
  watch,
  onClose,
}: WatchDetailModalProps) => {
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (watch?.pictures && watch.pictures.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveImage(normalizeGoogleDriveImageUrl(watch.pictures[0]));
    }
  }, [watch]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#141416] border border-stone-800 rounded-3xl p-6 sm:p-8 overflow-y-auto text-white shadow-2xl">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white bg-stone-900 rounded-full border border-stone-800 transition z-10"
        >
          <X size={20} />
        </button>

        {loading || !watch ? (
          <div className="py-20 text-center space-y-3">
            <Sparkles
              size={32}
              className="mx-auto text-stone-500 animate-spin"
            />
            <p className="text-stone-400 text-sm">
              Fetching timepiece specs from server...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT: IMAGES */}
            <div className="space-y-4">
              <div className="w-full h-72 rounded-2xl overflow-hidden bg-stone-900 border border-stone-800">
                <Image
                  src={normalizeGoogleDriveImageUrl(
                    activeImage ||
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
                  )}
                  alt={watch.name}
                  width={1200}
                  height={900}
                  unoptimized={(activeImage || "").includes("drive.google.com")}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* GALLERY THUMBNAILS */}
              {watch.pictures && watch.pictures.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {watch.pictures.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                        activeImage === img
                          ? "border-white"
                          : "border-stone-800 opacity-60"
                      }`}
                    >
                      <Image
                        src={normalizeGoogleDriveImageUrl(img)}
                        alt=""
                        width={200}
                        height={200}
                        unoptimized={img.includes("drive.google.com")}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: DETAILS */}
            <div className="space-y-6 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Official Stock
                </span>
                <h2 className="text-2xl font-black mt-3">{watch.name}</h2>
                <p className="text-2xl font-bold text-white mt-1">
                  ${watch.price.toLocaleString()}
                </p>
                <p className="text-stone-400 text-xs leading-relaxed mt-4">
                  {watch.description}
                </p>
              </div>

              {/* FEATURES */}
              {watch.features && watch.features.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Features
                  </h4>
                  <ul className="space-y-1 text-xs text-stone-300">
                    {watch.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />{" "}
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* TECHNICAL DATA */}
              {watch.technicalData && watch.technicalData.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Technical Specs
                  </h4>
                  <div className="grid grid-cols-1 gap-1 text-xs text-stone-400 bg-stone-900/80 p-3 rounded-xl border border-stone-800">
                    {watch.technicalData.map((tech, i) => (
                      <p key={i}>• {tech}</p>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => alert("Redirecting to order/checkout...")}
                className="w-full py-3.5 rounded-xl bg-white text-stone-950 font-bold text-sm hover:bg-stone-200 transition shadow-lg active:scale-98"
              >
                Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
