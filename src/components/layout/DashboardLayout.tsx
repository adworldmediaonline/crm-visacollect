"use client";

import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Load sidebar state from localStorage on component mount
    useEffect(() => {
        const savedState = localStorage.getItem("sidebarCollapsed");
        if (savedState !== null) {
            setSidebarCollapsed(JSON.parse(savedState));
        } else {
            // Default to collapsed on mobile, expanded on desktop
            setSidebarCollapsed(isMobile);
        }
    }, [isMobile]);

    // Toggle sidebar and save state to localStorage
    const toggleSidebar = () => {
        const newState = !sidebarCollapsed;
        setSidebarCollapsed(newState);
        localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                isMobile={isMobile}
                toggleSidebar={toggleSidebar}
                sidebarCollapsed={sidebarCollapsed}
            />
            <Sidebar
                collapsed={sidebarCollapsed}
                isMobile={isMobile}
            />
            <main
                className={`transition-all duration-300 ${sidebarCollapsed ? "ml-[80px]" : "ml-[250px]"
                    } ${isMobile ? "ml-[80px]" : ""}`}
            >
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
