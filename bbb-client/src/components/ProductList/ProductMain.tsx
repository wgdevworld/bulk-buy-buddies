import React, { useState } from "react";
import ProductCard from "./ProductCard";
import "./products.css";
import constants from "../../../../bbb-shared/constants.json";

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
  const [category, setCategory] = useState("");

  const categories = Object.keys(constants.categories);

  const handleSearch = async () => {
    console.log("searching for", category);
    try {
      const url = `http://127.0.0.1:5000/search?query=${encodeURIComponent(
        searchTerm
      )}&min_price=${encodeURIComponent(
        minPrice
      )}&max_price=${encodeURIComponent(
        maxPrice
      )}&category=${encodeURIComponent(category)}`;
      const response = await fetch(url);
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
        {[
          <option key={""} value={""}>
            All
          </option>,
          categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          )),
          ,
        ]}
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
