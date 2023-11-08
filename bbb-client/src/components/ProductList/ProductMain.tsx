import React, { useState } from "react";
import Image from "next/image";
import ProductCard from "./ProductCard";
import "./products.css";

export interface Product {
  _id: string;
  name: string;
  price: number;
  src: string;
}
function ProductMain() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("meat");

  const handleSearch = async () => {
    console.log("searching for", searchTerm);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/search?query=${encodeURIComponent(
          searchTerm
        )}&min_price=${minPrice}&max_price=${maxPrice}&category=${category}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.results);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a product..."
      />
      <input
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="Min price"
      />
      <input
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="Max price"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="meat">Meat</option>
        {/* Add more categories as they become available */}
      </select>
      <button onClick={handleSearch}>Search</button>
        <ul className="product-list">
          {products.map((product: Product) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </ul>
    </div>
  );
}

export default ProductMain;
