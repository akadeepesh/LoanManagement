"use client";

import React from "react";
import { withAuth } from "@/components/withAuth";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Application {
  officerImage: string;
  officerName: string;
  amount: number;
  dateApplied: string;
  status: string;
}

function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    // Simulating fetching data from an API
    const mockApplications = [
      {
        officerImage: "https://randomuser.me/api/portraits/men/1.jpg",
        officerName: "John Doe",
        amount: 5000,
        dateApplied: "2023-06-15",
        status: "Approved",
      },
      {
        officerImage: "https://randomuser.me/api/portraits/women/2.jpg",
        officerName: "Jane Smith",
        amount: 10000,
        dateApplied: "2023-06-14",
        status: "Pending",
      },
      {
        officerImage: "https://randomuser.me/api/portraits/men/3.jpg",
        officerName: "Bob Johnson",
        amount: 7500,
        dateApplied: "2023-06-13",
        status: "Rejected",
      },
    ];

    setApplications(mockApplications);
  }, []);

  return (
    <div className="p-8">
      <Link href="/dashboard/apply">
        <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Get Loan
        </button>
      </Link>
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left">Loan Officer</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Date Applied</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2 flex items-center">
                  <img
                    src={app.officerImage}
                    alt={app.officerName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-black">{app.officerName}</span>
                </td>
                <td className="px-4 text-black py-2">
                  ${app.amount.toLocaleString()}
                </td>
                <td className="px-4 text-black py-2">
                  {new Date(app.dateApplied).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      app.status === "Approved"
                        ? "bg-green-200 text-green-800"
                        : app.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withAuth(Applications, ["user"]);
