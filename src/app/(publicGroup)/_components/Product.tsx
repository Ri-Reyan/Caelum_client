"use client";

import Loading from "@/app/loading";
import AxiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";

type Watch = {
  id: string;
  name: string;
  price: number;
};

const Product = () => {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatch = async () => {
      try {
        const res = await AxiosInstance.get("/api/watch");

        setWatches(res.data.data);
      } catch (error) {
        console.error("Failed to fetch watches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatch();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {watches.map((watch) => (
        <div key={watch.id}>
          <h2>{watch.name}</h2>
          <p>${watch.price}</p>
        </div>
      ))}
    </div>
  );
};

export default Product;
