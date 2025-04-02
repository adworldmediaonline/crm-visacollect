"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="h-screen flex flex-col">
            <Header
                toggleSidebar={toggleSidebar}
                sidebarCollapsed={sidebarCollapsed}
                isMobile={isMobile}
            />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar collapsed={sidebarCollapsed} isMobile={isMobile} />
                <main className={cn(
                    "flex-1 overflow-auto p-6 transition-all duration-300",
                    !isMobile && (sidebarCollapsed ? "ml-[80px]" : "ml-[250px]"),
                )}>
                    {children}
                </main>
            </div>
        </div>
    );
}
