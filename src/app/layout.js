"use client";
import { Inter } from "next/font/google";
import layout from "./global.module.css";
import common from "./common.css"
import SideNavbar from "./components/SideNavbar";
import TopNav from "./components/TopNav";
import { useState } from "react";
import { DataProvider } from "./Data/DataContext";

export default function RootLayout({ children }) {
  const [showSideNavbar, setShowSideNavbar] = useState(true); 
  

  const toggleSideNavbar = () => {
    setShowSideNavbar(!showSideNavbar);
  };

  
    
 

  return (
    <html lang="en">
      <body className={layout.adminMain}>
        
        <div className={layout.sideNav} style={{ width: showSideNavbar ? '20%' : '0', overflow: 'hidden' }}>
          {showSideNavbar && <SideNavbar />}
        </div>
        <div className={layout.pageContent} style={{ width: showSideNavbar ? '80%' : '100%' }}>
          <TopNav toggleSideNavbar={toggleSideNavbar} />
          <DataProvider>

          {children}
          </DataProvider>
          
        </div>

        {/* <Login/> */}
      </body>
    </html>
  );
}
