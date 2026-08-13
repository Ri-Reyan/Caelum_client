"use client";

import AxiosInstance from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Plus,
  Tags,
  Trash2,
  Watch,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type WatchFormData = {
  name: string;
  description: string;
  price: string;
  features: string[];
  technicalData: string[];
  bracelet: string[];
  pictures: string[];
  tag: string;
};

const normalizeGoogleDriveImageUrl = (input: string) => {
  const trimmed = input.trim();

  if (!trimmed) return "";

  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/i);

  if (driveMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  return trimmed;
};

const sanitizeArrayValues = (values: string[]) =>
  values
    .map((item) => normalizeGoogleDriveImageUrl(item))
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => {
      try {
        new URL(item);
        return true;
      } catch {
        return false;
      }
    });

const AddWatchPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<WatchFormData>({
    name: "",
    description: "",
    price: "",
    features: [""],
    technicalData: [""],
    bracelet: [""],
    pictures: [""],
    tag: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* Basic input change                                                     */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* Array field change                                                     */

  const handleArrayChange = (
    field: "features" | "technicalData" | "bracelet" | "pictures",
    index: number,
    value: string,
  ) => {
    setFormData((prev) => {
      const updated = [...prev[field]];

      updated[index] = value;

      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  /* Add array item                                                         */

  const addArrayItem = (
    field: "features" | "technicalData" | "bracelet" | "pictures",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  /* Remove array item                                                      */

  const removeArrayItem = (
    field: "features" | "technicalData" | "bracelet" | "pictures",
    index: number,
  ) => {
    setFormData((prev) => {
      const updated = prev[field].filter((_, i) => i !== index);

      return {
        ...prev,
        [field]: updated.length > 0 ? updated : [""],
      };
    });
  };

  /* Submit                                                                 */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanedData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      features: sanitizeArrayValues(formData.features),
      technicalData: sanitizeArrayValues(formData.technicalData),
      bracelet: sanitizeArrayValues(formData.bracelet),
      pictures: sanitizeArrayValues(formData.pictures),
      tag: formData.tag.trim(),
    };

    if (!cleanedData.name) {
      setError("Name is required.");
      return;
    }

    if (!cleanedData.description) {
      setError("Description is required.");
      return;
    }

    if (cleanedData.price <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (cleanedData.features.length === 0) {
      setError("Add at least one feature.");
      return;
    }

    if (cleanedData.technicalData.length === 0) {
      setError("Add at least one technical detail.");
      return;
    }

    if (cleanedData.bracelet.length === 0) {
      setError("Add at least one bracelet detail.");
      return;
    }

    if (!cleanedData.tag) {
      setError("Category tag is required.");
      return;
    }

    if (cleanedData.pictures.length === 0) {
      setError("Add at least one valid picture URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await AxiosInstance.post("/api/admin/add", cleanedData);

      if (response.data.success) {
        setSuccess("Watch created successfully!");

        setTimeout(() => {
          router.push("/admin/dashboard");
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
      }>;

      setError(
        axiosError.response?.data?.message ||
          "Failed to create watch. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header                                                        */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-950"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-950 text-white">
              <Watch size={27} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-stone-950">
                Add New Watch
              </h1>

              <p className="mt-1 text-sm text-stone-500">
                Add a new product to your watch catalog.
              </p>
            </div>
          </div>
        </div>

        {/* Messages                                                      */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
            {success}
          </div>
        )}

        {/* Form                                                          */}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information                                         */}

          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Basic Information</h2>

              <p className="mt-1 text-sm text-stone-500">
                General information about the watch.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}

              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Watch Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rolex Submariner"
                  required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-950 focus:bg-white"
                />
              </div>

              {/* Price */}

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Price
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                    $
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-8 pr-4 text-sm outline-none transition focus:border-stone-950 focus:bg-white"
                  />
                </div>
              </div>

              {/* Category */}

              <div>
                <label
                  htmlFor="tag"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Category
                </label>

                <div className="relative">
                  <Tags
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <input
                    id="tag"
                    name="tag"
                    type="text"
                    value={formData.tag}
                    onChange={handleChange}
                    placeholder="e.g. Luxury"
                    required
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-stone-950 focus:bg-white"
                  />
                </div>
              </div>

              {/* Description */}

              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a detailed description of the watch..."
                  rows={5}
                  required
                  className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-950 focus:bg-white"
                />
              </div>
            </div>
          </section>

          {/* Features                                                   */}

          <ArraySection
            title="Features"
            description="Add the main features of this watch."
            field="features"
            values={formData.features}
            placeholder="e.g. Automatic movement"
            onChange={handleArrayChange}
            onAdd={addArrayItem}
            onRemove={removeArrayItem}
          />

          {/* Technical Data                                             */}

          <ArraySection
            title="Technical Data"
            description="Add technical specifications of the watch."
            field="technicalData"
            values={formData.technicalData}
            placeholder="e.g. Case diameter: 41mm"
            onChange={handleArrayChange}
            onAdd={addArrayItem}
            onRemove={removeArrayItem}
          />

          {/* Bracelet                                                   */}

          <ArraySection
            title="Bracelet"
            description="Add bracelet or strap information."
            field="bracelet"
            values={formData.bracelet}
            placeholder="e.g. Stainless steel"
            onChange={handleArrayChange}
            onAdd={addArrayItem}
            onRemove={removeArrayItem}
          />

          {/* Pictures                                                   */}

          <ArraySection
            title="Pictures"
            description="Add image URLs for the watch."
            field="pictures"
            values={formData.pictures}
            placeholder="https://example.com/watch-image.jpg"
            onChange={handleArrayChange}
            onAdd={addArrayItem}
            onRemove={removeArrayItem}
            imageField
          />

          {/* Submit                                                      */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Create Watch
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

/* ARRAY SECTION */

type ArrayField = "features" | "technicalData" | "bracelet" | "pictures";

type ArraySectionProps = {
  title: string;
  description: string;
  field: ArrayField;
  values: string[];
  placeholder: string;
  imageField?: boolean;
  onChange: (field: ArrayField, index: number, value: string) => void;
  onAdd: (field: ArrayField) => void;
  onRemove: (field: ArrayField, index: number) => void;
};

const ArraySection = ({
  title,
  description,
  field,
  values,
  placeholder,
  imageField = false,
  onChange,
  onAdd,
  onRemove,
}: ArraySectionProps) => {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>

          <p className="mt-1 text-sm text-stone-500">{description}</p>
        </div>

        <button
          type="button"
          onClick={() => onAdd(field)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {values.map((value, index) => (
          <div key={`${field}-${index}`} className="flex gap-3">
            <div className="relative flex-1">
              {imageField && (
                <ImagePlus
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
                />
              )}

              <input
                type="text"
                value={value}
                onChange={(e) => onChange(field, index, e.target.value)}
                placeholder={placeholder}
                className={`w-full rounded-xl border border-stone-200 bg-stone-50 py-3 text-sm outline-none transition focus:border-stone-950 focus:bg-white ${
                  imageField ? "pl-11 pr-4" : "px-4"
                }`}
              />
            </div>

            <button
              type="button"
              onClick={() => onRemove(field, index)}
              disabled={values.length === 1}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-stone-200 text-stone-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AddWatchPage;
