"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TbForms, TbReportAnalytics } from "react-icons/tb";
import { CiViewTable, CiCircleChevLeft } from "react-icons/ci";
import Link from "next/link";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true); 
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Controls sidebar visibility
  const pathname = usePathname();

  // Define the navigation links and their properties
  const navlinks = [
    { icon: <TbForms />, title: "Form", href: "/form" },
    { icon: <CiViewTable />, title: "Listing", href: "/listing" },
    { icon: <TbReportAnalytics />, title: "Report", href: "/report" },
  ];

  // Calculate the toggle button class based on sidebar state
  const toggleSidebarButtonClass = !isSidebarOpen
    ? "-right-10 rounded-xl p-4 rotate-180 bg-gray-700"
    : "right-5";

  return (
    <div
      className={`w-64 sm:w-80 h-full fixed top-0 bg-gray-700 text-gray-400 z-50 transition-transform duration-500 ${
        isSidebarOpen ? "" : "-translate-x-full"
      }`}
      aria-label="Sidebar"
    >
      <div className="transition-transform duration-500 flex items-center justify-between py-8 px-8 font-bold text-xl text-white relative">
        <h1>Dashboard</h1>
        {/* Sidebar toggle button */}
        <div
          className={`absolute text-white md:hidden transition-transform duration-500 ${toggleSidebarButtonClass}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle sidebar visibility
          aria-label="Toggle sidebar"
        >
          <CiCircleChevLeft />
        </div>
      </div>

      {/* Navigation links */}
      <nav>
        <ul>
          {navlinks.map((nav, index) => (
            <li key={index}>
              <Link href={nav.href}>
                <div
                  className={`pl-8 py-5 flex items-center transition duration-500 cursor-pointer select-none ${
                    pathname === nav.href
                      ? "border-l-3 bg-gray-500 text-white" // Active link style
                      : "hover:bg-gray-600"
                  }`}
                  aria-label={nav.title}
                >
                  <div>{nav.icon}</div>
                  <div className="pl-5">{nav.title}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}