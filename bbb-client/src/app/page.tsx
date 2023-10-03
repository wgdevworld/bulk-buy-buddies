"use client";

import Messenger from "@/components/Messenger";
import ProductList from "@/components/ProductList";
import ShopperForm from "@/components/ShopperForm";

export default function Home() {
  return (
    <div>
      {
        <>
          <Messenger />
          <ShopperForm />
        </>
      }
    </div>
  );
}
