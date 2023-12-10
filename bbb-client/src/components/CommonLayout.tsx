import React from "react";
import TopNavBar from "./TopNavBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <TopNavBar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
