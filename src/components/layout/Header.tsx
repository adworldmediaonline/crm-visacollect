"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
    ChevronDown,
    User,
    LogOut,
    Settings,
    AlignLeft,
    AlignRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface HeaderProps {
    isMobile?: boolean;
    toggleSidebar: () => void;
    sidebarCollapsed: boolean;
}

export default function Header({ isMobile, toggleSidebar, sidebarCollapsed }: HeaderProps) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <header className="bg-gray-200 border-b border-gray-400 h-16 flex items-center px-4 sticky top-0 z-10">
            <div className="flex items-center justify-between w-full">

                <div className="flex items-center">
                    {!isMobile && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="mr-4"
                        >
                            {sidebarCollapsed ? <AlignRight size={20} /> : <AlignLeft size={20} />}
                        </Button>
                    )}
                </div>

                <div className="flex items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2">
                                <User size={20} className="text-gray-600" />
                                <span className="hidden sm:inline">{user?.name || "User"}</span>
                                <ChevronDown size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
