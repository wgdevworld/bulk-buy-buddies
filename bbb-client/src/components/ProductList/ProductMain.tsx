"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "./products.css";
import constants from "../../../../bbb-shared/constants.json";
import ReactPaginate from "react-paginate";
import Modal from "./IndicatePresenceModal";
import Layout from "../CommonLayout";

export interface Product {
  _id: string;
  name: string;
  price: number;
  src: string;
  link: string;
}
function ProductMain() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isSetPresenceModalVisible, setIsSetPresenceModalVisible] =
    useState(false);
  const itemsPerPage = 8;
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  const categories = Object.keys(constants.categories);
  const warehouses = constants.warehouses;

  const handleString = (string: string) => {
    let ret = "";
    string.split("_").forEach((word) => {
      ret +=
        word.charAt(0).toUpperCase() + word.substring(1).toLowerCase() + " ";
    });
    return ret;
  };

  const paginate = (
    array: Product[],
    currentPage: number,
    itemsPerPage: number
  ) => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array.slice(startIndex, endIndex);
  };

  // populate page with all products on rerender
  useEffect(() => {
    handleSearch();
  }, []);

  const updateProductLocation = async (
    productId: string,
    locationId: string
  ) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/remove-location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          location_id: locationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
    } catch (error) {
      console.error("Error updating product location:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (selectedWarehouse === "") {
      alert("Please select a warehouse");
      return;
    }
    event.preventDefault();
    await updateProductLocation(selectedProductId, selectedWarehouse);
    setIsSetPresenceModalVisible(false);
    setSelectedWarehouse("");
  };

  const handleSearch = async () => {
    console.log("searching for", category);
    try {
      const url = `http://127.0.0.1:5000/search?query=${encodeURIComponent(
        searchTerm
      )}&min_price=${encodeURIComponent(
        minPrice
      )}&max_price=${encodeURIComponent(
        maxPrice
      )}&category=${encodeURIComponent(category)}&location=${encodeURIComponent(
        location
      )}`;
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
    <Layout>
      <Modal
        show={isSetPresenceModalVisible}
        close={() => {
          setSelectedWarehouse("");
          setIsSetPresenceModalVisible(false);
        }}
      >
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold pb-2">Indicate Missing Item</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="warehouse-select" className="block text-lg pb-2">
              Select the warehouse at <br /> which the item was missing
            </label>
            <select
              id="warehouse-select"
              className="block w-full px-3 py-2 mt-2 mb-4 border rounded-lg"
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
            >
              <option value="">Choose a location</option>
              {Object.entries(warehouses).map(([location, code]) => (
                <option key={code} value={code}>
                  {handleString(location)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-2"
            >
              Submit
            </button>
          </form>
        </div>
      </Modal>
      <div className="p-4">
        <div className="flex mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a product..."
            className="px-4 py-3 border rounded-lg w-full text-lg"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600 w-full md:w-auto ml-4"
          >
            Search
          </button>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-4 mt-4">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min price"
              className="px-4 py-2 border rounded-lg w-full md:w-2/5"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price"
              className="px-4 py-2 border rounded-lg w-full md:w-2/5"
            />
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full md:w-2/5"
            >
              <option key={""} value={""}>
                All Categories
              </option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full md:w-2/5"
            >
              <option key={""} value={""}>
                All Locations
              </option>
              {Object.entries(warehouses).map(([location, code]) => (
                <option key={location} value={code}>
                  {handleString(location)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap mt-4 -mx-2">
          {paginate(products, currentPage, itemsPerPage).map(
            (product: Product) => (
              <div
                className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 p-2"
                key={product._id}
              >
                <ProductCard
                  setModalVisible={setIsSetPresenceModalVisible}
                  setSelectedProductId={setSelectedProductId}
                  product={product}
                />
              </div>
            )
          )}
        </div>

        <div className="mt-4">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(products.length / itemsPerPage)}
            onPageChange={(page) => setCurrentPage(page.selected)}
            containerClassName={"pagination flex space-x-2"}
            activeClassName={"bg-blue-500 text-white px-2 rounded-lg"}
            pageClassName={"px-2 py-1 rounded-lg hover:bg-blue-200"}
          />
        </div>
      </div>
    </Layout>
  );
}

export default ProductMain;
