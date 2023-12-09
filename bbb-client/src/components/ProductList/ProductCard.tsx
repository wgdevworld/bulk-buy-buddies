import React from "react";
import Image from "next/image";
import { Product } from "./ProductMain";

function ProductCard({
  product,
  setModalVisible,
  setSelectedProductId,
}: {
  product: Product;
  setModalVisible: (visible: boolean) => void;
  setSelectedProductId: (id: string) => void;
}) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105">
      <div className="relative aspect-w-1 aspect-h-1">
        <Image
          sizes="(min-width: 600px) 50vw, 100vw"
          src={product.src}
          alt={product.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h2 className="flex items-baseline justify-between mb-2">
          {product.name}
        </h2>
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-gray-700">${product.price}</p>
          <button
            onClick={() => {
              setSelectedProductId(product._id);
              setModalVisible(true);
            }}
            className="bg-blue-500 px-3 py-2 mt-4 rounded-full hover:bg-blue-600md:w-auto"
          >
            ❔
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
