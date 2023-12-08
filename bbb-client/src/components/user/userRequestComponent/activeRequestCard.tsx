"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import ShopperCardProps from "@/components/ShopperMatch/ShopperCard"

export interface RequestWithMatches {
    _id: string;
    userID: string;
    category: string;
    quantity: number;
    location: string;
    timeStart: Date;
    timeEnd: Date;
    status: string;
    matches: Array<string>;
}

export interface Transaction2 {
    _id: string;
    userID: string;
    category: string;
    quantity: number;
    location: string;
    timeStart: string;
    timeEnd: string;
    status: string;
}


function ActiveRequestCard({
    _id,
    userID,
    category,
    quantity,
    location,
    timeStart,
    timeEnd,
    matches,
}: RequestWithMatches) {

    return (
        <div className="-mt-2 p-2 sm:mt-0 sm:w-full sm:max-w-sm sm:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-left ring-1 ring-inset ring-gray-900/5 sm:flex sm:flex-col sm:py-8 sm:justify-start">
                <div className=" max-w-none px-8">
                    <p className="text-2xl font-bold tracking-tight text-gray-900"> {category} </p>
                    <p>
                        <span className="break-normal text-base font-bold text-lime-600"> • </span>
                        <span className="text-base font-medium text-gray-600">{matches.length} requests pending </span>
                    </p>
                    <p className="mt-3">
                        <p>
                            <span className="break-normal text-base font-medium text-gray-600"> Quantity: </span>
                            <span className="text-base font-normal text-gray-600">{quantity} </span>
                        </p>
                        <p>
                            <span className="break-normal text-base font-medium text-gray-600"> Location: </span>
                            <span className="text-base font-normal text-gray-600">{location} </span>
                        </p>
                        <p>
                            <span className="break-normal text-base font-medium text-gray-600"> Date Range: </span>
                            <span className="text-base font-normal text-gray-600">{new Date(timeStart).toLocaleString()} to {new Date(timeEnd).toLocaleString()} </span>
                        </p>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ActiveRequestCard;


/*

        <div class="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div class="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                <div class="mx-auto max-w-xs px-8">
                    <p class="text-base font-semibold text-gray-600">Pay once, own it forever</p>
                    <p class="mt-6 flex items-baseline justify-center gap-x-2">
                        <span class="text-5xl font-bold tracking-tight text-gray-900">$349</span>
                        <span class="text-sm font-semibold leading-6 tracking-wide text-gray-600">USD</span>
                    </p>
                    <a href="#" class="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get access</a>
                    <p class="mt-6 text-xs leading-5 text-gray-600">Invoices and receipts available for easy company reimbursement</p>
                </div>
            </div>
        </div>

*/