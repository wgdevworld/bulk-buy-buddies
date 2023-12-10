"use client";

import React, { useState, useEffect, Image } from "react";
import { useRouter } from 'next/navigation';
import ShopperCardProps from "@/components/ShopperMatch/ShopperCard"

export interface MatchedRequest {
    _id: string;
    userID: string;
    category: string;
    buddy: string;
    buddyID: string;
    quantity: number;
    location: string;
    timeStart: Date;
    timeEnd: Date;
    status: string;
}

function MatchedRequestCard({
    // _id,
    // userID,
    // category,
    // buddy,
    // buddyID,
    // quantity,
    // location,
    // timeStart,
    // timeEnd,
    // status,
    request, 
    setModalVisible,
}: {
    request: MatchedRequest;
    setModalVisible: (visible: boolean) => void;
}) {

    return (
        <div className="-mt-2 p-2 sm:mt-0 sm:w-full sm:max-w-sm sm:flex-shrink-0" onClick={() => {
            setModalVisible(true);
          }}>
            <div className="rounded-2xl bg-gray-50 py-10 text-left ring-1 ring-inset ring-gray-900/5 sm:flex sm:flex-col sm:py-8 sm:justify-start">
                <div className=" max-w-none px-8">
                    <p className="text-2xl font-bold tracking-tight text-gray-900 truncate"> {request.category} </p>
                    <p>
                    <span className="inline-flex items-baseline">
                        <img src="../images/buddy.png" alt="" className="self-center w-5 h-5 mx-1" />
                        <span className="break-normal text-base font-medium ml-1 text-gray-600"> Buddy: </span>
                        <span className="text-base font-normal ml-1 text-gray-600"> {request.buddy} </span>
                    </span> 
                    </p>
                    <p className="mt-3">
                        <p>
                            <span className="break-normal text-base font-medium text-gray-600"> Quantity: </span>
                            <span className="text-base font-normal ml-1 text-gray-600">{request.quantity} </span>
                        </p>
                        <p>
                            <span className="break-normal text-base font-medium text-gray-600"> Location: </span>
                            <span className="text-base font-normal ml-1 text-gray-600">{request.location} </span>
                        </p>
                        <p>
                            <span className="break-normal text-base font-medium text-gray-600"> Date Range: </span>
                            <span className="text-base font-normal ml-1 text-gray-600">{new Date(request.timeStart).toLocaleString()} 
                            to {new Date(request.timeEnd).toLocaleString()} </span>
                        </p>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default MatchedRequestCard;