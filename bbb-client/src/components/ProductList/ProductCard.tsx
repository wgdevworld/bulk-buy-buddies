import React from "react";
import Image from "next/image";
import { Product } from "./ProductMain";

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105">
      <div className="relative aspect-w-1 aspect-h-1">
        <Image
          src={product.src}
          alt={product.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-sm font-semibold mb-2">{product.name}</h2>
        <p className="text-gray-700">${product.price}</p>
      </div>
    </div>
  );
}

export default ProductCard;
