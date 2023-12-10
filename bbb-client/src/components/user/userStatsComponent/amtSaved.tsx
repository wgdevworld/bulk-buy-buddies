"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import ShopperCardProps from "@/components/ShopperMatch/ShopperCard"

function AmountSavedStat({ unitsSaved }: { unitsSaved: string }) {

    return (
        <div className="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt className="text-base leading-7 text-gray-600">units saved</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight sm:text-5xl text-blue-700">{unitsSaved}</dd>
      </div>
    )
}

export default AmountSavedStat;