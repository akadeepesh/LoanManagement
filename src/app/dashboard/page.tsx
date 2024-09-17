"use client";

import React from "react";
import { withAuth } from "@/components/withAuth";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Application {
  _id: string;
  amount: number;
  purpose: string;
  status: string;
  createdAt: string;
  verifiedBy?: {
    name: string;
    email: string;
  };
}

function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/loan-application");
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        const response = await fetch(`/api/loan-application/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setApplications(applications.filter((app) => app._id !== id));
        } else {
          console.error("Failed to delete application");
        }
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };

  return (
    <div className="p-8">
      <Link href="/dashboard/apply">
        <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Apply for a Loan
        </button>
      </Link>
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Purpose</th>
              <th className="py-3 px-4 text-left">Date Applied</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Verified By</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-b">
                <td className="px-4 text-black py-2">
                  ${app.amount.toLocaleString()}
                </td>
                <td className="px-4 text-black py-2">{app.purpose}</td>
                <td className="px-4 text-black py-2">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      app.status === "verified"
                        ? "bg-green-200 text-green-800"
                        : app.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-4 text-black py-2">
                  {app.verifiedBy ? app.verifiedBy.name : "N/A"}
                </td>
                <td className="px-4 py-2">
                  <Link href={`/dashboard/${app._id}/edit`}>
                    <button className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
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
