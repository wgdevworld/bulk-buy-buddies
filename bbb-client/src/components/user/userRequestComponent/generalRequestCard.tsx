"use client";

import React, { useState, useEffect, Image } from "react";
import { useRouter } from 'next/navigation';

export interface GeneralRequest {
    _id: string;
    userID: string;
    category: string;
    buddy: string | undefined;
    buddyID: string | undefined;
    quantity: number;
    location: string;
    timeStart: Date;
    timeEnd: Date;
    status: string;
    matches: Array<string> | undefined;
}

function GeneralRequestCard(
    {
    _id,
    userID,
    category,
    buddy,
    buddyID,
    quantity,
    location,
    timeStart,
    timeEnd,
    status,
    matches,
}: GeneralRequest
) {
    return (
        <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-lg lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-left ring-1 ring-inset ring-gray-900/5 sm:flex sm:flex-col sm:py-8 sm:justify-start">
                <div className=" max-w-none px-8">
                    <p className="text-2xl font-bold tracking-tight text-gray-900 truncate"> {category} </p>
                    <p>
                        <span className="break-normal text-base font-bold text-gray-900"> Status: </span>
                        <span className="text-base font-medium text-gray-600">{status}</span>
                    </p>
                    {matches ?
                        <p>
                            <span className="break-normal text-base font-bold text-lime-600"> • </span>
                            <span className="text-base font-medium text-gray-600">{matches.length} requests pending </span>
                        </p>
                        :
                        <p>
                        <span className="inline-flex items-baseline">
                            <img src="../images/buddy.png" alt="" className="self-center w-5 h-5 mx-1" />
                            <span className="break-normal text-base font-medium ml-1 text-gray-600"> Buddy: </span>
                            <span className="text-base font-normal ml-1 text-gray-600"> {buddy ? buddy : "N/A"} </span>
                        </span> 
                        </p>
                    }
                    <p className="mt-3">
                        <p>
                            <span className="break-normal text-base font-medium text-gray-600"> Quantity: </span>
                            <span className="text-base font-normal ml-1 text-gray-600">{quantity} </span>
                        </p>
                        <p>
                            <span className="break-normal text-base font-medium text-gray-600"> Location: </span>
                            <span className="text-base font-normal ml-1 text-gray-600">{location} </span>
                        </p>
                        <p>
                            <span className="break-normal text-base font-medium text-gray-600"> Date Range: </span>
                            <span className="text-base font-normal ml-1 text-gray-600">{new Date(timeStart).toLocaleString()} to {new Date(timeEnd).toLocaleString()} </span>
                        </p>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default GeneralRequestCard