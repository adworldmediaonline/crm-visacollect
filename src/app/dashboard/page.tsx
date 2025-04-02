"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to your VisaCollect CRM dashboard.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Total Clients</h2>
            <p className="text-3xl font-bold">128</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Active Applications</h2>
            <p className="text-3xl font-bold">42</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Upcoming Appointments</h2>
            <p className="text-3xl font-bold">7</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Revenue (MTD)</h2>
            <p className="text-3xl font-bold">$24,500</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Sample activity items */}
            <div className="pb-4 border-b">
              <p className="font-medium">New client registration</p>
              <p className="text-sm text-gray-500">John Doe - 2 hours ago</p>
            </div>
            <div className="pb-4 border-b">
              <p className="font-medium">Application status updated</p>
              <p className="text-sm text-gray-500">Sarah Smith - 4 hours ago</p>
            </div>
            <div className="pb-4 border-b">
              <p className="font-medium">Payment received</p>
              <p className="text-sm text-gray-500">Michael Johnson - 1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
