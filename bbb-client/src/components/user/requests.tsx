"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Account } from "@/components/user/account";
import Logout from "@/components/user/logout";
import ActiveRequestScroll from "./userRequestComponent/activeRequestScroll";
import MatchedRequestScroll from "./userRequestComponent/matchedRequestScroll";
import GeneralRequestCard, {GeneralRequest} from "./userRequestComponent/generalRequestCard";
import ReactPaginate from "react-paginate";
import Modal from "../ProductList/IndicatePresenceModal";
import DatePicker from "react-datepicker";

export const sorts = ["Products A-Z"]
export const statuses = ["All","Active","Matched","Fulfilled"]

function RequestsPage() {
    const [requests, setRequests] = useState<GeneralRequest[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("");
    const [isSetPresenceModalVisible, setIsSetPresenceModalVisible] = useState(false);
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);


    const paginate = (
        arr: GeneralRequest[],
        currentPage: number,
        itemsPerPage: number
    ) => {
        const startIndex = currentPage * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const sliced = arr.slice(startIndex, endIndex);
        return sliced
    };

    useEffect(() => {
        handleSearch1();
        getCategories();
        getLocations();
    }, []);

    const getCategories= async () => {
        console.log("categories")
        try {
          const response = await fetch("http://127.0.0.1:5000/get_filter_categories", {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
          })
          const res = await response.json();
        //   console.log(res)
          const cat = res["categories"]
          cat.push("All")
        //   console.log(cat)
          setCategories(cat)
        } catch (error) {
          console.error(error);
        }
    }

    const getLocations= async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/get_filter_locations", {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
          })
          const res = await response.json();
        //   console.log(res)
          const loc = res["locations"]
          
          loc.push("All")
        //   console.log(loc)
          setLocations(loc)
        } catch (error) {
          console.error(error);
        }
    }

    const handleSearch1 = async () => {
        // console.log(location);
        console.log("searching for", category);
        try {
          const url = `http://127.0.0.1:5000/search_reqs?status=${encodeURIComponent(
            status
          )}&category=${encodeURIComponent(
            category
          )}&location=${encodeURIComponent(
            location
          )}&minDate=${encodeURIComponent("Nope")}&maxDate=${encodeURIComponent(
            "Nope"
          )}&sortBy=${encodeURIComponent(
            sortBy
          )}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const requests = await response.json();
          const newRequests = [...requests];
        //   newRequests.sort((a, b) =>{
        //       return a.category.localeCompare(b.category);
        //   });
          setRequests(newRequests);
          setIsSetPresenceModalVisible(false);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
    };

    const handleSearch = async () => {
        // console.log(location);
        // console.log("searching for", category);
        try {
          const url = `http://127.0.0.1:5000/search_reqs?status=${encodeURIComponent(
            status
          )}&category=${encodeURIComponent(
            category
          )}&location=${encodeURIComponent(
            location
          )}&minDate=${encodeURIComponent("Nope")}&maxDate=${encodeURIComponent(
            "Nope"
          )}&sortBy=${encodeURIComponent(
            sortBy
          )}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const requests = await response.json();
          const newRequests = [...requests];
        newRequests.sort((a, b) =>{
            return a.category.localeCompare(b.category);
        });
        setRequests(newRequests);
          console.log("RESULTS")
          setIsSetPresenceModalVisible(false)
        } catch (error) {
          console.error("Error fetching products:", error);
        }
    };

    const openModal = () => {
        setIsSetPresenceModalVisible(true);
    }

    return(
        <div className="my-32">
            <Modal
                show={isSetPresenceModalVisible}
                close={() => {
                    setIsSetPresenceModalVisible(false);
                }}
            >
                <div className="flex flex-row overflow-y-auto rounded-md bg-white px-6 py-6 max-w-5xl max-h-96">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-4xl">Filter</h2>
                    </div>
                    <div className="mx-auto mt-10 max-w-xl sm:mt-15 items-center justify-center lg:mx-auto lg:w-full lg:max-w-lg">
                        <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium leading-6 text-gray-900">Sort By</label>
                                    <div className="mt-2">
                                        <select name="sortBy" onChange={(e) => setSortBy(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                        {sorts.map(s =>
                                            <option key={s} value={s}>{s}</option>
                                        )};
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-gray-900/10 pb-12">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium leading-6 text-gray-900">Status</label>
                                    <div className="mt-2">
                                        <select name="status" onChange={(e) => setStatus(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                        {statuses.map(s =>
                                            <option key={s} value={s}>{s}</option>
                                        )};
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-gray-900/10 pb-12">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium leading-6 text-gray-900">Category</label>
                                    <div className="mt-2">
                                        <select name="category" onChange={(e) => setCategory(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                        {categories.map(s =>
                                            <option key={s} value={s}>{s}</option>
                                        )};
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-gray-900/10 pb-12">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium leading-6 text-gray-900">Location</label>
                                    <div className="mt-2">
                                        <select name="location" onChange={(e) => 
                                            setLocation(e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                        {locations.map(s =>
                                            <option key={s} value={s}>{s}</option>
                                        )};
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 flex items-center justify-end gap-x-6">
                            <button onClick={handleSearch} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go</button>
                        </div>
                    </div>
                </div>
            </Modal>
            <div className="mx-20 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">My Requests</h2>
                <button onClick={openModal} className="flex justify-center items-center mb-3 rounded-md bg-clear px-3 py-1.5 text-sm font-semibold leading-6 text-blue-900 shadow-sm outline outline-2 outline-blue-900 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900" > Filter </button>
                    <div className="flex flex-wrap mt-4 -mx-2 place-content-center">
                        {paginate(requests, currentPage, itemsPerPage).map(
                            (request: GeneralRequest) => (
                                <GeneralRequestCard
                                    key={request._id}
                                    _id={request._id}
                                    userID={request.userID}
                                    category={request.category}
                                    buddy={request.buddy}
                                    buddyID={request.buddyID}
                                    quantity={request.quantity}
                                    location={request.location}
                                    timeStart={request.timeStart}
                                    timeEnd={request.timeEnd}
                                    status={request.status}
                                    matches={request.matches}
                                />
                            )
                        )}
                    </div>

                <div className="flex mt-4 place-content-center">
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        pageCount={Math.ceil(requests.length / itemsPerPage)}
                        onPageChange={(page) => setCurrentPage(page.selected)}
                        containerClassName={"pagination flex space-x-2"}
                        activeClassName={"bg-blue-500 text-white px-2 rounded-lg"}
                        pageClassName={"px-2 py-1 rounded-lg hover:bg-blue-200"}
                    />
                </div>
            </div>
        </div>
    )
}
export default RequestsPage;