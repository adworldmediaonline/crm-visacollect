"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Home,
    Users,
} from "lucide-react";

interface SidebarProps {
    collapsed: boolean;
    isMobile: boolean;
}

interface SidebarItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    collapsed: boolean;
}

function SidebarItem({ href, icon, label, collapsed }: SidebarItemProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center py-3 px-4 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors",
                isActive && "bg-blue-50 text-blue-600 font-medium",
                collapsed ? "justify-center" : ""
            )}
        >
            <div className={cn("", collapsed ? "mr-0" : "mr-3")}>{icon}</div>
            {!collapsed && <span>{label}</span>}
        </Link>
    );
}

export default function Sidebar({ collapsed, isMobile }: SidebarProps) {
    if (isMobile) return null;

    return (
        <aside
            className={cn(
                "bg-gray-200 border-r border-gray-400 fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 z-10",
                collapsed ? "w-[80px]" : "w-[250px]"
            )}
        >
            <div className={cn(
                "flex items-center p-4",
                collapsed ? "justify-center" : "justify-start"
            )}>
                {/* Replace with your actual logo */}
                <div className="relative h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        VC
                    </div>
                </div>
                {!collapsed && (
                    <span className="ml-3 font-semibold text-lg">Visa Collect</span>
                )}
            </div>

            <nav className="mt-6 px-2">
                <SidebarItem
                    href="/dashboard"
                    icon={<Home size={20} />}
                    label="Dashboard"
                    collapsed={collapsed}
                />
                <SidebarItem
                    href="/ethiopia-visa"
                    icon={<Users size={20} />}
                    label="All Ethiopia Visa"
                    collapsed={collapsed}
                />
            </nav>
        </aside>
    );
}
