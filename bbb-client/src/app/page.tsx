/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
"use client";

import Messenger from "@/components/Messenger";
import ProductRec from "@/components/ProductRec";
import ProductList from "@/components/ProductList/ProductMain";
import Register from "@/components/user/register";
import Logout from "@/components/user/logout";
import Login from "@/components/user/login";
import Locations from "@/components/locations/locations";
import ShopperForm from "@/components//ShopperForm/ShopperForm";
import ResetPassword from "@/components/user/resetPassword";
import Account from "@/components/user/account";
import ShopperMatch from "@/components/ShopperMatch/ShopperMatch";

export default function Home() {
  return (
    <div>
      <Messenger /> 
      <ProductRec />
      {/* <ProductList /> */}
      <Register />
      <Logout/> 
      <Login />
      <Locations />
      <ShopperForm />
      <ShopperMatch />
      <ResetPassword />
      <Account />
    </div>
  );
}
