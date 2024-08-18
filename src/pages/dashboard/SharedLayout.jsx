import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import NavigationTab from "../../components/NavigationTab";
const Sharedlayout = () => {
  return (
      <>
          <Navbar />
          <NavigationTab/>
      <Outlet />
    </>
  );
};

export default Sharedlayout;
