"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import MatchedRequestCard, { MatchedRequest } from "./matchedRequestCard";
import Modal from "../../ProductList/IndicatePresenceModal";
import { Product } from "@/components/ProductList/ProductMain";

function MatchedRequestScroll() {
    const [matchedReqs, setMatchedReqs] = useState<MatchedRequest[]>([]);
    const router = useRouter()
    const [isSetPresenceModalVisible, setIsSetPresenceModalVisible] = useState(false);
    const [requestID, setRequestID] = useState("");
    const [productQuantity, setProductQuantity] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>();


    const handleSearch = async () => {
        try {
            const url = `http://127.0.0.1:5000/search?query=${encodeURIComponent(
                searchTerm
            )}&min_price=${encodeURIComponent(""
            )}&max_price=${encodeURIComponent(""
            )}&category=${encodeURIComponent("")}&location=${encodeURIComponent(""
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


    useEffect(() => {
        getUserMatchedReqs();
    }, []);

    const handleNavigation = async () => {
        try {
            const query = {
                requestID: requestID,
                productId: selectedProduct,
                product_quantity: productQuantity
            };
            const response = await fetch(`http://127.0.0.1:5000/update_transactions`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(query),
            })
            setIsSetPresenceModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    }
    const getUserMatchedReqs = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/get_matched_reqs", {
                credentials: "include",
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const matches = await response.json();
            console.log(matches)
            setMatchedReqs(matches)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="mt-2 p-2">
            <Modal
                show={isSetPresenceModalVisible}
                close={() => {
                    setIsSetPresenceModalVisible(false);
                }}
            >
                <div className="bg-white rounded-lg shadow-md p-6">
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
                    {products.map((product: Product) => {
                        return (
                            <div key={product._id}>
                                <button
                                    style={{ display: 'block', marginBottom: '5px' }}
                                    onClick={() => { setSelectedProduct(product._id) }}
                                >
                                    <text className={`flex ${product._id === selectedProduct ? 'font-bold' : 'font-normal'}`}>
                                        {product.name}
                                    </text>
                                </button>
                            </div>
                        );
                    })}
                    <input
                        type="number"
                        value={productQuantity}
                        onChange={(e) => setProductQuantity(e.target.value)}
                        placeholder="Set quantity"
                        className="px-4 py-3 border rounded-lg w-full text-lg"
                    />

                    <button type="button" className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600 w-full md:w-auto" onClick={() => {
                        handleNavigation()
                    }}>Submit</button>
                </div>
            </Modal>
            <p>
                <span className="text-xl font-bold tracking-tight text-gray-900"> Top Matched Requests </span>
                <a href="/user/requestsPage" className="ml-3 underline underline-offset-auto font-light text-xs hover:underline-offset-2">View all matched requests >> </a>
            </p>

            {matchedReqs.length == 0 ?
                <div className="mt-2 mb-10 p-2 sm:mt-0 sm:w-full sm:max-w-sm sm:flex-shrink-0">
                    <span className="break-normal text-base font-medium ml-1 text-gray-600"> No current matched requests </span>
                </div>
                :
                <ul className="flex flex-row overflow-x-auto flex-nowrap">
                    {matchedReqs.map((item) => (
                        <MatchedRequestCard
                            request={item}
                            setModalVisible={setIsSetPresenceModalVisible}
                            setRequestID={setRequestID}
                        />
                    ))}
                </ul>
            }
        </div>
    );
}

export default MatchedRequestScroll;