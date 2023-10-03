import React from "react";
import Image from "next/image";
import { Product } from "./ProductMain";
import "./products.css";

function ProductCard({ product }: { product: Product }) {
  return (
    <li className="product-card" key={product._id}>
      <Image src={product.src} alt={product.name} width={250} height={250} />
      <p className="product-card-text" title={product.name}>{product.name}</p>
      <p>{product.price}</p>
    </li>
  );
}

export default ProductCard;
